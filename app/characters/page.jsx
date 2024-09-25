'use client'


import React, { useEffect, useState,Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Image from 'next/image';
import axios from 'axios';

function CharacterCard({ imageSrc, name, author, description, onClick }) {
  return (
    <div className="w-full h-[146px] flex flex-row bg-[#ececee] rounded-lg p-4 flex-shrink-0 cursor-pointer" onClick={onClick}>
      <span 
        className="relative flex h-full w-[90px] overflow-hidden rounded-lg shrink-0 grow-0 mr-3" 
        title={name}
      >
        <Image
          alt={name}
          width={90}
          height={114}
          src={imageSrc}
          className="object-cover object-center bg-card"
        />
      </span>
      
      <div className="flex flex-col justify-between w-full">
        <div>
          <p className="mb-[2px] text-md font-medium text-black leading-tight line-clamp-1">
            {name}
          </p>
          <div className="text-[#62636c] font-normal text-sm truncate mb-[5px]">
            By {author}
          </div>
          <p className="text-black font-normal text-sm line-clamp-3">
            {description}
          </p>
        </div>

        <div className="w-full flex items-center">
          <div className="flex items-center">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              width="14" 
              height="14" 
              className="text-[#62636c] mr-1"
            >
              <path 
                d="M21.5 12c0-5-3.694-8-9.5-8s-9.5 3-9.5 8c0 1.294.894 3.49 1.037 3.83l.037.092c.098.266.49 1.66-1.074 3.722 2.111 1 4.353-.644 4.353-.644 1.551.815 3.397 1 5.147 1 5.806 0 9.5-3 9.5-8Z" 
                stroke="currentColor" 
                strokeLinecap="square" 
                strokeLinejoin="round" 
                strokeWidth="2"
              />
            </svg>
            <p className="text-sm text-[#62636c]">261.8m</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CharacterCardGridContent({ story }) {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCharacters = async () => {
      if (story) {
        setIsLoading(true);
        setError('');
        
        try {
          const response = await axios.post('https://characterai-backend.onrender.com/charactername', { story });
          const characterNames = response.data.response.split(', ');

          const newCharacters = characterNames.map((name) => ({
            imageSrc: "https://characterai.io/i/200/static/avatars/uploaded/2023/5/3/qOYVOyDz0eWY8Wgys_Y343SBCjC_X2kz5ML-yUk9p1o.webp?webp=true&anim=0",
            name: name,
            author: `@${name.toLowerCase().replace(' ', '')}`,
            description: `Character from the story`
          }));

          setCharacters(newCharacters);
        } catch (error) {
          console.error('Error generating characters:', error);
          setError('Failed to generate characters. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCharacters();
  }, [story]);

  const handleCharacterClick = (character) => {
    router.push(`/chat?name=${encodeURIComponent(character.name)}&imageSrc=${encodeURIComponent(character.imageSrc)}&story=${encodeURIComponent(story)}`);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Generated Characters</h1>

      {isLoading && <p>Loading characters...</p>}

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
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
      </div>
    </div>
  );
}

export default function CharacterCardGrid() {
  const [story, setStory] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const storyParam = searchParams.get('story');
    setStory(storyParam);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {story !== null && <CharacterCardGridContent story={story} />}
    </Suspense>
  );
}