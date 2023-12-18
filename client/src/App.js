import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import NotFound from './views/NotFound';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './views/Dashboard';
import Workouts from './views/Workouts'; 
import Messages from './views/Messages'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workouts" element={<Workouts />} /> 
          <Route path="/messages" element={<Messages />} /> 
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
