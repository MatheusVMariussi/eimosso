import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useOrder } from '../../context/OrderContext';

export default function ScannerScreen() {
  const { barId: expectedBarId } = useLocalSearchParams<{ barId: string }>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const { selectTable } = useOrder();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const params = data.split('&').reduce((acc, part) => {
        const [key, value] = part.split('=');
        if (key && value) acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const scannedBarId = params.barId;
      const scannedTable = params.table;

      if (scannedBarId && scannedTable && scannedBarId === expectedBarId) {
        // Primeiro, atualizamos o estado
        selectTable(scannedBarId, scannedTable);

        // --- A CORREÇÃO ESTÁ AQUI ---
        // Agendamos a navegação para o próximo frame, garantindo que o estado tenha se propagado
        requestAnimationFrame(() => {
          if (router.canGoBack()) {
            router.back();
          }
        });
        
      } else {
        throw new Error("QR Code inválido ou não pertence a este bar.");
      }
    } catch (error: any) {
      Alert.alert(
        'Erro de Leitura',
        error.message || 'Não foi possível ler o QR Code.',
        // Permite que o usuário tente escanear novamente
        [{ text: 'OK', onPress: () => setScanned(false) }] 
      );
    }
  };

  if (hasPermission === null) {
    return <View style={styles.centerText}><Text>Pedindo permissão...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.centerText}><Text>Sem acesso à câmera.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {!scanned && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Aponte para o QR Code da mesa</Text>
          <View style={styles.scanBox} />
        </View>
      )}
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  centerText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  overlayText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
});