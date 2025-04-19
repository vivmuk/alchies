# Alchies - Event Planning App

A mobile-first web application for friend groups to plan, track, and remember social meetups.

## Features

- Event creation with title, date/time, location, and description
- RSVP tracking (attending/not attending)
- AI-generated thematic imagery for events
- Automatic archival of past events to the Memories page
- Dark/light mode support
- Mobile-first responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies

```bash
npm install
```

### Running the Application

Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`

### Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be available in the `build` directory and can be deployed to any static host, including Netlify.

## Deployment to Netlify

1. Create a free account on Netlify (https://www.netlify.com/)
2. Connect your Git repository or upload the build folder
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
4. Deploy

## Technologies Used

- React with TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Date-fns for date formatting

## Future Enhancements

- User authentication
- Real backend API integration
- Push notifications
- Calendar sync
- Guest list management with contact import
- Event filtering and search
- Offline support

## License

This project is licensed under the MIT License.
