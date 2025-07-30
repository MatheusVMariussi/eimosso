import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

export default function PerfilScreen() {
  const { user } = useAuth(); // Pega os dados do usuário logado

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // O redirecionamento para o login será automático
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair da sua conta.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Ionicons name="person-circle-outline" size={80} color="#333" />
        <Text style={styles.emailText}>{user?.email}</Text>
      </View>

      <View style={styles.menu}>
        {/* Futuramente, podemos adicionar links para outras telas aqui */}
        <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Meus Pedidos</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Configurações</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Um fundo cinza claro
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    color: '#333'
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  menuText: {
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});