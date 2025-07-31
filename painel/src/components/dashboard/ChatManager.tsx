import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat'; // Importa o hook
import { Bar } from '../../hooks/useBarData';
import { useAuth } from '../../context/AuthContext';

interface ChatManagerProps {
  bar: Bar | null;
}

export default function ChatManager({ bar }: ChatManagerProps) {
  const { currentUser } = useAuth();
  const { 
    conversations, 
    selectedConversation, 
    setSelectedConversation, 
    messages, 
    sendMessage,
  } = useChat(bar);
  
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="card">
      <h2>Conversas com Clientes</h2>
      <div className="chat-layout">
        <div className="conversations-list">
          {conversations.map(conv => (
            <div key={conv.id} className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''}`} onClick={() => setSelectedConversation(conv)}>
              <strong>{conv.userName}</strong>
              <p>{conv.lastMessage}</p>
            </div>
          ))}
        </div>
        <div className="chat-window">
          {selectedConversation ? (
            <>
              <div className="messages-area">
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    // A correção está aqui: currentUser?.uid
                    className={`message-bubble ${msg.senderId === currentUser?.uid ? 'mine' : 'theirs'}`}
                  >
                    <p>{msg.text}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="message-input-form">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Digite sua resposta..."/>
                <button type="submit">Enviar</button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected"><p>Selecione uma conversa para visualizar.</p></div>
          )}
        </div>
      </div>
    </div>
  );
}