import React, { useState } from 'react';
import BottomNavigation from '../components/BottomNavigation';

// Mock current user for demo
const currentUser = {
  id: '1',
  name: 'Alex',
  avatar: 'https://i.pravatar.cc/150?img=1',
  email: 'alex@example.com'
};

const ProfilePage: React.FC = () => {
  // Mock state for settings
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reminder: true
  });
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Toggle notifications
  const toggleNotification = (type: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [type]: !notifications[type]
    });
  };
  
  return (
    <div className="min-h-screen bg-background dark:bg-dark-background text-gray-900 dark:text-white pb-16">
      <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-md p-4 z-10">
        <h1 className="text-2xl font-bold text-center">Profile</h1>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center mb-8">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 rounded-full mb-4"
          />
          <h2 className="text-xl font-bold">{currentUser.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">{currentUser.email}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold">App Settings</h3>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium">Dark Mode</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark/light theme</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive event updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={notifications.email}
                  onChange={() => toggleNotification('email')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h4 className="font-medium">Push Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get notifications on your device</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={notifications.push}
                  onChange={() => toggleNotification('push')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium">Event Reminders</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get reminded about upcoming events</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={notifications.reminder}
                  onChange={() => toggleNotification('reminder')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <button
            onClick={() => alert('This would sign out a user in a real app')}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-2xl transition"
          >
            Sign Out
          </button>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage; 