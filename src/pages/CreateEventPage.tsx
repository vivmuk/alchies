import React, { useState, FormEvent, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEvent, Event, User, defaultUsers } from '../features/events/eventsSlice';
import { useAppDispatch } from '../app/hooks';
import BottomNavigation from '../components/BottomNavigation';
import api from '../services/api';

// Default organizer for new events
const defaultOrganizer: User = defaultUsers[0];

const CreateEventPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'cancelled'>('active');
  const [organizer, setOrganizer] = useState<User>(defaultOrganizer);
  
  // Image upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form validation
  const isFormValid = title && date && time && location;
  
  // Handle image selection
  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  // Handle image removal
  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle organizer selection
  const handleOrganizerChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    const selectedUser = defaultUsers.find(user => user.id === userId) || defaultOrganizer;
    setOrganizer(selectedUser);
  };
  
  // Upload image to server
  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const imageUrl = await api.upload.uploadImage(file);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    // Process image if one was selected
    let imageUrl;
    try {
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      const newEvent: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'> = {
        title,
        date,
        time,
        location,
        description,
        imageUrl,
        organizer,
        rsvps: [], // Default RSVPs will be added by the server
        status
      };
      
      const resultAction = await dispatch(addEvent(newEvent));
      
      if (addEvent.fulfilled.match(resultAction)) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      // Handle error (show error message to user)
    }
  };
  
  return (
    <div className="min-h-screen bg-background dark:bg-dark-background text-gray-900 dark:text-white pb-16">
      <header className="sticky top-0 bg-white dark:bg-dark-card shadow-md p-4 z-10 flex items-center border-b border-gray-200 dark:border-gray-700">
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Event Image
            </label>
            <div 
              className={`relative w-full h-40 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 ${
                !imagePreview ? 'bg-gray-50 dark:bg-dark-surface/50' : ''
              }`}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </>
              ) : (
                <div 
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload an image</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>
          
          {/* Event Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Event Title*
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/40 focus:border-primary/40 outline-none"
              placeholder="Beach BBQ, Game Night, etc."
              required
            />
          </div>
          
          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm font-medium">
                Date*
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/40 focus:border-primary/40 outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="time" className="block text-sm font-medium">
                Time*
              </label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/40 focus:border-primary/40 outline-none"
                required
              />
            </div>
          </div>
          
          {/* Location */}
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium">
              Location*
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/40 focus:border-primary/40 outline-none"
              placeholder="Address or place name"
              required
            />
          </div>
          
          {/* Organizer */}
          <div className="space-y-2">
            <label htmlFor="organizer" className="block text-sm font-medium">
              Event Organizer
            </label>
            <select
              id="organizer"
              value={organizer.id}
              onChange={handleOrganizerChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/40 focus:border-primary/40 outline-none"
            >
              {defaultUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Event Status
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="status-active"
                  name="status"
                  checked={status === 'active'}
                  onChange={() => setStatus('active')}
                  className="mr-2 h-4 w-4 text-primary focus:ring-primary"
                />
                <label htmlFor="status-active" className="text-sm">Active</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="status-cancelled"
                  name="status"
                  checked={status === 'cancelled'}
                  onChange={() => setStatus('cancelled')}
                  className="mr-2 h-4 w-4 text-red-500 focus:ring-red-500"
                />
                <label htmlFor="status-cancelled" className="text-sm">Cancelled</label>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/40 focus:border-primary/40 outline-none"
              placeholder="What's the plan? Add any details your friends should know..."
              rows={4}
            />
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isUploading}
            className="w-full py-3 bg-primary hover:bg-indigo-600 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Create Event'}
          </button>
        </form>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default CreateEventPage; 