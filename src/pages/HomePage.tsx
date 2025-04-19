import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents } from '../features/events/eventsSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import BottomNavigation from '../components/BottomNavigation';
import EventCard from '../components/EventCard';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { events, status, error } = useAppSelector((state) => state.events);
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEvents());
    }
  }, [status, dispatch]);
  
  const upcomingEvents = events.filter(event => !event.isArchived);
  
  return (
    <div className="min-h-screen bg-background dark:bg-dark-background text-gray-900 dark:text-white pb-16">
      <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-md p-4 z-10">
        <h1 className="text-2xl font-bold text-center">Alchies</h1>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
        
        {status === 'loading' && (
          <div className="flex justify-center items-center h-40">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        
        {status === 'failed' && (
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded-2xl">
            <p className="text-red-700 dark:text-red-100">{error}</p>
          </div>
        )}
        
        {status === 'succeeded' && upcomingEvents.length === 0 && (
          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-2xl text-center">
            <p className="text-gray-600 dark:text-gray-300">No upcoming events. Create one!</p>
            <button 
              onClick={() => navigate('/create')}
              className="mt-4 bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-2xl transition"
            >
              Create Event
            </button>
          </div>
        )}
        
        <div className="grid gap-4">
          {upcomingEvents.map(event => (
            <EventCard 
              key={event.id}
              event={event}
              onClick={() => navigate(`/event/${event.id}`)}
            />
          ))}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default HomePage; 