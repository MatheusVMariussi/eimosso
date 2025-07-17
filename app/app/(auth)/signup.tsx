import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// Importa a função de criação de usuário do Firebase Auth
import { createUserWithEmailAndPassword } from 'firebase/auth';
// Importa nossa instância de autenticação que configuramos anteriormente
import { auth } from '../../firebaseConfig';
// O Link permite navegar para outras telas
import { Link, router } from 'expo-router';

export default function SignUpScreen() {
  // Criamos "estados" para armazenar o que o usuário digita.
  // Começam como strings vazias.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Esta é a função que será chamada quando o botão de cadastro for pressionado.
  const handleSignUp = async () => {
    // 1. Validação simples: verifica se as senhas coincidem.
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    // 2. Tenta criar o usuário no Firebase
    try {
      // Usamos a função do Firebase, passando o 'auth', o email e a senha.
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Se der certo, o usuário é criado.
      console.log('Usuário criado com sucesso!', userCredential.user.email);
      Alert.alert('Sucesso!', 'Sua conta foi criada.');

      // Opcional: Redireciona o usuário para a tela inicial após o cadastro.
      router.replace('/'); // A função 'replace' substitui a tela atual pela nova.

    } catch (error: any) {
      // 3. Se ocorrer um erro (ex: e-mail já em uso, senha fraca), ele cairá aqui.
      console.error('Erro no cadastro:', error.message);
      // Mostra um alerta com a mensagem de erro do Firebase para o usuário.
      Alert.alert('Erro no Cadastro', error.message);
    }
  };

  // 4. A parte visual da tela (componentes)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie sua Conta</Text>

      {/* Campo de entrada para o E-mail */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail} // A cada letra digitada, atualiza o estado 'email'.
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Campo de entrada para a Senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword} // Atualiza o estado 'password'.
        secureTextEntry // Esconde os caracteres da senha.
      />

      {/* Campo de entrada para confirmar a Senha */}
      <TextInput
        style={styles.input}
        placeholder="Confirme a Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword} // Atualiza o estado 'confirmPassword'.
        secureTextEntry
      />

      {/* Botão para chamar a função de cadastro */}
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      {/* Link para a tela de Login (que criaremos a seguir) */}
      <Link href="/login" style={styles.link}>
        <Text>Já tem uma conta? Faça Login</Text>
      </Link>
    </View>
  );
}

// 5. Folha de estilos para organizar a aparência da tela.
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
    backgroundColor: '#007BFF',
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