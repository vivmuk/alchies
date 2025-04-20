import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Event } from '../features/events/eventsSlice';

// Mock database for development (would be replaced with actual API calls in production)
const mockDb = {
  events: [] as Event[]
};

// Mock delay to simulate network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API service for events
const api = {
  events: {
    // Get all events
    getAll: async (): Promise<Event[]> => {
      try {
        // In a real app, this would be an API call
        // return (await axios.get(`${API_URL}/events`)).data;
        
        await delay(500); // Simulate network delay
        return mockDb.events;
      } catch (error) {
        console.error('Error fetching events:', error);
        return mockDb.events;
      }
    },
    
    // Get event by ID
    getById: async (id: string): Promise<Event> => {
      try {
        // In a real app, this would be an API call
        // return (await axios.get(`${API_URL}/events/${id}`)).data;
        
        await delay(300); // Simulate network delay
        const event = mockDb.events.find(e => e.id === id);
        if (!event) {
          throw new Error('Event not found');
        }
        return event;
      } catch (error) {
        console.error(`Error fetching event ${id}:`, error);
        throw error;
      }
    },
    
    // Create a new event
    create: async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'>): Promise<Event> => {
      try {
        // In a real app, this would be an API call
        // return (await axios.post(`${API_URL}/events`, eventData)).data;
        
        await delay(500); // Simulate network delay
        const newEvent: Event = {
          ...eventData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isArchived: false
        };
        
        mockDb.events.push(newEvent);
        return newEvent;
      } catch (error) {
        console.error('Error creating event:', error);
        throw error;
      }
    },
    
    // Update an event
    update: async (id: string, updates: Partial<Event>): Promise<Event> => {
      try {
        // In a real app, this would be an API call
        // return (await axios.patch(`${API_URL}/events/${id}`, updates)).data;
        
        await delay(300); // Simulate network delay
        const index = mockDb.events.findIndex(e => e.id === id);
        if (index === -1) {
          throw new Error('Event not found');
        }
        
        const updatedEvent = {
          ...mockDb.events[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        mockDb.events[index] = updatedEvent;
        return updatedEvent;
      } catch (error) {
        console.error(`Error updating event ${id}:`, error);
        throw error;
      }
    },
    
    // Delete an event
    delete: async (id: string): Promise<void> => {
      try {
        // In a real app, this would be an API call
        // await axios.delete(`${API_URL}/events/${id}`);
        
        await delay(300); // Simulate network delay
        const index = mockDb.events.findIndex(e => e.id === id);
        if (index === -1) {
          throw new Error('Event not found');
        }
        
        mockDb.events.splice(index, 1);
      } catch (error) {
        console.error(`Error deleting event ${id}:`, error);
        throw error;
      }
    }
  },
  
  // Upload service
  upload: {
    // Upload image to Cloudinary via Netlify function
    uploadImage: async (file: File): Promise<string> => {
      try {
        // Read file as data URL
        const reader = new FileReader();
        const fileDataPromise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        const fileData = await fileDataPromise;
        
        // Send image data to Netlify serverless function
        const response = await axios.post(
          '/.netlify/functions/upload',
          { image: fileData }
        );
        
        return response.data.url;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    }
  }
};

export default api; 