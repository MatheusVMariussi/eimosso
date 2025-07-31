import React from 'react';
import { usePedidos, Pedido } from '../../hooks/usePedidos'; // Importa o hook
import { Bar } from '../../hooks/useBarData';

interface PedidosManagerProps {
  bar: Bar | null;
}

export default function PedidosManager({ bar }: PedidosManagerProps) {
  const { pedidos, loading } = usePedidos(bar); // Usa o hook

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