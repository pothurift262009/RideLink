import React, { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, SparklesIcon } from './icons/Icons';
import { GoogleGenAI } from '@google/genai';
import type { Chat } from '@google/genai';
import { ChatMessage } from '../types';


interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportChat: React.FC<SupportChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'ai', text: "Hi there! I'm RideLink's AI assistant. How can I help you today?" }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const chatSession = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: `You are a friendly and knowledgeable support agent for RideLink, an intercity carpooling platform in India. Your goal is to provide helpful, concise, and polite assistance to users. Answer questions about booking rides, offering rides, payments, safety features, and user verification. If you don't know an answer, politely say you need to check with the support team. Keep your answers brief and easy to understand.`,
                },
            });
            setChat(chatSession);
        } catch (error) {
            console.error("Failed to initialize Gemini chat:", error);
        }
    } else {
        setChat(null); 
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || isLoading || !chat) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: newMessage.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userPrompt = newMessage.trim();
    setNewMessage('');
    setIsLoading(true);

    try {
        const response = await chat.sendMessage({ message: userPrompt });
        const aiResponseText = response.text;
        const aiMessage: ChatMessage = {
            id: Date.now() + 1,
            sender: 'ai',
            text: aiResponseText,
        };
        setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        const errorMessage: ChatMessage = {
            id: Date.now() + 1,
            sender: 'ai',
            text: "Sorry, I'm having a little trouble right now. Please try again in a moment.",
        };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[99] flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg h-[70vh] flex flex-col transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-slate-800"></span>
          </div>
          <div className="ml-3">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">RideLink Support</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">AI Assistant</p>
          </div>
          <button onClick={onClose} className="ml-auto text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-2xl">&times;</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                 <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                    <SparklesIcon className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-lg'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-lg'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
               <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                    <SparklesIcon className="w-4 h-4 text-white" />
                </div>
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

        {/* Input */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask a question..."
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              autoFocus
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:bg-indigo-300 dark:disabled:bg-indigo-800"
              disabled={!newMessage.trim() || isLoading}
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportChat;