import React, { useState, useEffect, useRef } from 'react';
import { User, Message, Ride } from '../types';
import { mockConversations } from '../data/mockData';
import { PaperAirplaneIcon, SparklesIcon } from './icons/Icons';
import { GoogleGenAI } from '@google/genai';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: User;
  currentUser: User;
  rideId: string;
  ride?: Ride;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, recipient, currentUser, rideId, ride }) => {
  const initialConversation = mockConversations.find(c => c.rideId === rideId);
  const [messages, setMessages] = useState<Message[]>(initialConversation?.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const generateAiSuggestion = async (lastMessage: string) => {
    if (!ride) return; 
    setIsGeneratingSuggestion(true);
    setAiSuggestion(null);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
            You are an AI assistant in a carpooling chat. A user just received this message: "${lastMessage}"
            The ride is from ${ride.from} to ${ride.to} on ${ride.departureDate} at ${ride.departureTime}.
            Generate one concise, helpful reply suggestion for the user to send back.
            - If the message is about pickup location, suggest a common point like "I'll pick you up at the main entrance."
            - If the message is a greeting, suggest a friendly greeting back like "Hey! Looking forward to the ride."
            - The suggestion must be a single, short sentence without any quotes or introductory text.
            - If you cannot generate a relevant suggestion, return an empty string.

            Example of a good reply: Yes, I'll be at the main entrance.
            Example of a bad reply: Here is a suggestion: "Yes, I'll be at the main entrance."
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const suggestionText = response.text.trim().replace(/['"]+/g, '');
        if (suggestionText) {
            setAiSuggestion(suggestionText);
        }
    } catch (error) {
        console.error("Error generating AI suggestion:", error);
        setAiSuggestion(null);
    } finally {
        setIsGeneratingSuggestion(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    setAiSuggestion(null);

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate driver's reply
    setTimeout(() => {
      setIsTyping(false); 
      const driverReplyText = 'Got it! See you then.';
      const driverReply: Message = {
        id: `msg_${Date.now() + 1}`,
        senderId: recipient.id,
        text: driverReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, driverReply]);
      // Generate a smart reply suggestion for the user based on the driver's response
      generateAiSuggestion(driverReplyText);
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
          <img src={recipient.avatarUrl} alt={recipient.name} className="w-10 h-10 rounded-full mr-3" />
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{recipient.name}</h3>
            {ride ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {ride.from} → {ride.to} &middot; {ride.departureTime}
              </p>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">Online</p>
            )}
          </div>
          <button onClick={onClose} className="ml-auto text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-2xl">&times;</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900 space-y-4">
          {messages.map((msg) => {
            const isSentByCurrentUser = msg.senderId === currentUser.id;
            const sender = isSentByCurrentUser ? currentUser : recipient;
            
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
           {isTyping && (
            <div className="flex items-end gap-2 justify-start">
              <img src={recipient.avatarUrl} className="w-6 h-6 rounded-full" />
              <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-slate-200 dark:bg-slate-700">
                  <div className="flex items-center justify-center gap-1.5">
                      <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                  </div>
              </div>
            </div>
          )}
           <div ref={messagesEndRef} />
        </div>

        {/* AI Suggestion Area */}
        {(isGeneratingSuggestion || aiSuggestion) && (
            <div className="px-4 pb-2 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                {isGeneratingSuggestion && <span>Generating smart reply...</span>}
                {aiSuggestion && !isGeneratingSuggestion && (
                    <button
                        onClick={() => {
                            setNewMessage(aiSuggestion);
                            setAiSuggestion(null);
                        }}
                        className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors"
                    >
                        {aiSuggestion}
                    </button>
                )}
            </div>
        )}

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