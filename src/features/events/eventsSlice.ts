import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface RSVP {
  userId: string;
  status: 'attending' | 'not-attending';
  comment?: string;
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
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

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

// Sample data for development
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Beach BBQ',
    date: '2023-06-15',
    time: '15:00',
    location: 'Sunny Beach',
    description: 'Let\'s have a BBQ at the beach! Bring your own drinks.',
    imageUrl: 'https://images.unsplash.com/photo-1523837157348-ffbdaccfc7de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    organizer: {
      id: '1',
      name: 'Alex',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    rsvps: [
      { userId: '1', status: 'attending' },
      { userId: '2', status: 'attending', comment: 'I\'ll bring some snacks!' },
      { userId: '3', status: 'not-attending', comment: 'Sorry, I can\'t make it this time.' }
    ],
    createdAt: '2023-05-01T12:00:00Z',
    updatedAt: '2023-05-01T12:00:00Z',
    isArchived: false
  },
  {
    id: '2',
    title: 'Movie Night',
    date: '2023-06-20',
    time: '19:00',
    location: 'Jamie\'s Place',
    description: 'We\'ll be watching the new Marvel movie. Popcorn provided!',
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    organizer: {
      id: '2',
      name: 'Jamie',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    rsvps: [
      { userId: '1', status: 'attending' },
      { userId: '2', status: 'attending' },
      { userId: '4', status: 'attending', comment: 'Looking forward to it!' }
    ],
    createdAt: '2023-05-10T14:30:00Z',
    updatedAt: '2023-05-10T14:30:00Z',
    isArchived: false
  },
  {
    id: '3',
    title: 'Game Night',
    date: '2023-05-05',
    time: '20:00',
    location: 'Taylor\'s House',
    description: 'Board games and snacks!',
    imageUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    organizer: {
      id: '3',
      name: 'Taylor',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    rsvps: [
      { userId: '1', status: 'attending' },
      { userId: '3', status: 'attending' },
      { userId: '4', status: 'not-attending' }
    ],
    createdAt: '2023-04-20T10:15:00Z',
    updatedAt: '2023-04-20T10:15:00Z',
    isArchived: true
  }
];

// Mock API calls
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async () => {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return sampleEvents;
  }
);

export const addEvent = createAsyncThunk(
  'events/addEvent',
  async (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'>) => {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false
    };
    
    return newEvent;
  }
);

export const updateRSVP = createAsyncThunk(
  'events/updateRSVP',
  async ({ eventId, rsvp }: { eventId: string, rsvp: RSVP }) => {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return { eventId, rsvp };
  }
);

export const generateEventImage = createAsyncThunk(
  'events/generateEventImage',
  async ({ eventId, prompt }: { eventId: string, prompt: string }) => {
    // In a real app, this would be an API call to an AI image generation service
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    
    // For this demo, we'll just return a random image from Unsplash
    const images = [
      'https://source.unsplash.com/random/800x600/?party',
      'https://source.unsplash.com/random/800x600/?beach',
      'https://source.unsplash.com/random/800x600/?dinner',
      'https://source.unsplash.com/random/800x600/?game',
      'https://source.unsplash.com/random/800x600/?concert'
    ];
    
    const imageUrl = images[Math.floor(Math.random() * images.length)];
    return { eventId, imageUrl };
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
      .addCase(generateEventImage.fulfilled, (state, action) => {
        const { eventId, imageUrl } = action.payload;
        const event = state.events.find(event => event.id === eventId);
        
        if (event) {
          event.imageUrl = imageUrl;
          event.updatedAt = new Date().toISOString();
        }
      });
  }
});

export const { archiveEvent } = eventsSlice.actions;

export default eventsSlice.reducer; 