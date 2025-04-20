import { User } from '../features/events/eventsSlice';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Simplified auth service that doesn't use netlify-identity-widget
const authService = {
  // Initialize auth on app start
  init: () => {
    console.log('Auth service initialized - using dummy implementation');
  },

  // Login (dummy implementation)
  login: () => {
    console.log('Login function called (dummy implementation)');
  },

  // Signup (dummy implementation)
  signup: () => {
    console.log('Signup function called (dummy implementation)');
  },

  // Logout (dummy implementation)
  logout: () => {
    console.log('Logout function called (dummy implementation)');
  },

  // Get the current user - returns a dummy user
  getCurrentUser: (): AuthUser | null => {
    return {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      avatar: undefined
    };
  },

  // Get the current user as an app User type
  getCurrentAppUser: (): User | null => {
    const user = authService.getCurrentUser();
    
    if (!user) return null;
    
    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar
    };
  },

  // Check if user is authenticated - always returns true in this dummy implementation
  isAuthenticated: (): boolean => {
    return true;
  },

  // Get JWT token for API calls - returns a dummy token
  getToken: async (): Promise<string | null> => {
    return 'dummy-jwt-token';
  }
};

export default authService; 