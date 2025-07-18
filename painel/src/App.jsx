import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import CriarBar from './pages/CriarBar';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // 1. Importa o nosso guardião

function App() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      
      {/* Rotas Protegidas */}
      <Route 
        path="/criar-bar" 
        element={
          <ProtectedRoute> {/* Protege a criação do bar também */}
            <CriarBar />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={
          <ProtectedRoute> {/* 2. Envolve o Dashboard com o ProtectedRoute */}
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;