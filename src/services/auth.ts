import netlifyIdentity from 'netlify-identity-widget';
import { User } from '../features/events/eventsSlice';

// Initialize Netlify Identity
netlifyIdentity.init();

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Auth service
const authService = {
  // Initialize auth on app start
  init: () => {
    netlifyIdentity.on('init', (user) => {
      if (user) {
        // User is already logged in
        console.log('User is already logged in');
      }
    });

    // Handle login event
    netlifyIdentity.on('login', (user) => {
      netlifyIdentity.close();
      console.log('Login successful');
    });

    // Handle logout event
    netlifyIdentity.on('logout', () => {
      console.log('Logout successful');
    });
  },

  // Open the login modal
  login: () => {
    netlifyIdentity.open('login');
  },

  // Open the signup modal
  signup: () => {
    netlifyIdentity.open('signup');
  },

  // Logout the current user
  logout: () => {
    netlifyIdentity.logout();
  },

  // Get the current user
  getCurrentUser: (): AuthUser | null => {
    const user = netlifyIdentity.currentUser();
    
    if (!user) return null;
    
    return {
      id: user.id,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      avatar: user.user_metadata?.avatar_url
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

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return netlifyIdentity.currentUser() !== null;
  },

  // Get JWT token for API calls
  getToken: async (): Promise<string | null> => {
    const user = netlifyIdentity.currentUser();
    if (!user) return null;
    
    return user.jwt();
  }
};

export default authService; 