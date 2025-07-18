import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // Importa o roteador
import { AuthProvider } from './context/AuthContext'; // Importa nosso provedor

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* O Provedor envolve o App */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);