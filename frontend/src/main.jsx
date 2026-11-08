// ==============================================================================
// FRONTEND ENTRY POINT (frontend/src/main.jsx)
// React App Ka Browser DOM Ke Sath Connection
// Roman Urdu Comments: Har line ki asaan wazahat
// ==============================================================================

// 1. React aur ReactDOM libraries import karna
import React from 'react';
import ReactDOM from 'react-dom/client';

// 2. Main App component import karna jisme poori website ke routes hain
import App from './App.jsx';

// 3. Global CSS (Tailwind styles) load karna
import './index.css';

// 4. index.html ke andar mojood '<div id="root"></div>' ko target kar ke React app mount karna
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Poori website ka main App component */}
    <App />
  </React.StrictMode>,
);
