import React from 'react';
import ReactDOM from 'react-dom/client'; 
import './styling/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider> {/* Make sure AuthProvider wraps your App component */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
