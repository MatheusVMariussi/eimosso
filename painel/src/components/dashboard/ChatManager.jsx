import React from 'react';

export default function ChatManager({ conversations, selectedConversation, setSelectedConversation, messages, currentUser, handleSendMessage, newMessage, setNewMessage }) {
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
                  <div key={msg.id} className={`message-bubble ${msg.senderId === currentUser.uid ? 'mine' : 'theirs'}`}>
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