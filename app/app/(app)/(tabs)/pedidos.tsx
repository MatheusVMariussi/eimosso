import { Text, View } from 'react-native';

export default function HistoricoScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Histórico de Pedidos</Text>
      <Text>(Em produção)</Text>
    </View>
  );
}