import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Importa suas páginas
import Login from './pages/Login';
import CriarBar from './pages/CriarBar';
import Dashboard from './pages/Dashboard';
import './App.css';

// Componente "guardião" para rotas que exigem login e permissão de 'barOwner'
function PrivateRoute({ children }) {
    const { currentUser, currentUserProfile } = useAuth();
    const location = useLocation();

    if (!currentUser || currentUserProfile?.role !== 'barOwner') {
        // Se o usuário não estiver logado ou não for um dono de bar, redireciona para o login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

// Componente "guardião" para a rota de login
function LoginRoute({ children }) {
    const { currentUser, currentUserProfile } = useAuth();

    // Se o usuário já estiver logado e for um dono de bar, redireciona para o dashboard
    if (currentUser && currentUserProfile?.role === 'barOwner') {
        return <Navigate to="/" replace />;
    }
    
    // Senão, mostra a página de login
    return children;
}

export default function App() {
  const { loading } = useAuth();

  // Mostra uma tela de carregamento global enquanto o status de autenticação é verificado
  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <LoginRoute>
            <Login />
          </LoginRoute>
        } 
      />
      
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/criar-bar" 
        element={
          <PrivateRoute>
            <CriarBar />
          </PrivateRoute>
        } 
      />
      
      {/* Redireciona qualquer rota não encontrada para a principal */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}