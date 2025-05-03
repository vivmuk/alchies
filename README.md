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
- Visual status indicators for events (upcoming, in progress, completed)
- Google Maps integration for locations
- Expense tracking for events
- Memories map view of all visited locations
- Enhanced UI with customizable accent colors
- Breadcrumb navigation for better context

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

## Firebase Setup

To enable data persistence, follow these steps:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Once your project is created, click "Web" (</>) to add a web app
4. Register your app with a nickname (e.g., "alchies-web")
5. Copy the Firebase configuration object
6. Open `src/services/firebase.ts` and replace the placeholder values with your actual Firebase config
7. In Firebase Console, go to "Firestore Database" and click "Create database"
8. Choose "Start in test mode" for development (you can set up rules later)
9. Select a location close to your users
10. Click "Enable"

Your app now uses Firestore for data persistence. Events will be stored in the cloud and be available across browser refreshes and between different users.

## Security Note

For production, you should:
1. Set up proper Firestore security rules
2. Consider adding authentication
3. Move Firebase API keys to environment variables

## App Icon Setup

To properly set up the app icons for PWA functionality and browser tabs:

1. Create the following image files from the Aubrey headshot:
   - `aubrey-icon-192.png` (192×192 pixels)
   - `aubrey-icon-512.png` (512×512 pixels)
   - `favicon.ico` (multi-resolution icon: 16x16, 32x32, 48x48, 64x64)

2. Place these files in the `public` folder

3. Verify the following files have the correct references:
   - `public/manifest.json` - should reference these icon files
   - `public/index.html` - should have proper meta tags for icons

4. After adding the icon files, rebuild and redeploy the app.

### Creating Icons from Headshot

You can use an online tool to create all required icon formats:

1. Go to [favicon.io](https://favicon.io/favicon-converter/) or [realfavicongenerator.net](https://realfavicongenerator.net/)
2. Upload the Aubrey headshot image
3. Download the generated icon pack
4. Rename and place the files in your public folder:
   - The 192×192 PNG as `aubrey-icon-192.png`
   - The 512×512 PNG as `aubrey-icon-512.png`
   - The ICO file as `favicon.ico`

After adding these files, they will be included in your next Git commit.

## Git Commands for Uploading

```bash
# Add the icon files
git add public/aubrey-icon-192.png
git add public/aubrey-icon-512.png
git add public/favicon.ico

# Add the modified config files 
git add public/manifest.json
git add public/index.html

# Create a commit
git commit -m "Add app icons for PWA and browser tabs"

# Push to your repository
git push
```

## Development

```bash
npm install
npm start
```

## Production Build

```bash
npm run build
```

## Deployment

The app is currently deployed to Netlify/Firebase with automatic deployment from the Git repository.
