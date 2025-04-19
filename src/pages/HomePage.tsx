import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents } from '../features/events/eventsSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import BottomNavigation from '../components/BottomNavigation';
import EventCard from '../components/EventCard';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { events, status, error } = useAppSelector((state) => state.events);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  
  // Apply dark mode on component mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEvents());
    }
  }, [status, dispatch]);
  
  const upcomingEvents = events.filter(event => !event.isArchived);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  return (
    <div className="min-h-screen bg-background dark:bg-dark-background text-gray-900 dark:text-white pb-16 transition-colors duration-300">
      <header className="sticky top-0 bg-white dark:bg-dark-card shadow-md p-4 z-10 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent dark:from-primary dark:to-accent bg-clip-text text-transparent">
            Chino Alchies
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/memories')}
              className="p-2 rounded-full bg-gray-200 dark:bg-dark-surface text-gray-700 dark:text-gray-300 mr-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </button>
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-dark-surface text-gray-700 dark:text-gray-300"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Upcoming Events</h2>
          <button 
            onClick={() => navigate('/create')}
            className="bg-primary hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-xl transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Event
          </button>
        </div>
        
        {status === 'loading' && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-8 w-8 text-primary">
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        )}
        
        {status === 'failed' && (
          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-xl border border-red-200 dark:border-red-800">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}
        
        {status === 'succeeded' && upcomingEvents.length === 0 && (
          <div className="bg-gray-100 dark:bg-dark-card p-8 rounded-xl text-center border border-gray-200 dark:border-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 mb-4">No upcoming events. Create one to get started!</p>
            <button 
              onClick={() => navigate('/create')}
              className="bg-primary hover:bg-indigo-600 text-white font-semibold py-2 px-6 rounded-xl transition"
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