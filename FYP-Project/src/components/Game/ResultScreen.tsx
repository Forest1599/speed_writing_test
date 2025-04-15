import { useState, useEffect } from 'react'

import saveTypingSession from '../api/SaveTypingSession';
import { CompletedWord } from '../../types/CompletedWord';
import { selectWordsToStore } from '../../utils/wordAnalysis';
import { calculateTypingResults, TypingResults } from '../../utils/typingCalculations';

type TypingSettings = {
    min_word_length: number,
    max_word_length: number,
    word_frequency_rank: number,
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


    useEffect(() => {
      if (results.wpm > 0 && results.accuracy > 0 && !hasSaved) {
        const wordsToStore = selectWordsToStore(completedWords);
      
        saveTypingSession(
          results.wpm,
          results.accuracy,
          settings.min_word_length,
          settings.max_word_length,
          settings.word_frequency_rank,
          wordsToStore
        )
        
        // Check if the user is authenticated or not
          .then(() => setHasSaved(true))
          .catch((err) => console.error("Error saving session:", err));
      }
    }, [results.wpm, results.accuracy, hasSaved]);


    return (
        <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Test Results</h2>
          <div className="flex flex-col gap-2">
            {/* <p>Total Words: <span className="font-bold">{totalWords}</span></p> */}
            {/* <p>Correct Words: <span className="font-bold">{correctWords}</span></p> */}
            <p>Incorrect Words: <span className="font-bold">{results.incorrectWords}</span></p>
            <p>Words Per Minute (WPM): <span className="font-bold">{results.wpm}</span></p>
            <p>Accuracy: <span className="font-bold">{results.accuracy}%</span></p>
          </div>
        </div>
      );
}

export default ResultScreen;