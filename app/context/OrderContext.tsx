import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';

const OrderContext = createContext();

export function useOrder() {
  return useContext(OrderContext);
}

export function OrderProvider({ children }) {
  const [currentOrder, setCurrentOrder] = useState([]);
  const [activeBar, setActiveBar] = useState(null);
  const [scannedTable, setScannedTable] = useState(null);

  // Adiciona um novo conjunto de itens ao pedido (vindo do modal)
  const addItemToOrder = (item, quantity, observation) => {
    const newItem = {
      ...item,
      quantity,
      observation,
      // Criamos um ID único para esta entrada específica no carrinho,
      // permitindo ter o mesmo item com observações diferentes.
      uniqueId: `${item.id}-${Date.now()}` 
    };
    setCurrentOrder(prevOrder => [...prevOrder, newItem]);
    Alert.alert("Item Adicionado", `${quantity}x ${item.nomeItem} foi adicionado ao seu pedido.`);
  };
  
  // Remove um item específico do pedido usando seu ID único
  const removeItemFromOrder = (uniqueId) => {
    setCurrentOrder(prevOrder => prevOrder.filter(item => item.uniqueId !== uniqueId));
  };
  
  // Limpa todo o pedido, geralmente após finalizar ou sair do bar
  const clearOrder = () => {
    setCurrentOrder([]);
    setActiveBar(null);
    setScannedTable(null);
  };
  
  // Simula o scan da mesa e "entra" no bar
  const selectTable = (barId, tableNumber) => {
    // Se já estivermos em um bar, perguntamos se o usuário quer trocar.
    if (activeBar && activeBar !== barId) {
        Alert.alert(
            "Trocar de bar?",
            "Seu pedido atual será esvaziado. Deseja continuar?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "OK", onPress: () => {
                    clearOrder();
                    setActiveBar(barId);
                    setScannedTable(tableNumber);
                    Alert.alert("Pronto!", `Você entrou em um novo bar e está na mesa ${tableNumber}!`);
                }}
            ]
        );
    } else {
        setActiveBar(barId);
        setScannedTable(tableNumber);
        Alert.alert("Pronto!", `Você entrou no bar e está na mesa ${tableNumber}!`);
    }
  };

  // Junta todos os valores e funções que queremos disponibilizar para o app
  const value = {
    currentOrder,
    activeBar,
    scannedTable,
    addItemToOrder,
    removeItemFromOrder,
    selectTable,
    clearOrder,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}