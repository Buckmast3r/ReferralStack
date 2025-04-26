import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { ReferralProvider } from './context/ReferralContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ReferralProvider>
        <App />
      </ReferralProvider>
    </AuthProvider>
  </React.StrictMode>
);
