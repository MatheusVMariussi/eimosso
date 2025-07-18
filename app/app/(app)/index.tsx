import { Text, View, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebaseConfig"; // Importamos o 'db' também
import { collection, getDocs } from "firebase/firestore"; // Funções para buscar dados
import React, { useState, useEffect } from 'react'; // Hooks para estado e ciclo de vida
import { Link } from "expo-router";

// Definimos um tipo para nossos objetos de bar, para organização
interface Bar {
  id: string;
  nome: string;
  endereco: string;
}

export default function AppIndex() {
  const { user } = useAuth();
  
  // Novos estados: um para o carregamento e um para guardar a lista de bares
  const [bares, setBares] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect é um hook que executa uma função quando o componente "monta" (aparece na tela)
  useEffect(() => {
    // Função assíncrona para buscar os dados no Firestore
    const fetchBares = async () => {
      try {
        // Aponta para a nossa coleção "bares"
        const baresCollectionRef = collection(db, 'bares');
        // getDocs busca todos os documentos da coleção
        const querySnapshot = await getDocs(baresCollectionRef);
        
        // Mapeia os resultados para o formato que queremos (adicionando o ID do documento)
        const baresList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Bar[];

        setBares(baresList); // Salva a lista de bares no nosso estado
      } catch (error) {
        console.error("Erro ao buscar bares: ", error);
        alert("Não foi possível carregar os bares.");
      } finally {
        setLoading(false); // Finaliza o carregamento, independentemente de sucesso ou erro
      }
    };

    fetchBares(); // Chama a função de busca
  }, []); // O array vazio [] significa que este useEffect executa apenas uma vez

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Se estiver carregando, mostra uma "bolinha girando"
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Se não estiver carregando, mostra a lista
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bares Disponíveis</Text>
      
      {/* FlatList é o componente do React Native para renderizar listas com performance */}
      <FlatList
        data={bares} // Os dados que a lista vai usar
        keyExtractor={(item) => item.id} // Uma chave única para cada item
        renderItem={({ item }) => (
          // Envolvemos nosso item com o componente Link.
          // O 'href' é construído dinamicamente com o ID do bar.
          // Ex: /bar/1osSn41jVWZIMBX5yait
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

// Estilos atualizados para a lista
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // Adiciona espaço no topo
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28, 
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  barItem: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
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
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});