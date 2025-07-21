import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export function useOrder() {
  return useContext(OrderContext);
}

export function OrderProvider({ children }) {
  const [currentOrder, setCurrentOrder] = useState([]);
  const [activeBar, setActiveBar] = useState(null);
  const [scannedTable, setScannedTable] = useState(null);

  const addItemToOrder = (item, quantity, observation) => {
    // Para simplificar, cada adição, mesmo do mesmo item, será uma nova entrada se tiver observação diferente.
    // Isso é mais fácil de gerenciar no carrinho.
    const newItem = {
      ...item,
      quantity,
      observation,
      uniqueId: `${item.id}-${Date.now()}` // ID único para cada entrada no carrinho
    };
    setCurrentOrder(prevOrder => [...prevOrder, newItem]);
  };
  
  const removeItemFromOrder = (uniqueId) => {
    setCurrentOrder(prevOrder => prevOrder.filter(item => item.uniqueId !== uniqueId));
  };
  
  const clearOrder = () => { /* ... sem alterações ... */ };
  const selectTable = (barId, tableNumber) => { /* ... sem alterações ... */ };

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