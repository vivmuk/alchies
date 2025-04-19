import axios from 'axios';
import { Event } from '../features/events/eventsSlice';

// Base URL for API calls - works both locally and when deployed
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8888/.netlify/functions'
  : '/.netlify/functions';

// Create axios instance with base config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API endpoints for events
export const eventsApi = {
  // Get all events
  getAll: async (): Promise<Event[]> => {
    const response = await api.get('/events');
    return response.data;
  },
  
  // Get a single event by ID
  getById: async (id: string): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  
  // Create a new event
  create: async (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'>): Promise<Event> => {
    const response = await api.post('/events', event);
    return response.data;
  },
  
  // Update an event
  update: async (id: string, event: Partial<Event>): Promise<Event> => {
    const response = await api.put(`/events/${id}`, event);
    return response.data;
  },
  
  // Archive (soft delete) an event
  archive: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
  
  // Permanently delete an event
  delete: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}?permanent=true`);
  }
};

// API endpoints for image uploads
export const uploadApi = {
  // Upload an image and get the URL
  uploadImage: async (file: File): Promise<string> => {
    // Convert file to base64
    const base64 = await fileToBase64(file);
    
    // Send to upload function
    const response = await api.post('/upload', { image: base64 });
    
    // Return the URL
    return response.data.url;
  }
};

// Helper function to convert a file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export default {
  events: eventsApi,
  upload: uploadApi
}; 