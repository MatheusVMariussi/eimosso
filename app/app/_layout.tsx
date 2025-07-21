import { AuthProvider } from '../context/AuthContext';
import { OrderProvider } from '../context/OrderContext';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthProvider>
      <OrderProvider>
        <Slot />
      </OrderProvider>
    </AuthProvider>
  );
}