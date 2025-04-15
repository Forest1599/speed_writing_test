import { useState, useEffect } from 'react'

import saveTypingSession from '../api/SaveTypingSession';
import { CompletedWord } from '../../types/types';
import { selectWordsToStore } from '../../utils/wordAnalysis';

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

    // Result stats (for now)
    const [correctWords, setCorrectWords] = useState<number>(0);
    const [incorrectWords, setIncorrectWords] = useState<number>(0);
    const [wpm, setWpm] = useState<number>(0);
    const [accuracy, setAccuracy] = useState<number>(0);
    const [hasSaved, setHasSaved] = useState<boolean>(false);

    useEffect(() => {
        calculateResults();
    }, [completedWords])


    useEffect(() => {
        if (wpm > 0 && accuracy > 0 && !hasSaved) {
            const wordsToStore = selectWordsToStore(completedWords);
        
            // You could pass it to saveTypingSession here
            saveTypingSession(
              wpm,
              accuracy,
              settings.min_word_length,
              settings.max_word_length,
              settings.word_frequency_rank,
              wordsToStore
            )
              .then(() => setHasSaved(true))
              .catch((err) => console.error("Error saving session:", err));
          }
      }, [wpm, accuracy, hasSaved]);


    const calculateResults = () => {
        const totalWords = completedWords.length;
        const correctCount = completedWords.filter(word => word.isCorrect).length;
        const incorrectCount = totalWords - correctCount;
      
        const correctChars = completedWords.reduce((acc, word) => {
          return acc + [...word.typedWord].filter((char, i) => char === word.targetWord[i]).length;
        }, 0);
      
        const totalTypedChars = completedWords.reduce((acc, word) => acc + word.typedWord.length, 0);
        const totalBackspaces = completedWords.reduce((acc, word) => acc + word.backspaceCount, 0);
      
        const accuracyCalc = correctChars / (totalTypedChars + totalBackspaces);
      
        setCorrectWords(correctCount);
        setIncorrectWords(incorrectCount);
        setWpm(correctCount); // you can later refine WPM if needed
        setAccuracy(Math.round(accuracyCalc * 100));
    }

    return (
        <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Test Results</h2>
          <div className="flex flex-col gap-2">
            {/* <p>Total Words: <span className="font-bold">{totalWords}</span></p> */}
            <p>Correct Words: <span className="font-bold">{correctWords}</span></p>
            <p>Incorrect Words: <span className="font-bold">{incorrectWords}</span></p>
            <p>Words Per Minute (WPM): <span className="font-bold">{wpm}</span></p>
            <p>Accuracy: <span className="font-bold">{accuracy}%</span></p>
          </div>
        </div>
      );
}

export default ResultScreen;