'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

const Avatar = ({ src, alt, size = 'small', className = '' }) => (
  <div className={`rounded-full overflow-hidden flex-shrink-0 ${size === 'large' ? 'w-20 h-20' : 'w-8 h-8'} ${className}`}>
    <Image
      src={src || 'https://via.placeholder.com/150'}
      alt={alt}
      width={size === 'large' ? 80 : 32}
      height={size === 'large' ? 80 : 32}
      className="w-full h-full object-cover"
    />
  </div>
);

const Badge = ({ children, variant = 'default', className = '' }) => (
  <span className={`text-xs px-3 py-0.5 rounded-full ${
    variant === 'default' ? 'bg-gray-200 text-gray-700' : 'bg-green-200 text-green-700'
  } ${className}`}>
    {children}
  </span>
);

const MessageBubble = ({ children, isUser = false }) => (
  <div className={`max-w-[80%] ${isUser ? 'ml-auto' : 'mr-auto'}`}>
    <p className={`inline-block rounded-lg p-2 ${isUser ? 'bg-gray-200' : 'bg-gray-200'}`}>
      {children}
    </p>
  </div>
);

export default function ChattingPage() {
  const router = useRouter();
  const [character, setCharacter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [summarizedStory, setSummarizedStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const name = searchParams.get('name');
    const story = searchParams.get('story');
    const imageSrc = searchParams.get('imageSrc');
    
    if (name && imageSrc && story) {
      setCharacter({ name, imageSrc });
      setSummarizedStory(story);
      setMessages([{ sender: name, content: `Hey there! I'm ${name}. How can I help you?` }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || !character) return;

    const userMessage = { sender: 'User', content: inputMessage };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('https://chatbot-beckand.onrender.com/ask', {
        query: inputMessage,
        characterName: character.name,
        summarizedStory: summarizedStory
      });
      const characterResponse = { sender: character.name, content: response.data.response };
      setMessages(prevMessages => [...prevMessages, characterResponse]);
    } catch (error) {
      console.error("Error getting character response:", error);
      setMessages(prevMessages => [...prevMessages, { sender: character.name, content: "I'm sorry, I'm having trouble responding right now. Could you please try again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!character) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-white p-2 sm:p-6">
      <div className="mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-1 text-sm font-medium text-black hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back</span>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center mb-5">
            <Avatar 
              src={character.imageSrc}
              alt={character.name} 
              size="large" 
            />
            <h2 className="mt-2 text-2xl font-semibold">{character.name}</h2>
          </div>

          <div className="space-y-4 mb-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex flex-col ${message.sender === 'User' ? 'items-end' : 'space-y-1'}`}>
                <div className="flex items-center space-x-1">
                  {message.sender !== 'User' && (
                    <Avatar 
                      src={character.imageSrc}
                      alt={character.name}
                      className="hidden sm:block"
                    />
                  )}
                  <span className="font-medium">{message.sender}</span>
                  <Badge variant={message.sender === 'User' ? 'green' : 'default'}>c.ai</Badge>
                </div>
                <MessageBubble isUser={message.sender === 'User'}>{message.content}</MessageBubble>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-gray-200">
        <div className="max-w-lg mx-auto relative">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Message ${character.name}...`}
            className="w-full p-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black h-[47px]"
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white rounded-full p-2 hover:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <p className="mt-2 text-xs text-center text-gray-500">
          Remember: Everything Characters say is made up!
        </p>
      </div>
    </div>
  );
}