import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fetchEvents, Event } from '../features/events/eventsSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import BottomNavigation from '../components/BottomNavigation';

const MemoriesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { events, status, error } = useAppSelector((state) => state.events);
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEvents());
    }
  }, [status, dispatch]);
  
  const archivedEvents = events.filter(event => event.isArchived);
  
  // Group events by month and year
  const groupedEvents = archivedEvents.reduce((acc: Record<string, Event[]>, event: Event) => {
    const date = new Date(event.date);
    const monthYear = format(date, 'MMMM yyyy');
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    
    acc[monthYear].push(event);
    return acc;
  }, {});
  
  // Sort month-year groups by date (newest first)
  const sortedMonthYears = Object.keys(groupedEvents).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  });
  
  return (
    <div className="min-h-screen bg-background dark:bg-dark-background text-gray-900 dark:text-white pb-16">
      <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-md p-4 z-10">
        <h1 className="text-2xl font-bold text-center">Memories</h1>
      </header>
      
      <main className="container mx-auto px-4 py-6">
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
        
        {status === 'succeeded' && archivedEvents.length === 0 && (
          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-2xl text-center">
            <p className="text-gray-600 dark:text-gray-300">No memories yet. Past events will appear here.</p>
          </div>
        )}
        
        {status === 'succeeded' && archivedEvents.length > 0 && (
          <div className="space-y-8">
            {sortedMonthYears.map(monthYear => (
              <div key={monthYear} className="space-y-4">
                <h2 className="text-xl font-semibold sticky top-16 bg-background dark:bg-dark-background py-2 z-10">
                  {monthYear}
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {groupedEvents[monthYear].map((event: Event) => (
                    <div
                      key={event.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
                      onClick={() => navigate(`/event/${event.id}`)}
                    >
                      {event.imageUrl && (
                        <div className="w-full h-40 overflow-hidden">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                        
                        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{format(new Date(event.date), 'EEEE, MMMM d')}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default MemoriesPage; 