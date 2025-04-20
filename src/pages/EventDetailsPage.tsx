import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { fetchEvents, updateRSVP, archiveEvent, unarchiveEvent, deleteEvent, defaultUsers, RSVP, Event } from '../features/events/eventsSlice';
import { format } from 'date-fns';
import BottomNavigation from '../components/BottomNavigation';
import ImageWithFallback from '../components/ImageWithFallback';

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { events, status } = useAppSelector((state: any) => state.events);
  const event = events.find((e: Event) => e.id === id);
  
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [rsvpComments, setRsvpComments] = useState<Record<string, string>>({});
  const [editingComment, setEditingComment] = useState<string | null>(null);
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEvents());
    }
  }, [status, dispatch]);
  
  // Helper function to format date
  const formatDate = (date: string) => {
    return format(new Date(date), 'EEEE, MMMM d, yyyy');
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
    
    const userName = defaultUsers.find(u => u.id === userId)?.name || 'Guest';
    const rsvp = event.rsvps.find((r: RSVP) => r.userId === userId);
    
    // Toggle between attending and not-attending
    let newStatus: 'attending' | 'not-attending' | 'undecided' = 'attending';
    if (currentStatus === 'attending') {
      newStatus = 'not-attending';
    } else if (currentStatus === 'not-attending') {
      newStatus = 'attending';
    } else {
      newStatus = 'attending';
    }
    
    // Get existing comment if there is one
    const comment = rsvp?.comment || '';
    
    dispatch(updateRSVP({
      eventId: event.id,
      rsvp: {
        userId: userId,
        name: userName,
        status: newStatus,
        comment: comment
      }
    }));
  };
  
  // Handle comment update
  const handleUpdateComment = (userId: string) => {
    if (!event) return;
    
    const rsvp = event.rsvps.find((r: RSVP) => r.userId === userId);
    if (!rsvp) return;
    
    const userName = defaultUsers.find(u => u.id === userId)?.name || 'Guest';
    const comment = rsvpComments[userId] || '';
    
    dispatch(updateRSVP({
      eventId: event.id,
      rsvp: {
        userId: userId,
        name: userName,
        status: rsvp.status,
        comment: comment
      }
    }));
    
    setEditingComment(null);
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
          
          <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(event.date)} • {event.time}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>
          
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
          <h3 className="text-lg font-semibold mb-4">RSVPs</h3>
          
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
                  
                  {editingComment === rsvp.userId ? (
                    <div className="mt-2">
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
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic flex justify-between items-start">
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
                        className="mt-2 text-xs text-primary hover:text-indigo-700 text-left"
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
            onClick={() => {
              try {
                navigate(`/edit-event/${event.id}`);
              } catch (error) {
                console.error("Navigation error:", error);
              }
            }}
            className="flex-1 py-3 bg-primary hover:bg-indigo-600 text-white font-semibold rounded-xl transition"
          >
            Edit Event
          </button>
          
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