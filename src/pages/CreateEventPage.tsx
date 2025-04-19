import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEvent, generateEventImage, Event, User } from '../features/events/eventsSlice';
import { useAppDispatch } from '../app/hooks';
import BottomNavigation from '../components/BottomNavigation';

// Mock current user for demo
const currentUser: User = {
  id: '1',
  name: 'Alex',
  avatar: 'https://i.pravatar.cc/150?img=1'
};

const CreateEventPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  
  // AI image generation state
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  
  // Form validation
  const isFormValid = title && date && time && location;
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    const newEvent: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'> = {
      title,
      date,
      time,
      location,
      description,
      imageUrl: generatedImageUrl || undefined,
      organizer: currentUser,
      rsvps: [{ userId: currentUser.id, status: 'attending' }]
    };
    
    const resultAction = await dispatch(addEvent(newEvent));
    
    if (addEvent.fulfilled.match(resultAction)) {
      navigate('/');
    }
  };
  
  // Handle image generation
  const handleGenerateImage = async () => {
    if (!title) {
      alert('Please enter an event title first');
      return;
    }
    
    setIsGeneratingImage(true);
    
    try {
      // In a real app, we'd use the event ID after creation
      // For demo, we'll use a temporary ID
      const tempEventId = 'temp-' + Date.now();
      const prompt = `${title}${location ? ' at ' + location : ''}`;
      
      const resultAction = await dispatch(generateEventImage({ 
        eventId: tempEventId, 
        prompt 
      }));
      
      if (generateEventImage.fulfilled.match(resultAction)) {
        setGeneratedImageUrl(resultAction.payload.imageUrl);
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background dark:bg-dark-background text-gray-900 dark:text-white pb-16">
      <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-md p-4 z-10 flex items-center">
        <button
          onClick={() => navigate('/')}
          className="mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">Create Event</h1>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit}>
          {/* Image Preview */}
          {generatedImageUrl && (
            <div className="mb-6">
              <div className="relative w-full h-40 overflow-hidden rounded-2xl">
                <img
                  src={generatedImageUrl}
                  alt="Event"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          
          {/* Event Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Event Title*
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Beach BBQ, Game Night, etc."
              required
            />
          </div>
          
          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1">
                Date*
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium mb-1">
                Time*
              </label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>
          
          {/* Location */}
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location*
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Address or place name"
              required
            />
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="What's the plan? Add any details your friends should know..."
              rows={4}
            />
          </div>
          
          {/* Generate Image Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={isGeneratingImage || !title}
              className="w-full py-3 bg-accent hover:bg-purple-600 text-white font-semibold rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingImage ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Image...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Generate Theme Image
                </>
              )}
            </button>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full py-3 bg-primary hover:bg-blue-600 text-white font-semibold rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Event
          </button>
        </form>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default CreateEventPage; 