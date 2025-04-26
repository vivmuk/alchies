import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import updateEvent from './updateEvent';

// Types
export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface RSVP {
  userId: string;
  name: string;
  status: 'attending' | 'not-attending' | 'undecided';
  comment?: string;
  rating?: number | null;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl?: string;
  organizer: User;
  rsvps: RSVP[];
  status?: 'active' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  shareableLink?: string;
}

// Default users list
export const defaultUsers: User[] = [
  { id: '1', name: 'Aubrey' },
  { id: '2', name: 'Tze' },
  { id: '3', name: 'Tram' },
  { id: '4', name: 'Jojo', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', name: 'Cameron', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '6', name: 'Cindy' },
  { id: '7', name: 'Stevie' },
  { id: '8', name: 'Caden', avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: '9', name: 'Cara', avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: '10', name: 'Patti' },
  { id: '11', name: 'James' },
  { id: '12', name: 'Moe' },
  { id: '13', name: 'Vanessa' },
  { id: '14', name: 'Vivek' }
];

// Helper function to create default RSVPs with undecided status
export const createDefaultRsvps = (): RSVP[] => {
  return defaultUsers.map(user => ({
    userId: user.id,
    name: user.name,
    status: 'undecided',
    rating: null
  }));
};

interface EventsState {
  events: Event[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  status: 'idle',
  error: null
};

// Async thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async () => {
    try {
      return await api.events.getAll();
    } catch (error) {
      console.error('Failed to fetch events:', error);
      throw error;
    }
  }
);

export const addEvent = createAsyncThunk(
  'events/addEvent',
  async (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'>) => {
    try {
      // Add default RSVPs if not provided
      if (!event.rsvps || event.rsvps.length === 0) {
        event.rsvps = createDefaultRsvps();
      }
      
      // Generate shareable link
      event.shareableLink = `${window.location.origin}/event/${Date.now()}`;
      
      return await api.events.create(event);
    } catch (error) {
      console.error('Failed to add event:', error);
      throw error;
    }
  }
);

export const updateRSVP = createAsyncThunk(
  'events/updateRSVP',
  async ({ eventId, rsvp }: { eventId: string, rsvp: RSVP }) => {
    try {
      const event = await api.events.getById(eventId);
      
      // Update the RSVP list
      const existingRSVPIndex = event.rsvps.findIndex(r => r.userId === rsvp.userId);
      
      if (existingRSVPIndex >= 0) {
        event.rsvps[existingRSVPIndex] = rsvp;
      } else {
        event.rsvps.push(rsvp);
      }
      
      // Update the event on the server
      await api.events.update(eventId, { rsvps: event.rsvps });
      
      return { eventId, rsvp };
    } catch (error) {
      console.error('Failed to update RSVP:', error);
      throw error;
    }
  }
);

export const uploadEventImage = createAsyncThunk(
  'events/uploadEventImage',
  async ({ eventId, file }: { eventId: string, file: File }) => {
    try {
      // Upload the image
      const imageUrl = await api.upload.uploadImage(file);
      
      // Update the event with the new image URL
      await api.events.update(eventId, { imageUrl });
      
      return { eventId, imageUrl };
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error;
    }
  }
);

// New action to delete an event (permanent delete)
export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id: string) => {
    try {
      await api.events.delete(id);
      return id;
    } catch (error) {
      console.error('Failed to delete event:', error);
      throw error;
    }
  }
);

// Add back the updateRating export
export const updateRating = createAsyncThunk(
  'events/updateRating',
  async ({ eventId, userId, rating }: { eventId: string, userId: string, rating: number | null }) => {
    try {
      const event = await api.events.getById(eventId);
      
      // Find the RSVP
      const existingRSVPIndex = event.rsvps.findIndex(r => r.userId === userId);
      
      if (existingRSVPIndex >= 0) {
        // Update the rating
        event.rsvps[existingRSVPIndex].rating = rating;
        
        // Update the event on the server
        await api.events.update(eventId, { rsvps: event.rsvps });
        
        return { 
          eventId, 
          userId, 
          rating 
        };
      } else {
        throw new Error('RSVP not found');
      }
    } catch (error) {
      console.error('Failed to update rating:', error);
      throw error;
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    archiveEvent(state, action: PayloadAction<string>) {
      const event = state.events.find(event => event.id === action.payload);
      if (event) {
        event.isArchived = true;
        event.updatedAt = new Date().toISOString();
        
        // Call the API to update the event
        api.events.update(action.payload, { isArchived: true })
          .catch(error => console.error('Failed to archive event:', error));
      }
    },
    unarchiveEvent(state, action: PayloadAction<string>) {
      const event = state.events.find(event => event.id === action.payload);
      if (event) {
        event.isArchived = false;
        event.updatedAt = new Date().toISOString();
        
        // Call the API to update the event
        api.events.update(action.payload, { isArchived: false })
          .catch(error => console.error('Failed to unarchive event:', error));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch events';
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(updateRSVP.fulfilled, (state, action) => {
        const { eventId, rsvp } = action.payload;
        const event = state.events.find(event => event.id === eventId);
        
        if (event) {
          const existingRSVPIndex = event.rsvps.findIndex(r => r.userId === rsvp.userId);
          
          if (existingRSVPIndex >= 0) {
            event.rsvps[existingRSVPIndex] = rsvp;
          } else {
            event.rsvps.push(rsvp);
          }
          
          event.updatedAt = new Date().toISOString();
        }
      })
      .addCase(updateRating.fulfilled, (state, action) => {
        const { eventId, userId, rating } = action.payload;
        const event = state.events.find(event => event.id === eventId);
        
        if (event) {
          const rsvp = event.rsvps.find(r => r.userId === userId);
          if (rsvp) {
            rsvp.rating = rating;
            event.updatedAt = new Date().toISOString();
          }
        }
      })
      .addCase(updateEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.status = 'idle';
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update event';
      })
      .addCase(deleteEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.status = 'idle';
        state.events = state.events.filter(event => event.id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete event';
      })
      .addCase(uploadEventImage.fulfilled, (state, action) => {
        const { eventId, imageUrl } = action.payload;
        const event = state.events.find(event => event.id === eventId);
        
        if (event) {
          event.imageUrl = imageUrl;
          event.updatedAt = new Date().toISOString();
        }
      });
  }
});

export const { archiveEvent, unarchiveEvent } = eventsSlice.actions;

export default eventsSlice.reducer; 