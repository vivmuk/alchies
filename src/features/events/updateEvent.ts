import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { Event } from './eventsSlice';

// Separate action to update an event
const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, updates }: { id: string, updates: Partial<Event> }) => {
    try {
      const updatedEvent = await api.events.update(id, updates);
      return updatedEvent;
    } catch (error) {
      console.error('Failed to update event:', error);
      throw error;
    }
  }
);

export default updateEvent; 