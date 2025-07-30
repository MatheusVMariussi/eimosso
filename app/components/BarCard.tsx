import React from 'react';
import { Text, View, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { isBarOpen } from '../utils/dateUtils';

interface Bar {
  id: string;
  nome: string;
  endereco: string;
  bannerUrl?: string;
  horarios?: any;
}

interface BarCardProps {
  item: Bar;
}

export function BarCard({ item }: BarCardProps) {
  const status = isBarOpen(item.horarios);
  
  return (
    <Link href={`/bar/${item.id}`} asChild>
      <TouchableOpacity style={styles.barCard}>
        <ImageBackground
          source={{ uri: item.bannerUrl || 'https://via.placeholder.com/400x180.png/6c757d/FFFFFF?Text=EiMosso' }}
          style={styles.bannerImage}
          imageStyle={{ borderRadius: 10 }}
        >
          <View style={styles.bannerOverlay}>
            <View style={[styles.statusIndicator, { backgroundColor: status.color }]}>
              <Text style={styles.statusText}>{status.text}</Text>
            </View>
            <View>
              <Text style={styles.barName}>{item.nome}</Text>
              <Text style={styles.barAddress}>{item.endereco}</Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Link>
  );
}

// Copie os estilos relevantes de index.tsx para cá
const styles = StyleSheet.create({
    barCard: {
        height: 180,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    bannerImage: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    bannerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 10,
        padding: 15,
        justifyContent: 'space-between',
    },
    statusIndicator: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    barName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    barAddress: {
        fontSize: 14,
        color: 'white',
    },
});