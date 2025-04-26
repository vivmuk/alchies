import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import './App.css';

// Import pages
import HomePage from './pages/HomePage';
import CreateEventPage from './pages/CreateEventPage';
import EventDetailsPage from './pages/EventDetailsPage';
import MemoriesPage from './pages/MemoriesPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateEventPage />} />
            <Route path="/event/:id" element={<EventDetailsPage />} />
            <Route path="/edit-event/:id" element={<CreateEventPage />} />
            <Route path="/memories" element={<MemoriesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
