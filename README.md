# Chino Alchies Event Planning App

A social event planning application with Netlify serverless functions for backend support, designed specifically for Chino Alchies group.

## Features

- Create and manage events without login requirements
- Upload event images for each event
- Set event status (active/cancelled)
- Manage RSVPs for the entire group in one place
- Shareable links for each event
- Archive events for later reference
- Permanently delete events when needed
- Mobile-friendly UI with dark mode support
- No login required - anyone can update events

## Default Users

The app comes with the following pre-defined users that can be selected for RSVPs:

- Aubrey
- Tze
- Tram
- Jojo (kid)
- Cameron (kid)
- Cindy
- Stevie
- Caden (kid)
- Cara (kid)
- Patti
- James
- Moe
- Venessa
- Vivek

## Technology Stack

- React with TypeScript
- Redux Toolkit for state management
- Tailwind CSS for styling
- Netlify Functions for serverless backend

## Deployment Setup

### Prerequisites

- Node.js
- npm or yarn
- Git
- Netlify account

### Local Development

1. Clone the repository
   ```
   git clone <repository-url>
   cd alchies
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Install the Netlify CLI
   ```
   npm install -g netlify-cli
   ```

4. Start the local development server with Netlify Functions
   ```
   netlify dev
   ```

### Deploying to Netlify

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)

2. Connect your repository to Netlify:
   - Log in to Netlify
   - Click "New site from Git"
   - Select your repository
   - Use the following build settings:
     - Build command: `npm run build`
     - Publish directory: `build`

3. Configure Netlify Functions:
   - Netlify will automatically detect your functions in the `netlify/functions` directory
   - No additional configuration is required

4. Set up environment variables if needed:
   - Go to your site settings
   - Navigate to "Build & Deploy" > "Environment"
   - Add any required environment variables

## Data Storage

The app uses Netlify Functions to store event data. In this implementation, data is stored in-memory within the functions, which means:

- Data will persist as long as the functions are not redeployed
- After deploying a new version, you'll need to recreate your events

For a more permanent storage solution, you could modify the functions to use:
- Netlify's Key-Value store
- FaunaDB
- MongoDB Atlas
- Another database service

## Using the App

1. Create events by clicking the "New Event" button
2. Update RSVPs by clicking on an event and then on a person's card
3. Archive events from the event details page
4. View archived events in the Memories section
5. Share events using the shareable link on the event details page

## Additional Resources

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/introduction/getting-started)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
