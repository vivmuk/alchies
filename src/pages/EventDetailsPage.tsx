import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { fetchEvents, updateRSVP, updateRating, archiveEvent, unarchiveEvent, deleteEvent, defaultUsers, RSVP, Event } from '../features/events/eventsSlice';
import { format, parseISO } from 'date-fns';
import BottomNavigation from '../components/BottomNavigation';
import ImageWithFallback from '../components/ImageWithFallback';
import updateEvent from '../features/events/updateEvent';
import MapDisplay from '../components/MapDisplay';

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { events, status } = useAppSelector((state: any) => state.events);
  const event = events.find((e: Event) => e.id === id);
  
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [rsvpComments, setRsvpComments] = useState<Record<string, string>>({});
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editingRating, setEditingRating] = useState<string | null>(null);
  
  // Date and time editing states
  const [isEditingDateTime, setIsEditingDateTime] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [editDateSuccess, setEditDateSuccess] = useState<string>('');
  
  // Calculate average rating
  const ratings = event?.rsvps.filter((rsvp: RSVP) => rsvp.rating !== null && rsvp.rating !== undefined)
    .map((rsvp: RSVP) => rsvp.rating as number) || [];
  const averageRating = ratings.length > 0
    ? (ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length).toFixed(1)
    : 'Not yet rated';
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEvents());
    }
  }, [status, dispatch]);
  
  useEffect(() => {
    if (event) {
      setNewDate(event.date);
      setNewTime(event.time);
    }
  }, [event]);
  
  // Helper function to format date
  const formatDate = (date: string) => {
    return format(parseISO(date), 'EEEE, MMMM d, yyyy');
  };
  
  // Handle copy shareable link
  const handleCopyLink = () => {
    if (!event?.shareableLink) return;
    
    navigator.clipboard.writeText(event.shareableLink)
      .then(() => {
        setCopySuccess('Link copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(() => {
        setCopySuccess('Failed to copy');
      });
  };
  
  // Handle direct RSVP toggle
  const handleRsvpToggle = (userId: string, currentStatus: string) => {
    if (!event) return;
    
    console.log(`Toggling RSVP for user ${userId} with current status: ${currentStatus}`);
    
    // Find user info from defaultUsers array
    const user = defaultUsers.find(u => u.id === userId);
    if (!user) {
      console.error(`User with ID ${userId} not found in defaultUsers`);
      return;
    }
    
    const userName = user.name;
    console.log(`Found user: ${userName} with ID: ${userId}`);
    
    // Find current RSVP if it exists
    const rsvp = event.rsvps.find((r: RSVP) => r.userId === userId);
    console.log('Current RSVP:', rsvp);
    
    // Toggle between attending and not-attending
    let newStatus: 'attending' | 'not-attending' | 'undecided' = 'attending';
    if (currentStatus === 'attending') {
      newStatus = 'not-attending';
    } else if (currentStatus === 'not-attending') {
      newStatus = 'attending';
    } else {
      newStatus = 'attending';
    }
    
    console.log(`Setting new status to: ${newStatus}`);
    
    // Get existing comment and rating if there is one
    const comment = rsvp?.comment || '';
    const rating = rsvp?.rating || null;
    
    // Create updated RSVP object
    const updatedRsvp: RSVP = {
      userId,
      name: userName,
      status: newStatus,
      comment,
      rating
    };
    
    console.log('Dispatching updateRSVP with:', updatedRsvp);
    
    // Update the RSVP
    dispatch(updateRSVP({
      eventId: event.id,
      rsvp: updatedRsvp
    })).then(result => {
      if (result.meta.requestStatus === 'fulfilled') {
        console.log('RSVP updated successfully');
      } else if (result.meta.requestStatus === 'rejected') {
        console.error('Failed to update RSVP');
      }
    }).catch(error => {
      console.error('Error updating RSVP:', error);
    });
  };
  
  // Handle comment update
  const handleUpdateComment = (userId: string) => {
    if (!event) return;
    
    console.log(`Updating comment for user ${userId}`);
    
    // Find current RSVP
    const rsvp = event.rsvps.find((r: RSVP) => r.userId === userId);
    if (!rsvp) {
      console.error(`RSVP not found for user ${userId}`);
      return;
    }
    
    // Find user info
    const user = defaultUsers.find(u => u.id === userId);
    if (!user) {
      console.error(`User with ID ${userId} not found in defaultUsers`);
      return;
    }
    
    const userName = user.name;
    const comment = rsvpComments[userId] || '';
    
    console.log(`Updating comment for ${userName} to: "${comment}"`);
    
    // Create updated RSVP object
    const updatedRsvp: RSVP = {
      userId,
      name: userName,
      status: rsvp.status,
      comment,
      rating: rsvp.rating
    };
    
    // Update the RSVP
    dispatch(updateRSVP({
      eventId: event.id,
      rsvp: updatedRsvp
    })).then(result => {
      if (result.meta.requestStatus === 'fulfilled') {
        console.log('Comment updated successfully');
      } else if (result.meta.requestStatus === 'rejected') {
        console.error('Failed to update comment');
      }
    }).catch(error => {
      console.error('Error updating comment:', error);
    });
    
    setEditingComment(null);
  };
  
  // Handle rating update
  const handleUpdateRating = (userId: string, rating: number | null) => {
    if (!event) return;
    
    console.log(`Updating rating for ${userId} to ${rating} for event ${event.id}`);
    
    // Find the current RSVP status
    const currentRsvp = event.rsvps.find((r: RSVP) => r.userId === userId);
    
    if (currentRsvp) {
      console.log('Current RSVP before update:', currentRsvp);
    }
    
    dispatch(updateRating({
      eventId: event.id,
      userId: userId,
      rating: rating
    })).then((result: any) => {
      if (result.meta.requestStatus === 'fulfilled') {
        console.log('Rating updated successfully');
        // Force refresh by fetching the event again
        setTimeout(() => {
          dispatch(fetchEvents());
        }, 500);
      } else if (result.error) {
        console.error('Failed to update rating:', result.error);
      }
    }).catch((error) => {
      console.error('Error updating rating:', error);
    });
    
    setEditingRating(null);
  };
  
  // Toggle date and time edit mode
  const toggleDateTimeEdit = () => {
    setIsEditingDateTime(!isEditingDateTime);
    if (!isEditingDateTime) {
      setNewDate(event?.date || '');
      setNewTime(event?.time || '');
    }
    setEditDateSuccess('');
  };
  
  // Handle date and time update
  const handleUpdateDateTime = () => {
    if (!event) return;
    
    dispatch(updateEvent({
      id: event.id,
      updates: {
        date: newDate,
        time: newTime
      }
    })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        setIsEditingDateTime(false);
        setEditDateSuccess('Date and time updated successfully!');
        setTimeout(() => setEditDateSuccess(''), 2000);
      }
    });
  };
  
  // Handle archive/unarchive event
  const handleArchiveToggle = () => {
    if (!event) return;
    
    if (event.isArchived) {
      dispatch(unarchiveEvent(event.id));
    } else {
      dispatch(archiveEvent(event.id));
    }
  };
  
  // Handle delete event
  const handleDeleteEvent = () => {
    if (!event) return;
    
    if (window.confirm('Are you sure you want to permanently delete this event? This action cannot be undone.')) {
      dispatch(deleteEvent(event.id)).then(() => {
        navigate('/');
      });
    }
  };
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background dark:bg-dark-background text-gray-900 dark:text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="min-h-screen bg-background dark:bg-dark-background text-gray-900 dark:text-white p-4">
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-md text-center">
          <h2 className="text-xl font-bold mb-4">Event Not Found</h2>
          <p className="mb-4">The event you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-xl transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background dark:bg-dark-background text-gray-900 dark:text-white pb-16">
      {/* Header */}
      <header className="sticky top-0 bg-white dark:bg-dark-card shadow-md p-4 z-10 flex items-center border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => navigate('/')}
          className="mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">Event Details</h1>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* Event status banner */}
        {event.status === 'cancelled' && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-3 rounded-xl mb-4 text-center">
            This event has been cancelled
          </div>
        )}
        
        {event.isArchived && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-3 rounded-xl mb-4 text-center">
            This event is in the archive
          </div>
        )}
        
        {/* Event image */}
        {event.imageUrl && (
          <div className="w-full h-48 sm:h-64 mb-6 rounded-xl overflow-hidden">
            <ImageWithFallback
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Event details */}
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
          
          <div className="flex flex-col mb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {isEditingDateTime ? (
                  <div className="flex flex-col space-y-2">
                    <div className="flex space-x-2">
                      <input 
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="p-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-surface text-gray-900 dark:text-white"
                      />
                      <input 
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="p-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-surface text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={handleUpdateDateTime}
                        className="px-2 py-1 text-xs bg-primary text-white rounded hover:bg-indigo-600"
                      >
                        Save
                      </button>
                      <button 
                        onClick={toggleDateTimeEdit}
                        className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span>{formatDate(event.date)} • {event.time}</span>
                    {editDateSuccess && (
                      <span className="text-green-600 dark:text-green-400 text-xs mt-1">{editDateSuccess}</span>
                    )}
                  </div>
                )}
              </div>
              {!isEditingDateTime && (
                <button 
                  onClick={toggleDateTimeEdit}
                  className="text-primary hover:text-indigo-700 text-sm"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="flex flex-col">
              <span>{event.location}</span>
              <button 
                onClick={() => {
                  const url = event.locationDetails?.latitude && event.locationDetails?.longitude
                    ? `https://www.google.com/maps/dir/?api=1&destination=${event.locationDetails.latitude},${event.locationDetails.longitude}`
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
                  window.open(url, '_blank');
                }}
                className="text-xs text-primary hover:text-indigo-700 mt-1"
              >
                View on Google Maps
              </button>
            </div>
          </div>
          
          {/* Map Display */}
          {event.location && (
            <div className="mt-4 mb-6">
              <MapDisplay 
                address={event.location}
                latitude={event.locationDetails?.latitude}
                longitude={event.locationDetails?.longitude}
                title={event.title}
                height="200px"
                className="rounded-xl overflow-hidden shadow-md"
              />
            </div>
          )}
          
          <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Organized by {event.organizer.name}</span>
          </div>
          
          {event.description && (
            <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
              <p className="text-gray-800 dark:text-gray-200">{event.description}</p>
            </div>
          )}
          
          {/* Shareable link */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-0">Shareable link:</span>
              <div className="flex-grow relative">
                <input
                  type="text"
                  readOnly
                  value={event.shareableLink || window.location.href}
                  className="w-full p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm border border-gray-200 dark:border-gray-700"
                />
                <button
                  onClick={handleCopyLink}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary hover:text-indigo-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
              </div>
              {copySuccess && (
                <span className="text-green-600 dark:text-green-400 text-sm mt-1 sm:mt-0">{copySuccess}</span>
              )}
            </div>
          </div>
        </div>
        
        {/* RSVP Status - Modified for direct RSVP toggling */}
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">RSVPs</h3>
            <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium">Average Rating: {averageRating}</span>
              <span className="text-xs ml-1">({ratings.length} ratings)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {event.rsvps.map((rsvp: RSVP) => {
              const user = defaultUsers.find(u => u.id === rsvp.userId);
              let statusColor = 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
              let statusLabel = 'Undecided';
              
              if (rsvp.status === 'attending') {
                statusColor = 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400';
                statusLabel = 'Going';
              } else if (rsvp.status === 'not-attending') {
                statusColor = 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400';
                statusLabel = 'Not Going';
              }
              
              return (
                <div 
                  key={rsvp.userId}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex flex-col hover:shadow-md transition duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-8 h-8 rounded-full mr-2" 
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/20 dark:bg-primary/40 text-primary flex items-center justify-center mr-2">
                          {user?.name.charAt(0) || '?'}
                        </div>
                      )}
                      <span className="font-medium">{user?.name || rsvp.name}</span>
                    </div>
                    <button 
                      onClick={() => handleRsvpToggle(rsvp.userId, rsvp.status)}
                      className={`text-xs px-2 py-1 rounded-full ${statusColor} transition-colors duration-200 hover:opacity-80`}
                    >
                      {statusLabel}
                    </button>
                  </div>
                  
                  {/* Rating Section */}
                  <div className="mt-2 border-t border-gray-100 dark:border-gray-700 pt-2">
                    {editingRating === rsvp.userId ? (
                      <div className="flex flex-col">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Rate venue (0-10):</div>
                        <div className="flex items-center">
                          <input
                            type="range"
                            min="0"
                            max="10"
                            value={rsvp.rating || 0}
                            onChange={(e) => handleUpdateRating(rsvp.userId, parseInt(e.target.value))}
                            className="flex-grow mr-2"
                          />
                          <span className="text-sm font-semibold text-yellow-500">{rsvp.rating || 0}</span>
                        </div>
                        <div className="flex justify-end mt-1">
                          <button
                            onClick={() => setEditingRating(null)}
                            className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm">
                            {rsvp.rating !== null && rsvp.rating !== undefined ? `${rsvp.rating}/10` : 'Not rated'}
                          </span>
                        </div>
                        <button
                          onClick={() => setEditingRating(rsvp.userId)}
                          className="text-xs text-primary hover:text-indigo-700"
                        >
                          {rsvp.rating !== null && rsvp.rating !== undefined ? 'Change' : 'Rate'}
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Comment Section */}
                  {editingComment === rsvp.userId ? (
                    <div className="mt-2 border-t border-gray-100 dark:border-gray-700 pt-2">
                      <textarea
                        value={rsvpComments[rsvp.userId] || rsvp.comment || ''}
                        onChange={(e) => setRsvpComments({...rsvpComments, [rsvp.userId]: e.target.value})}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm"
                        placeholder="Add a comment..."
                        rows={2}
                      />
                      <div className="flex justify-end mt-1 space-x-2">
                        <button 
                          onClick={() => setEditingComment(null)}
                          className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleUpdateComment(rsvp.userId)}
                          className="text-xs text-primary hover:text-indigo-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    rsvp.comment ? (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic flex justify-between items-start border-t border-gray-100 dark:border-gray-700 pt-2">
                        <p>"{rsvp.comment}"</p>
                        <button
                          onClick={() => {
                            setRsvpComments({...rsvpComments, [rsvp.userId]: rsvp.comment || ''});
                            setEditingComment(rsvp.userId);
                          }}
                          className="text-xs text-primary hover:text-indigo-700 ml-2"
                        >
                          Edit
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setRsvpComments({...rsvpComments, [rsvp.userId]: ''});
                          setEditingComment(rsvp.userId);
                        }}
                        className="mt-2 text-xs text-primary hover:text-indigo-700 text-left border-t border-gray-100 dark:border-gray-700 pt-2"
                      >
                        + Add comment
                      </button>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Event Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleArchiveToggle}
            className={`flex-1 py-3 font-semibold rounded-xl transition ${
              event.isArchived
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
            }`}
          >
            {event.isArchived ? 'Unarchive Event' : 'Archive Event'}
          </button>
          
          <button
            onClick={handleDeleteEvent}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition"
          >
            Delete Event
          </button>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default EventDetailsPage; 