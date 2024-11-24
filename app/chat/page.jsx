'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, Send, Sword, Shield } from 'lucide-react'

const Avatar = ({ src, alt, size = 'small', className = '' }) => (
  <div className={`rounded-full overflow-hidden flex-shrink-0 ${size === 'large' ? 'w-24 h-24' : 'w-10 h-10'} ${className}`}>
    <Image
      src={src || 'https://via.placeholder.com/150'}
      alt={alt}
      width={size === 'large' ? 96 : 40}
      height={size === 'large' ? 96 : 40}
      className="w-full h-full object-cover"
    />
  </div>
)

const MessageBubble = ({ children, isUser = false }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className={`max-w-[80%] ${isUser ? 'ml-auto' : 'mr-auto'}`}
  >
    <Card className={`overflow-hidden ${isUser ? 'bg-blue-600 border-blue-400' : 'bg-gray-700 border-gray-500'} border-2`}>
      <CardContent className="p-3">
        <p className={`text-sm ${isUser ? 'text-blue-100' : 'text-gray-100'}`}>
          {children}
        </p>
      </CardContent>
    </Card>
  </motion.div>
)

const LoadingAnimation = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex items-center space-x-2 mr-auto"
  >
    <Card className="bg-gray-700 border-gray-500 border-2 overflow-hidden">
      <CardContent className="p-3 flex items-center space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-blue-500 rounded-full"
            animate={{ 
              y: [0, -10, 0],
              opacity: [1, 0.5, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1, 
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </CardContent>
    </Card>
  </motion.div>
)

export default function ChattingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [character, setCharacter] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [summarizedStory, setSummarizedStory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [xp, setXp] = useState(0)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const name = searchParams.get('name')
    const story = searchParams.get('story')
    const imageSrc = searchParams.get('imageSrc')
    
    if (name && imageSrc && story) {
      setCharacter({ name, imageSrc })
      setSummarizedStory(story)
      setMessages([{ sender: name, content: `Hail, brave adventurer! I am ${name}, guardian of these realms. What quest brings you to my domain?` }])
    }
  }, [searchParams])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || !character) return

    const userMessage = { sender: 'User', content: inputMessage }
    setMessages(prevMessages => [...prevMessages, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await axios.post('http://18.206.119.113:8080/ask', {
        query: inputMessage,
        characterName: character.name,
        summarizedStory: summarizedStory
      })
      const characterResponse = { sender: character.name, content: response.data.response }
      setMessages(prevMessages => [...prevMessages, characterResponse])
      setXp(prevXp => prevXp + Math.floor(Math.random() * 15) + 5) // Random XP gain
    } catch (error) {
      console.error("Error getting character response:", error)
      setMessages(prevMessages => [...prevMessages, { sender: character.name, content: "By the ancient powers! Our mystical connection wavers. Let us attempt to reconnect, brave one!" }])
    } finally {
      setIsLoading(false)
    }
  }

  if (!character) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[url('/dungeon-bg.jpg')] bg-cover bg-center text-gray-100">
      <div className="p-4 bg-gray-900/80 backdrop-blur-sm">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to the Realm Selection
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-800">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mb-8"
          >
            <div className="relative">
              <Avatar 
                src={character.imageSrc}
                alt={character.name} 
                size="large" 
                className="border-4 border-blue-600 shadow-lg shadow-blue-500/50"
              />
              <motion.div
                className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="h-6 w-6 text-white" />
              </motion.div>
            </div>
            <h2 className="mt-4 text-4xl font-bold text-blue-400 shadow-text">{character.name}</h2>
            <Badge variant="secondary" className="mt-2 text-lg px-3 py-1 bg-blue-900/80 text-blue-200">
              Level {Math.floor(xp / 100) + 1} • XP: {xp}
            </Badge>
          </motion.div>

          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col ${message.sender === 'User' ? 'items-end' : 'items-start'} mb-4`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.sender !== 'User' && (
                    <Avatar 
                      src={character.imageSrc}
                      alt={character.name}
                      className="hidden sm:block border-2 border-blue-400"
                    />
                  )}
                  <span className="font-medium text-blue-300 shadow-text">{message.sender}</span>
                  <Badge variant={message.sender === 'User' ? 'default' : 'secondary'} className="bg-blue-900/80 text-blue-200">
                    {message.sender === 'User' ? 'Hero' : 'NPC'}
                  </Badge>
                </div>
                <MessageBubble isUser={message.sender === 'User'}>{message.content}</MessageBubble>
              </motion.div>
            ))}
            {isLoading && <LoadingAnimation />}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto relative">
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Address ${character.name}...`}
            className="w-full pr-12 bg-gray-800/90 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={isLoading}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <motion.div 
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-blue-400 shadow-text">Your valor grows with each exchange!</p>
          <p className="text-xs text-gray-400 mt-2">
            Remember, young hero: the words of these beings are but echoes of legend.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

