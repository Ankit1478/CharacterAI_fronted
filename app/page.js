'use client'

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import axios from "axios"
import { Typewriter } from 'react-simple-typewriter'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles } from 'lucide-react'

export default function Home() {
  const [story, setStory] = useState('')
  const [storyId, setStoryId] = useState(null)
  const [generatedStory, setGeneratedStory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingSummary, setIsFetchingSummary] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    let interval
    if (storyId && !generatedStory) {
      setIsFetchingSummary(true)
      interval = setInterval(async () => {
        try {
          const response = await axios.get(`http://18.206.119.113:8080/getSummary/${storyId}`)
          if (response.status === 200) {
            setGeneratedStory(response.data.summary)
            clearInterval(interval)
            setIsFetchingSummary(false)
          }
        } catch (err) {
          console.error("Error fetching summary:", err)
          setIsFetchingSummary(false)
        }
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [storyId, generatedStory])

  async function fetchStory() {
    try {
      setIsLoading(true)
      setGeneratedStory('')
      setStoryId(null)

      const addResponse = await axios.post("http://18.206.119.113:8080/submitStory", { story }, {
        withCredentials: true,
        timeout: 30000
      })
      
      const { storyId } = addResponse.data
      setStoryId(storyId)
      setError(null)
    } catch (error) {
      setError("Error submitting story. Please try again.")
      console.error("Error submitting story:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCharacterGeneration = () => {
    if (generatedStory) {
      router.push(`/characters?story=${encodeURIComponent(story)}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative px-6 pt-20 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center space-y-8 max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Enter the Realm of Stories
          </h1>
  
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Forge legendary tales and bring characters to life in an epic adventure
          </p>
  
          <Card className="bg-black/50 border border-gray-800 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-gray-200">Begin Your Tale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  type="text"
                  placeholder="write your story title"
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="flex-grow bg-black/30 border-gray-800 text-gray-200 placeholder:text-gray-500"
                />
                <Button
                  onClick={fetchStory}
                  disabled={isLoading}
                  className="relative group overflow-hidden bg-purple-900 hover:bg-purple-800 text-white transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Conjuring
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Forge Story
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </div>
            </CardContent>
          </Card>
  
          <AnimatePresence mode="wait">
            {isFetchingSummary && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center justify-center gap-3 text-purple-400"
              >
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-lg">Weaving your tale...</span>
              </motion.div>
            )}
  
            {generatedStory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <Card className="bg-black/50 border border-gray-800 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-gray-200">Your Epic Tale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-gray-300 leading-relaxed">
                      <Typewriter
                        words={[generatedStory]}
                        loop={1}
                        cursor
                        cursorStyle='|'
                        typeSpeed={5}
                        deleteSpeed={80}
                        delaySpeed={1000}
                      />
                    </p>
                  </CardContent>
                </Card>
  
                <Button
                  variant="outline"
                  onClick={handleCharacterGeneration}
                  className="relative group overflow-hidden border-gray-700 hover:border-purple-500 text-gray-200"
                >
                  <span className="relative z-10">Summon Characters</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </motion.div>
            )}
  
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-center bg-red-900/20 border border-red-900/50 rounded-lg px-4 py-2"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

