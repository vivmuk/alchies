// Netlify serverless function for handling events
const { v4: uuidv4 } = require('uuid');

// Default users for the app
const defaultUsers = [
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
  { id: '13', name: 'Venessa' },
  { id: '14', name: 'Vivek' }
];

// Create default RSVPs with 'undecided' status
const createDefaultRsvps = () => {
  return defaultUsers.map(user => ({
    userId: user.id,
    name: user.name,
    status: 'undecided'
  }));
};

// In a production app, this would use a database
// For this demo, we'll use in-memory storage
// In a real app, you would use Fauna DB, MongoDB, or another database
let events = [
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
    rsvps: createDefaultRsvps(),
    status: 'active',
    shareableLink: 'https://alchies.netlify.app/event/1',
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
    rsvps: createDefaultRsvps(),
    shareableLink: 'https://alchies.netlify.app/event/2',
    createdAt: '2023-05-10T14:30:00Z',
    updatedAt: '2023-05-10T14:30:00Z',
    isArchived: false
  }
];

exports.handler = async (event, context) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS enabled' })
    };
  }

  try {
    // Get user identity from Netlify context
    const user = context.clientContext?.user;
    
    // GET - Fetch all events or a specific event
    if (event.httpMethod === 'GET') {
      const path = event.path.split('/');
      const eventId = path[path.length - 1] !== 'events' ? path[path.length - 1] : null;
      
      if (eventId) {
        const foundEvent = events.find(e => e.id === eventId);
        if (!foundEvent) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ message: 'Event not found' })
          };
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(foundEvent)
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(events)
      };
    }
    
    // POST - Create a new event
    if (event.httpMethod === 'POST') {
      // For a real app, you'd want to validate the user is authenticated
      // if (!user) {
      //   return {
      //     statusCode: 401,
      //     headers,
      //     body: JSON.stringify({ message: 'Unauthorized' })
      //   };
      // }
      
      const eventData = JSON.parse(event.body);
      
      // Ensure we have default RSVPs if none provided
      if (!eventData.rsvps || eventData.rsvps.length === 0) {
        eventData.rsvps = createDefaultRsvps();
      }
      
      // Generate a shareable link if not provided
      if (!eventData.shareableLink) {
        const uniqueId = uuidv4();
        eventData.shareableLink = `${process.env.URL || 'https://alchies.netlify.app'}/event/${uniqueId}`;
      }
      
      const newEvent = {
        ...eventData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isArchived: false
      };
      
      events.push(newEvent);
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newEvent)
      };
    }
    
    // PUT - Update an event
    if (event.httpMethod === 'PUT') {
      const path = event.path.split('/');
      const eventId = path[path.length - 1];
      const eventData = JSON.parse(event.body);
      
      const eventIndex = events.findIndex(e => e.id === eventId);
      if (eventIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Event not found' })
        };
      }
      
      // Update the event
      events[eventIndex] = {
        ...events[eventIndex],
        ...eventData,
        updatedAt: new Date().toISOString()
      };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(events[eventIndex])
      };
    }
    
    // DELETE - Archive or permanently delete an event
    if (event.httpMethod === 'DELETE') {
      const path = event.path.split('/');
      const eventId = path[path.length - 1];
      
      // Check if this is a permanent delete or soft delete (archive)
      const queryParams = new URLSearchParams(event.queryStringParameters || {});
      const isPermanentDelete = queryParams.get('permanent') === 'true';
      
      const eventIndex = events.findIndex(e => e.id === eventId);
      if (eventIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Event not found' })
        };
      }
      
      if (isPermanentDelete) {
        // Permanent delete - remove from array
        events = events.filter(e => e.id !== eventId);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Event permanently deleted' })
        };
      } else {
        // Soft delete - just archive
        events[eventIndex].isArchived = true;
        events[eventIndex].updatedAt = new Date().toISOString();
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Event archived successfully' })
        };
      }
    }
    
    // If we get here, the HTTP method is not supported
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error', error: error.toString() })
    };
  }
}; 