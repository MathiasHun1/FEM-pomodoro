import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './main.scss';

import App from './App.jsx';
import ClockProvider from './contexts/ClockProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClockProvider>
      <App />
    </ClockProvider>
  </StrictMode>
);
