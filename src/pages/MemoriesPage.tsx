import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fetchEvents, unarchiveEvent, deleteEvent, Event } from '../features/events/eventsSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { RootState } from '../app/store';
import BottomNavigation from '../components/BottomNavigation';

const MemoriesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { events, status, error } = useAppSelector((state: RootState) => state.events);
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEvents());
    }
  }, [status, dispatch]);
  
  const archivedEvents = events.filter((event: Event) => event.isArchived);
  
  // Group events by month and year (for future functionality)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const groupedEvents: Record<string, Event[]> = archivedEvents.reduce((acc: Record<string, Event[]>, event: Event) => {
    const date = new Date(event.date);
    const monthYear = format(date, 'MMMM yyyy');
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    
    acc[monthYear].push(event);
    return acc;
  }, {} as Record<string, Event[]>);
  
  // Handle unarchive event
  const handleUnarchive = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(unarchiveEvent(eventId));
  };
  
  // Handle delete event
  const handleDelete = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to permanently delete this event? This action cannot be undone.')) {
      dispatch(deleteEvent(eventId));
    }
  };
  
  return (
    <div className="min-h-screen bg-background dark:bg-dark-background text-gray-900 dark:text-white pb-16">
      <header className="sticky top-0 bg-white dark:bg-dark-card shadow-md p-4 z-10 flex items-center border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => navigate('/')}
          className="mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">Memories</h1>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {status === 'loading' && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {status === 'failed' && (
          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-xl border border-red-200 dark:border-red-800">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}
        
        {status === 'succeeded' && archivedEvents.length === 0 && (
          <div className="bg-white dark:bg-dark-card p-8 rounded-xl text-center border border-gray-200 dark:border-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 mb-4">No memories yet. Archive events to see them here.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-indigo-600 text-white font-semibold py-2 px-6 rounded-xl transition"
            >
              Back to Events
            </button>
          </div>
        )}
        
        <div className="grid gap-4">
          {archivedEvents.map((event: Event) => (
            <div 
              key={event.id}
              className="bg-white dark:bg-dark-card rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer"
              onClick={() => navigate(`/event/${event.id}`)}
            >
              <div className="flex flex-col sm:flex-row">
                {event.imageUrl ? (
                  <div className="w-full sm:w-1/3 h-40 sm:h-auto overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-full sm:w-1/3 h-40 sm:h-auto overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary/30 dark:text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                    </div>
                    
                    <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">{format(new Date(event.date), 'EEE, MMM d, yyyy')} • {event.time}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <button
                      onClick={(e) => handleUnarchive(event.id, e)}
                      className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 dark:hover:bg-primary/30 transition"
                    >
                      Unarchive
                    </button>
                    
                    <button
                      onClick={(e) => handleDelete(event.id, e)}
                      className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/30 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default MemoriesPage; 