import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { signUpUser, loginUser } from '../services/AuthService';

export function useAuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    setLoading(true);
    const result = await signUpUser(email, password);
    setLoading(false);

    if (result.success) {
      Alert.alert('Sucesso!', 'Sua conta foi criada.');
      // O AuthLayout fará o redirecionamento automático
    } else {
      Alert.alert('Erro no Cadastro', result.error);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    const result = await loginUser(email, password);
    setLoading(false);

    if (result.success) {
      // O AuthLayout fará o redirecionamento automático
    } else {
      Alert.alert('Erro no Login', result.error);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    handleSignUp,
    handleLogin,
  };
}