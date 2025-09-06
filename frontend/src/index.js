// src/index.js - React Application Entry Point
import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';

// Remove loading screen when React is ready
const removeLoadingScreen = () => {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.opacity = '0';
    setTimeout(() => {
      if (loading.parentNode) {
        loading.parentNode.removeChild(loading);
      }
    }, 500);
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Remove loading screen after React renders
setTimeout(removeLoadingScreen, 500);

// Service Worker Registration (optional)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}