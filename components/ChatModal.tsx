import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import { mockConversations } from '../data/mockData';
import { PaperAirplaneIcon } from './icons/Icons';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: User;
  currentUser: User;
  rideId: string;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, driver, currentUser, rideId }) => {
  const initialConversation = mockConversations.find(c => c.rideId === rideId);
  const [messages, setMessages] = useState<Message[]>(initialConversation?.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate driver's reply
    setTimeout(() => {
      const driverReply: Message = {
        id: `msg_${Date.now() + 1}`,
        senderId: driver.id,
        text: 'Got it! See you then.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, driverReply]);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg h-[70vh] flex flex-col transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <img src={driver.avatarUrl} alt={driver.name} className="w-10 h-10 rounded-full mr-3" />
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{driver.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Online</p>
          </div>
          <button onClick={onClose} className="ml-auto text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-2xl">&times;</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900 space-y-4">
          {messages.map((msg) => {
            const isSentByCurrentUser = msg.senderId === currentUser.id;
            const sender = isSentByCurrentUser ? currentUser : driver;
            
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isSentByCurrentUser && (
                  <img src={sender.avatarUrl} className="w-6 h-6 rounded-full" />
                )}
                <div
                  className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
                    isSentByCurrentUser
                      ? 'bg-indigo-600 text-white rounded-br-lg'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-lg'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${isSentByCurrentUser ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'} text-right`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            )
          })}
           <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              autoFocus
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:bg-indigo-300 dark:disabled:bg-indigo-800"
              disabled={!newMessage.trim()}
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
