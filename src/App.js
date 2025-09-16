import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import './App.css'; // You can remove this if not needed

// Import Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/User/Profile';
import Navbar from './components/Navbar';
import Quiz from './components/Quiz/Quiz'; // Import Quiz component
import Recommendations from './components/Recommendations/Recommendations'; // Import Recommendations component
import Careers from './components/Careers/Careers'; // Import Careers component
import Colleges from './components/Colleges/Colleges'; // Import Colleges component
import ParentPortal from './components/Parent/ParentPortal'; // Import ParentPortal component

// Placeholder components for other routes
const Dashboard = () => {
  const { t } = useTranslation();
  return <div className="text-center py-10">{t('dashboard')} Content</div>;
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading application...</div>;
  }

  return (
    <Router>
      <div className="App">
        {currentUser ? <Navbar /> : null}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {currentUser ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/colleges" element={<Colleges />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/parent-portal" element={<ParentPortal />} />
            </>
          ) : (
            <Route path="*" element={<Login />} /> // Redirect to login if not authenticated
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
