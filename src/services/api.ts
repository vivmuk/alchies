import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Event } from '../features/events/eventsSlice';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

// Collection references
const eventsCollection = collection(db, 'events');

// API service for events
const api = {
  events: {
    // Get all events
    getAll: async (): Promise<Event[]> => {
      try {
        // Query events collection, ordered by date
        const eventsQuery = query(eventsCollection, orderBy('date', 'asc'));
        const querySnapshot = await getDocs(eventsQuery);
        
        // Convert the query snapshot to an array of events
        const events = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Event[];
        
        return events;
      } catch (error) {
        console.error('Error fetching events:', error);
        return [];
      }
    },
    
    // Get event by ID
    getById: async (id: string): Promise<Event> => {
      try {
        const eventDoc = await getDoc(doc(db, 'events', id));
        
        if (!eventDoc.exists()) {
          throw new Error('Event not found');
        }
        
        return { id: eventDoc.id, ...eventDoc.data() } as Event;
      } catch (error) {
        console.error(`Error fetching event ${id}:`, error);
        throw error;
      }
    },
    
    // Create a new event
    create: async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'>): Promise<Event> => {
      try {
        const timestamp = new Date().toISOString();
        
        const newEvent = {
          ...eventData,
          createdAt: timestamp,
          updatedAt: timestamp,
          isArchived: false
        };
        
        console.log('Creating new event with data:', newEvent);
        
        // Add the document to Firestore
        const docRef = await addDoc(eventsCollection, newEvent);
        
        console.log('Event created successfully with ID:', docRef.id);
        
        // Return the event with the generated ID
        return {
          id: docRef.id,
          ...newEvent
        } as Event;
      } catch (error) {
        console.error('Error creating event:', error);
        // Log additional debug info
        if (error instanceof Error) {
          console.error('Error details:', error.message);
          console.error('Error stack:', error.stack);
        }
        throw error;
      }
    },
    
    // Update an event
    update: async (id: string, updates: Partial<Event>): Promise<Event> => {
      try {
        const eventRef = doc(db, 'events', id);
        const eventSnapshot = await getDoc(eventRef);
        
        if (!eventSnapshot.exists()) {
          throw new Error('Event not found');
        }
        
        // Get the current event data
        const currentEvent = { 
          id: eventSnapshot.id, 
          ...eventSnapshot.data() 
        } as Event;
        
        // Create the updated event
        const updatedEvent = {
          ...currentEvent,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        // Remove the id field before updating (Firestore doesn't need it in the document data)
        const { id: _, ...updateData } = updatedEvent;
        
        // Update the document in Firestore
        await updateDoc(eventRef, updateData);
        
        return updatedEvent;
      } catch (error) {
        console.error(`Error updating event ${id}:`, error);
        throw error;
      }
    },
    
    // Delete an event
    delete: async (id: string): Promise<void> => {
      try {
        await deleteDoc(doc(db, 'events', id));
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