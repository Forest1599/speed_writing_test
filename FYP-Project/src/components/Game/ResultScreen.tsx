import React from 'react';
import { useState, useEffect, useRef } from 'react'
import saveTypingSession from '../api/SaveTypingSession';
import { CompletedWord } from '../../types/CompletedWord';
import { selectWordsToStore } from '../../utils/wordAnalysis';
import { calculateTypingResults, TypingResults } from '../../utils/typingCalculations';
import { ACCESS_TOKEN } from '../../constants/constants'; // make sure it's imported

type TypingSettings = {
    min_word_length: number,
    max_word_length: number,
    word_frequency_rank: number,
    mode: string,
}

type ResultScreenProps = {
    completedWords: CompletedWord[],
    settings: TypingSettings
}

const ResultScreen: React.FC<ResultScreenProps> = ({
    completedWords,
    settings
}) => {

    const [results, setResults] = useState<TypingResults>({
      correctWords: 0,
      incorrectWords: 0,
      wpm: 0,
      accuracy: 0,
      correctChars: 0,
      totalTypedChars: 0,
      totalBackspaces: 0
    });

    const [hasSaved, setHasSaved] = useState<boolean>(false);

    useEffect(() => {
       const calculatedResults = calculateTypingResults(completedWords);
       setResults(calculatedResults);
    }, [completedWords])

    const hasPosted = useRef(false);

    useEffect(() => {
      const token = localStorage.getItem(ACCESS_TOKEN);

      if (results.wpm > 0 && token && !hasSaved && !hasPosted.current) {
        hasPosted.current = true; // to fix multiple post requests
        const wordsToStore = selectWordsToStore(completedWords);
      
        saveTypingSession(
          results.wpm,
          results.accuracy,
          settings.min_word_length,
          settings.max_word_length,
          settings.word_frequency_rank,
          settings.mode,
          wordsToStore
        )
        
        // Check if the user is authenticated or not
        .then(() => setHasSaved(true))
        .catch((err) => console.error("Error saving session:", err));
      }
    }, [results]);

    
    // Maybe make these into their own components later on
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 text-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Typing Test Results</h2>

        <div className="space-y-4 text-lg">
          <div className="flex justify-between">
            <span>Time:</span>
            <span>60 seconds</span>
          </div>

          <div className="flex justify-between">
            <span>Words Per Minute (WPM):</span>
            <span className="font-semibold text-green-400">{results.correctWords}</span>
          </div>

          <div className="flex justify-between">
            <span>Accuracy:</span>
            <span className="font-semibold text-blue-400">{results.accuracy}%</span>
          </div>

          <div className="flex justify-between">
            <span>Correct Words:</span>
            <span>{results.correctWords} / {completedWords.length}</span>
          </div>

          <div className="flex justify-between">
            <span>Backspaces Used:</span>
            <span className="text-red-500">{results.totalBackspaces}</span>
          </div>

          <div className="mt-8">
          <h3 className="text-center font-semibold text-lg mb-4">❌ Mistyped Words</h3>

          <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto text-sm sm:text-base">
            <div className="text-center font-semibold text-red-400">You Typed</div>
            <div className="text-center font-semibold text-green-400">Correct Word</div>

            {completedWords
              .filter(word => !word.isCorrect)
              .map((word, index) => (
                <React.Fragment key={`mistake-${index}`}>
                  <div className="text-center px-3 py-1 bg-red-500/20 text-red-300 rounded-full">
                    {word.typedWord || <em>(empty)</em>}
                  </div>
                  <div className="text-center px-3 py-1 bg-green-500/20 text-green-300 rounded-full">
                    {word.targetWord}
                  </div>
                </React.Fragment>
              ))}
          </div>

        </div>
          
        </div>
      </div>
      );
}

export default ResultScreen;