import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div style={{ width: '100%', maxWidth: '100%' }}>
      <App />
    </div>
  </React.StrictMode>
);