import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from '@/context/AuthContext'; // Use alias '@'
import { ReferralProvider } from '@/context/ReferralContext'; // Use alias '@'
import App from '@/App'; // Use alias '@'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ReferralProvider>
        <App />
      </ReferralProvider>
    </AuthProvider>
  </React.StrictMode>
);
