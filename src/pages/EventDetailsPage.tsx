import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { RSVP, updateRSVP, archiveEvent } from '../features/events/eventsSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import BottomNavigation from '../components/BottomNavigation';

// Mock current user for demo
const currentUser = {
  id: '1',
  name: 'Alex',
  avatar: 'https://i.pravatar.cc/150?img=1'
};

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const event = useAppSelector((state) => 
    state.events.events.find(event => event.id === id)
  );
  
  const [comment, setComment] = useState('');
  
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-dark-background">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Event not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-2xl transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
  
  const { title, date, time, location, description, imageUrl, organizer, rsvps, isArchived } = event;
  
  // Format date
  const formattedDate = format(new Date(date), 'EEEE, MMMM d, yyyy');
  
  // Get current user's RSVP status
  const userRsvp = rsvps.find(rsvp => rsvp.userId === currentUser.id);
  const rsvpStatus = userRsvp ? userRsvp.status : null;
  
  // Counts
  const attending = rsvps.filter(rsvp => rsvp.status === 'attending').length;
  const notAttending = rsvps.filter(rsvp => rsvp.status === 'not-attending').length;
  
  // Handle RSVP
  const handleRSVP = (status: 'attending' | 'not-attending') => {
    const rsvp: RSVP = {
      userId: currentUser.id,
      status,
      comment: comment.trim() || undefined
    };
    
    dispatch(updateRSVP({ eventId: event.id, rsvp }));
    setComment('');
  };
  
  // Handle Archive
  const handleArchive = () => {
    dispatch(archiveEvent(event.id));
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-background dark:bg-dark-background text-gray-900 dark:text-white pb-16">
      <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-md p-4 z-10 flex items-center">
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
      
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <main className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formattedDate} • {time}</span>
        </div>
        
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{location}</span>
        </div>
        
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Organized by {organizer.name}</span>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700 dark:text-gray-300">{description}</p>
        </div>
        
        {!isArchived && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Your RSVP</h3>
            
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => handleRSVP('attending')}
                className={`flex-1 py-3 rounded-2xl flex justify-center items-center font-semibold ${
                  rsvpStatus === 'attending'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Attending
              </button>
              
              <button
                onClick={() => handleRSVP('not-attending')}
                className={`flex-1 py-3 rounded-2xl flex justify-center items-center font-semibold ${
                  rsvpStatus === 'not-attending'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Can't Attend
              </button>
            </div>
            
            <div className="mb-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment (optional)"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
              />
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Who's Coming ({attending})</h3>
          
          <div className="space-y-4">
            {rsvps
              .filter(rsvp => rsvp.status === 'attending')
              .map(rsvp => {
                const user = {
                  id: rsvp.userId,
                  name: rsvp.userId === '1' ? 'Alex' : rsvp.userId === '2' ? 'Jamie' : rsvp.userId === '3' ? 'Taylor' : 'User ' + rsvp.userId,
                  avatar: `https://i.pravatar.cc/150?img=${rsvp.userId}`
                };
                
                return (
                  <div key={rsvp.userId} className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      {rsvp.comment && (
                        <div className="text-gray-600 dark:text-gray-400 text-sm">{rsvp.comment}</div>
                      )}
                    </div>
                  </div>
                );
              })}
              
            {attending === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                No one has RSVP'd yet
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Not Attending ({notAttending})</h3>
          
          <div className="space-y-4">
            {rsvps
              .filter(rsvp => rsvp.status === 'not-attending')
              .map(rsvp => {
                const user = {
                  id: rsvp.userId,
                  name: rsvp.userId === '1' ? 'Alex' : rsvp.userId === '2' ? 'Jamie' : rsvp.userId === '3' ? 'Taylor' : 'User ' + rsvp.userId,
                  avatar: `https://i.pravatar.cc/150?img=${rsvp.userId}`
                };
                
                return (
                  <div key={rsvp.userId} className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      {rsvp.comment && (
                        <div className="text-gray-600 dark:text-gray-400 text-sm">{rsvp.comment}</div>
                      )}
                    </div>
                  </div>
                );
              })}
              
            {notAttending === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                No one has declined yet
              </div>
            )}
          </div>
        </div>
        
        {organizer.id === currentUser.id && !isArchived && (
          <div className="mt-8">
            <button
              onClick={handleArchive}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-2xl transition"
            >
              Archive Event
            </button>
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default EventDetailsPage; 