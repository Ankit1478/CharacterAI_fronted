'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, MessageSquare } from 'lucide-react'

function CharacterCard({ imageSrc, name, author, description, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="w-full h-[146px] flex flex-row bg-black/50 border-gray-800 backdrop-blur-sm rounded-lg p-4 flex-shrink-0 cursor-pointer hover:bg-purple-900/20 transition-all duration-300"
        onClick={onClick}
      >
        <CardContent className="p-0 flex flex-row w-full">
          <span 
            className="relative flex h-full w-[90px] overflow-hidden rounded-lg shrink-0 grow-0 mr-3" 
            title={name}
          >
            <Image
              alt={name}
              width={90}
              height={114}
              src={imageSrc}
              className="object-cover object-center bg-purple-900/30"
            />
          </span>
          
          <div className="flex flex-col justify-between w-full">
            <div>
              <p className="mb-[2px] text-md font-medium text-gray-200 leading-tight line-clamp-1">
                {name}
              </p>
              <div className="text-gray-400 font-normal text-sm truncate mb-[5px]">
                By {author}
              </div>
              <p className="text-gray-300 font-normal text-sm line-clamp-3">
                {description}
              </p>
            </div>

            <div className="w-full flex items-center">
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 text-gray-400 mr-1" />
                <p className="text-sm text-gray-400">261.8m</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function CharacterCardGridContent({ story }) {
  const [characters, setCharacters] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchCharacters = async () => {
      if (story) {
        setIsLoading(true)
        setError('')
        
        try {
          const response = await axios.post('http://18.206.119.113:8080/charactername', { story })
          const characterNames = response.data.response.split(', ')

          const newCharacters = characterNames.map((name) => ({
            imageSrc: "https://characterai.io/i/200/static/avatars/uploaded/2023/5/3/qOYVOyDz0eWY8Wgys_Y343SBCjC_X2kz5ML-yUk9p1o.webp?webp=true&anim=0",
            name: name,
            author: `@${name.toLowerCase().replace(' ', '')}`,
            description: `Character from the story`
          }))

          setCharacters(newCharacters)
        } catch (error) {
          console.error('Error generating characters:', error)
          setError('Failed to generate characters. Please try again.')
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchCharacters()
  }, [story])

  const handleCharacterClick = (character) => {
    router.push(`/chat?name=${encodeURIComponent(character.name)}&imageSrc=${encodeURIComponent(character.imageSrc)}&story=${encodeURIComponent(story)}`)
  }

  return (
    <div className="flex flex-col items-center">
      <motion.h1 
        className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Characters Summoned
      </motion.h1>

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center space-x-2 text-purple-400"
        >
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Summoning characters...</span>
        </motion.div>
      )}

      {error && (
        <motion.p 
          className="text-red-400 bg-red-900/20 border border-red-900/50 rounded-lg px-4 py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {error}
        </motion.p>
      )}

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 w-full max-w-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AnimatePresence>
          {characters.map((character, index) => (
            <CharacterCard 
              key={index}
              imageSrc={character.imageSrc}
              name={character.name}
              author={character.author}
              description={character.description}
              onClick={() => handleCharacterClick(character)}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default function CharacterCardGrid() {
  const searchParams = useSearchParams()
  const story = searchParams.get('story')

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="relative px-6 py-24 flex flex-col items-center">
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        }>
          {story !== null && <CharacterCardGridContent story={story} />}
        </Suspense>
      </div>
    </div>
  )
}

