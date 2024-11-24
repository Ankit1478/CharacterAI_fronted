// 'use client';

// import React, { useState } from 'react';

// export default function StoryGenerator() {
//   const [prompt, setPrompt] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [story, setStory] = useState('');

//   const handleGenerateStory = async () => {
//     setIsGenerating(true);

//     // Simulate API request for story generation
//     setTimeout(() => {
//       const generatedStory = `Once upon a time, there was a story generated from the prompt: "${prompt}". The story was filled with wonder and excitement, capturing the hearts of everyone who read it.`;
//       setStory(generatedStory);
//       setIsGenerating(false);
//     }, 2000);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
//       {/* Header Section */}
//       <section className="w-full max-w-2xl text-center mb-12">
//         <h1 className="text-4xl font-bold mb-4 text-gray-800">Generate Your Own Story</h1>
//         <p className="text-lg text-gray-600 mb-8">
//           Enter a creative prompt and watch a story come to life. Unleash your imagination!
//         </p>
//       </section>

//       {/* Input Section */}
//       <section className="w-full max-w-2xl bg-white p-6 rounded-md shadow-lg mb-10">
//         <h2 className="text-2xl font-semibold mb-4 text-gray-700">Enter Your Prompt</h2>
//         <textarea
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//           placeholder="Enter a creative prompt here..."
//           className="w-full h-32 p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
//         />
//         <button
//           onClick={handleGenerateStory}
//           disabled={isGenerating || prompt.trim() === ''}
//           className={`w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
//         >
//           {isGenerating ? (
//             <span className="flex justify-center items-center">
//               <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Generating...
//             </span>
//           ) : 'Generate Story'}
//         </button>
//       </section>

//       {/* Story Output Section */}
//       {story && (
//         <section className="w-full max-w-2xl bg-white p-6 rounded-md shadow-lg">
//           <h2 className="text-2xl font-semibold mb-4 text-gray-700">Generated Story</h2>
//           <p className="text-gray-800">{story}</p>
//         </section>
//       )}
//     </div>
//   );
// }
