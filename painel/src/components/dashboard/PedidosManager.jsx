import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export default function PedidosManager({ bar }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Efeito para buscar os pedidos em tempo real
  useEffect(() => {
    if (!bar) return;

    // Cria uma consulta que busca na coleção 'pedidos':
    // 1. Onde o 'barId' é igual ao ID do bar logado.
    // 2. E ordena os resultados pelo mais recente primeiro.
    const pedidosRef = collection(db, "pedidos");
    const q = query(pedidosRef, where("barId", "==", bar.id), orderBy("timestamp", "desc"));

    // onSnapshot "ouve" as mudanças na consulta em tempo real.
    // Toda vez que um novo pedido é adicionado, este código executa novamente.
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pedidosList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPedidos(pedidosList);
      setLoading(false);
    });

    // Limpa o "ouvinte" quando o componente não está mais na tela
    return () => unsubscribe();
  }, [bar]); // Roda a busca sempre que a informação do bar mudar

  if (loading) {
    return <p>Aguardando novos pedidos...</p>;
  }

  return (
    <div className="pedidos-container">
      {pedidos.length === 0 ? (
        <p>Nenhum pedido recebido ainda.</p>
      ) : (
        pedidos.map(pedido => (
          <div key={pedido.id} className="pedido-card">
            <div className="pedido-header">
              <h3>Mesa: {pedido.mesa}</h3>
              <span>{new Date(pedido.timestamp?.toDate()).toLocaleTimeString()}</span>
            </div>
            <div className="pedido-body">
              {pedido.itens.map(item => (
                <div key={item.itemId} className="pedido-item">
                  <span className="item-qnt">{item.quantidade}x</span>
                  <div className="item-details">
                    <span className="item-name">{item.nomeItem}</span>
                    {item.observacao && <small className="item-obs">Obs: {item.observacao}</small>}
                  </div>
                </div>
              ))}
            </div>
            <div className="pedido-footer">
              <strong>Total: R$ {pedido.total.toFixed(2)}</strong>
              {/* No futuro, aqui podemos adicionar botões para "Marcar como pronto" */}
            </div>
          </div>
        ))
      )}
    </div>
  );
}