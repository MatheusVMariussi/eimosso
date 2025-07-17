import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// A função para login agora é a 'signInWithEmailAndPassword'
import { signInWithEmailAndPassword } from 'firebase/auth';
// Continuamos usando nossa instância de autenticação
import { auth } from '../../firebaseConfig';
// Importamos o Link para navegar para a tela de cadastro se o usuário não tiver conta
import { Link, router } from 'expo-router';

export default function LoginScreen() {
  // Os estados são os mesmos: e-mail e senha
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Função que será chamada ao pressionar o botão "Entrar"
  const handleLogin = async () => {
    try {
      // Usamos a função do Firebase para login, que é a 'signInWithEmailAndPassword'
      await signInWithEmailAndPassword(auth, email, password);
      
      Alert.alert('Login com sucesso!', 'Você será redirecionado.');
      // Após o login, redirecionamos o usuário para a tela inicial (index.tsx)
      router.replace('/'); //

    } catch (error: any) {
      // Se houver erro (senha incorreta, usuário não existe), ele será capturado aqui
      console.error('Erro no login:', error.message);
      Alert.alert('Erro no Login', 'Verifique suas credenciais e tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo de Volta!</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Link para a tela de Cadastro, caso o usuário seja novo */}
      <Link href="/signup" style={styles.link}>
        <Text>Não tem uma conta? Cadastre-se</Text>
      </Link>
    </View>
  );
}

// Usaremos os mesmos estilos para manter a consistência visual
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#28A745', // Verde para diferenciar do cadastro
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
  }
});