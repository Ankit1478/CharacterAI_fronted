'use client'

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { Typewriter } from 'react-simple-typewriter';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [story, setStory] = useState('');
  const [storyId, setStoryId] = useState(null);
  const [generatedStory, setGeneratedStory] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [isFetchingSummary, setIsFetchingSummary] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let interval;
    if (storyId && !generatedStory) {
      setIsFetchingSummary(true); // Set fetching summary state to true
      interval = setInterval(async () => {
        try {
          const response = await axios.get(`https://characterai-backend.onrender.com/getSummary/${storyId}`);
          if (response.status === 200) {
            setGeneratedStory(response.data.summary);
            clearInterval(interval);
            setIsFetchingSummary(false); // Set fetching summary state to false after completion
          }
        } catch (err) {
          console.error("Error fetching summary:", err);
          setIsFetchingSummary(false); // Handle error by stopping the loader
        }
      }, 5000); // Poll every 5 seconds
    }
    return () => clearInterval(interval); // Clean up interval on unmount
  }, [storyId, generatedStory]);

  async function fetchStory() {
    try {
      setIsLoading(true);
      setGeneratedStory('');
      setStoryId(null);

      // Submit the story
      const addResponse = await axios.post("https://characterai-backend.onrender.com/submitStory", { story },{
        withCredentials: true,
        timeout: 30000
      });
      
      const { storyId } = addResponse.data;
      setStoryId(storyId);

      setError(null); // Reset error on success
    } catch (error) {
      setError("Error submitting story. Please try again.");
      console.error("Error submitting story:", error);
    } finally {
      setIsLoading(false); // Stop the main loading after submission
    }
  }

  const handleCharacterGeneration = () => {
    if (generatedStory) {
      router.push(`/characters?story=${encodeURIComponent(story)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Eye-Catching Title */}
        <h1 className="text-3xl font-extrabold text-center text-black dark:text-white">
  Generate a Story & <br /> Chat with its Characters
</h1>


        <Card className="w-full">
          <CardHeader>
            <CardTitle>Enter Your Story Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Once upon a time..."
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={fetchStory} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating
                  </>
                ) : (
                  'Generate Story'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Show loader while fetching summary */}
        {isFetchingSummary && (
          <div className="flex justify-center mt-8">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Generating story.....
          </div>
        )}

        {generatedStory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Generated Story</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-700 leading-relaxed">
                  <Typewriter
                    words={[generatedStory]}
                    loop={1}
                    cursor
                    cursorStyle='_'
                    typeSpeed={5}
                    deleteSpeed={80}
                    delaySpeed={1000}
                  />
                </p>
              </CardContent>
            </Card>

            <Button
              variant="outline"
              className="mt-4"
              onClick={handleCharacterGeneration}
            >
              Generate Characters from this Story
            </Button>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-red-500 text-center"
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
