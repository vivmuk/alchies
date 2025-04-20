import React from 'react';
import { format, parseISO } from 'date-fns';
import { Event } from '../features/events/eventsSlice';
import ImageWithFallback from './ImageWithFallback';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const { title, date, time, location, imageUrl, rsvps, status } = event;
  
  const attending = rsvps.filter(rsvp => rsvp.status === 'attending').length;
  const notAttending = rsvps.filter(rsvp => rsvp.status === 'not-attending').length;
  const undecided = rsvps.filter(rsvp => rsvp.status === 'undecided').length;
  
  // Format date - fixed to handle timezone issues
  const eventDate = parseISO(date);
  const formattedDate = format(eventDate, 'EEE, MMM d, yyyy');
  
  // Calculate if event is today - fixed to handle timezone issues
  const today = new Date();
  const isToday = 
    eventDate.getDate() === today.getDate() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getFullYear() === today.getFullYear();
  
  // Calculate if event is within next 3 days - fixed to avoid timezone issues
  const isUpcoming = eventDate.getTime() - today.getTime() < 3 * 24 * 60 * 60 * 1000;
  
  return (
    <div
      className="bg-white dark:bg-dark-card rounded-xl shadow-md hover:shadow-lg overflow-hidden cursor-pointer border border-gray-100 dark:border-gray-800 transition-all duration-300 ease-in-out"
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row">
        {imageUrl ? (
          <div className="w-full sm:w-1/3 h-40 sm:h-auto overflow-hidden">
            <ImageWithFallback
              src={imageUrl}
              alt={title}
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
              <div className="flex space-x-1">
                {status === 'cancelled' && (
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full text-xs font-medium">Cancelled</span>
                )}
                {isToday && (
                  <span className="px-2 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-xs font-medium">Today</span>
                )}
                {!isToday && isUpcoming && (
                  <span className="px-2 py-1 bg-secondary/10 dark:bg-secondary/20 text-secondary rounded-full text-xs font-medium">Upcoming</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">{formattedDate} • {time}</span>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">{location}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 text-sm mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{attending} going</span>
            </div>
            
            <div className="flex items-center text-red-600 dark:text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{notAttending} declined</span>
            </div>
            
            {undecided > 0 && (
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{undecided} pending</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard; 