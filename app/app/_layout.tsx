import { AuthProvider } from '../context/AuthContext';
import { Slot } from 'expo-router';

// O layout raiz agora é extremamente simples.
// Ele apenas envolve todo o aplicativo com o nosso AuthProvider.
export default function RootLayout() {
  return (
    <AuthProvider>
      {/* O <Slot /> do Expo Router irá renderizar a rota filha correspondente.
          Se o usuário estiver em /login, ele renderiza o (auth) layout.
          Se estiver em /, ele renderiza o (app) layout. */}
      <Slot />
    </AuthProvider>
  );
}