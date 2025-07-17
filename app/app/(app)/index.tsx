import { Text, View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function AppIndex() {
  const { user } = useAuth(); // Pegamos o usuário do contexto

  const handleLogout = async () => {
    try {
      await signOut(auth); // Função do Firebase para fazer logout
      Alert.alert("Logout", "Você saiu da sua conta.");
      // O nosso layout (app) irá detectar a mudança e nos redirecionar para o login.
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível fazer logout.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Mostra uma mensagem de boas-vindas com o email do usuário */}
      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.email}>{user?.email}</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair (Logout)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    marginBottom: 20,
    color: 'gray',
  },
  button: {
    backgroundColor: '#dc3545', // Cor vermelha para o logout
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});