import { Event } from '../features/events/eventsSlice';

// Declare module for any missing types
declare module '../features/events/eventsSlice' {
  // Make sure updateEvent is exposed
  export const updateEvent: any;
  
  // Define the state structure
  export interface EventsState {
    events: Event[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }
} 