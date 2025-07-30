import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';

// --- 1. Definindo as Interfaces ---
// Essas interfaces definem a "forma" dos seus dados

// Representa um item do cardápio como vem do Firestore
interface MenuItem {
  id: string;
  nomeItem: string;
  preco: number;
  descricao: string;
  disponivel: boolean;
}

// Representa um item dentro do carrinho/pedido
interface OrderItem extends MenuItem {
  quantity: number;
  observation: string;
  uniqueId: string; // ID único para o item no carrinho
}

// Interface para todo o valor que o nosso contexto vai fornecer
interface OrderContextData {
  currentOrder: OrderItem[];
  activeBar: string | null;
  scannedTable: string | null;
  isCartVisible: boolean;
  addItemToOrder: (item: MenuItem, quantity: number, observation: string) => void;
  removeItemFromOrder: (uniqueId: string) => void;
  clearOrderItems: () => void;
  leaveTable: () => void;
  selectTable: (barId: string, tableNumber: string) => void;
  openCart: () => void;
  closeCart: () => void;
}

// --- 2. Criando o Contexto com um Valor Padrão ---
// Fornecemos um valor padrão que corresponde à nossa interface.
// Isso corrige o erro "Expected 1 arguments, but got 0".
const OrderContext = createContext<OrderContextData>({
  currentOrder: [],
  activeBar: null,
  scannedTable: null,
  isCartVisible: false,
  addItemToOrder: () => {},
  removeItemFromOrder: () => {},
  clearOrderItems: () => {},
  leaveTable: () => {},
  selectTable: () => {},
  openCart: () => {},
  closeCart: () => {},
});

// Hook customizado para usar o contexto (continua o mesmo)
export function useOrder() {
  return useContext(OrderContext);
}

// --- 3. Tipando o Provider e seus Estados ---
// Adicionamos tipos para 'children' e para cada estado do useState.

interface OrderProviderProps {
  children: ReactNode;
}

export function OrderProvider({ children }: OrderProviderProps) {
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [activeBar, setActiveBar] = useState<string | null>(null);
  const [scannedTable, setScannedTable] = useState<string | null>(null);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const openCart = () => setIsCartVisible(true);
  const closeCart = () => setIsCartVisible(false);

  // Adiciona um novo conjunto de itens ao pedido
  const addItemToOrder = (item: MenuItem, quantity: number, observation: string) => {
    const newItem: OrderItem = {
      ...item,
      quantity,
      observation,
      uniqueId: `${item.id}-${Date.now()}` 
    };
    setCurrentOrder(prevOrder => [...prevOrder, newItem]);
    Alert.alert("Item Adicionado", `${quantity}x ${item.nomeItem} foi adicionado ao seu pedido.`);
  };
  
  // Remove um item específico do pedido usando seu ID único
  const removeItemFromOrder = (uniqueId: string) => {
    setCurrentOrder(prevOrder => prevOrder.filter(item => item.uniqueId !== uniqueId));
  };
  
  // Limpa apenas os itens do carrinho
  const clearOrderItems = () => {
    setCurrentOrder([]);
  };
  
  // Limpa tudo e "sai" da mesa
  const leaveTable = () => {
    setCurrentOrder([]);
    setActiveBar(null);
    setScannedTable(null);
    alert("Você saiu da mesa.");
  };
  
  const selectTable = (barId: string, tableNumber: string) => {
    // Se já estiver em uma mesa diferente, avisa o usuário
    if (activeBar && activeBar !== barId) {
      Alert.alert(
        "Atenção",
        "Você já tem um pedido em andamento em outro bar. Sair da mesa atual irá limpar seu pedido. Deseja continuar?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Continuar", onPress: () => {
              clearOrderItems(); // Limpa itens do pedido antigo
              setActiveBar(barId);
              setScannedTable(tableNumber);
          }}
        ]
      )
    } else {
      setActiveBar(barId);
      setScannedTable(tableNumber);
    }
  };

  const value: OrderContextData = {
    currentOrder,
    activeBar,
    scannedTable,
    isCartVisible,
    addItemToOrder,
    removeItemFromOrder,
    clearOrderItems,
    leaveTable,
    selectTable,
    openCart,
    closeCart,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}