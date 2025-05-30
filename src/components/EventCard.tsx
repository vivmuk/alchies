import React from 'react';
import { format, parseISO, isBefore, isAfter, isSameDay } from 'date-fns';
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
  
  // Calculate average rating
  const ratings = rsvps.filter(rsvp => rsvp.rating !== null && rsvp.rating !== undefined).map(rsvp => rsvp.rating as number);
  const averageRating = ratings.length > 0 
    ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1) 
    : null;
  
  // Format date - fixed to handle timezone issues
  const eventDate = parseISO(date);
  const formattedDate = format(eventDate, 'EEE, MMM d, yyyy');
  
  const today = new Date();
  
  // Enhanced event status logic
  const isToday = isSameDay(eventDate, today);
  const isPast = isBefore(eventDate, today) && !isToday;
  const isFuture = isAfter(eventDate, today);
  
  // For "in progress" status - check if event is today and current time is between start and end
  const eventStartTime = time.split('-')[0]?.trim();
  const [startHour, startMinute] = eventStartTime ? eventStartTime.split(':').map(t => parseInt(t, 10)) : [0, 0];
  
  const eventStart = new Date(today);
  eventStart.setHours(startHour || 0, startMinute || 0, 0);
  
  // Assume events last 2 hours by default if no end time provided
  let eventEnd;
  if (time.includes('-')) {
    const eventEndTime = time.split('-')[1]?.trim();
    const [endHour, endMinute] = eventEndTime ? eventEndTime.split(':').map(t => parseInt(t, 10)) : [startHour + 2, startMinute];
    eventEnd = new Date(today);
    eventEnd.setHours(endHour, endMinute, 0);
  } else {
    eventEnd = new Date(eventStart);
    eventEnd.setHours(eventStart.getHours() + 2);
  }
  
  const isInProgress = isToday && today >= eventStart && today <= eventEnd;
  const isUpcoming = isFuture && today.getTime() - eventDate.getTime() < 3 * 24 * 60 * 60 * 1000;
  
  // Get status color for card border
  const getStatusColor = () => {
    if (status === 'cancelled') return 'border-red-400 dark:border-red-600';
    if (isInProgress) return 'border-green-400 dark:border-green-600';
    if (isToday) return 'border-yellow-400 dark:border-yellow-600';
    if (isUpcoming) return 'border-blue-400 dark:border-blue-600';
    if (isPast) return 'border-gray-300 dark:border-gray-700';
    return 'border-gray-100 dark:border-gray-800';
  };
  
  return (
    <div
      className={`bg-white dark:bg-dark-card rounded-xl shadow-md hover:shadow-lg overflow-hidden cursor-pointer border-2 ${getStatusColor()} transition-all duration-300 ease-in-out`}
      onClick={onClick}
    >
      {/* Status Indicator Bar at the top */}
      <div className={`h-1 w-full ${
        status === 'cancelled' ? 'bg-red-500' :
        isInProgress ? 'bg-green-500' :
        isToday ? 'bg-yellow-500' :
        isUpcoming ? 'bg-blue-500' :
        isPast ? 'bg-gray-400' : 'bg-gray-200'
      }`}></div>
      
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
                {isInProgress && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs font-medium animate-pulse">In Progress</span>
                )}
                {isToday && !isInProgress && (
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full text-xs font-medium">Today</span>
                )}
                {isUpcoming && !isToday && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-xs font-medium">Upcoming</span>
                )}
                {isPast && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400 rounded-full text-xs font-medium">Completed</span>
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
            
            {averageRating !== null && (
              <div className="flex items-center text-yellow-500 dark:text-yellow-400 ml-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{averageRating}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({ratings.length})</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard; 