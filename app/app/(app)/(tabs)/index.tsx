import { Text, View, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useAuth } from "../../../context/AuthContext"; // Caminho relativo
import { signOut } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig"; // Caminho relativo
import { collection, getDocs } from "firebase/firestore";
import React, { useState, useEffect } from 'react';
import { Link } from "expo-router";

// Definimos um tipo para nossos objetos de bar, para organização
interface Bar {
  id: string;
  nome: string;
  endereco: string;
}

// Renomeei o componente para refletir sua função (opcional, mas boa prática)
export default function BuscaScreen() {
  const { user } = useAuth();
  
  const [bares, setBares] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBares = async () => {
      try {
        const baresCollectionRef = collection(db, 'bares');
        const querySnapshot = await getDocs(baresCollectionRef);
        
        const baresList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Bar[];

        setBares(baresList);
      } catch (error) {
        console.error("Erro ao buscar bares: ", error);
        alert("Não foi possível carregar os bares.");
      } finally {
        setLoading(false);
      }
    };

    fetchBares();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* O título agora vem do layout da pilha, então podemos remover este */}
      <FlatList
        data={bares}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/bar/${item.id}`} asChild>
            <TouchableOpacity style={styles.barItem}>
              <Text style={styles.barName}>{item.nome}</Text>
              <Text style={styles.barAddress}>{item.endereco}</Text>
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={<Text>Nenhum bar cadastrado ainda.</Text>} 
      />
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28, 
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    paddingTop: 20,
  },
  barItem: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  barName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  barAddress: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});