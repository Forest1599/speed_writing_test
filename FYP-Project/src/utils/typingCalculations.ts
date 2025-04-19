import { CompletedWord } from "../types/CompletedWord";

export interface TypingResults {
  correctWords: number;
  incorrectWords: number;
  wpm: number;
  accuracy: number;
  correctChars: number;
  totalTypedChars: number;
  totalBackspaces: number;
}

export const calculateTypingResults = (completedWords: CompletedWord[]): TypingResults => {
  const totalWords = completedWords.length;
  const correctCount = completedWords.filter(word => word.isCorrect).length;
  const incorrectCount = totalWords - correctCount;

  const correctChars = completedWords.reduce((acc, word) => {
    return acc + [...word.typedWord].filter((char, i) => char === word.targetWord[i]).length;
  }, 0);

  const totalTypedChars = completedWords.reduce((acc, word) => acc + word.typedWord.length, 0);
  const totalBackspaces = completedWords.reduce((acc, word) => acc + word.backspaceCount, 0);

  const accuracy = correctChars / (totalTypedChars + totalBackspaces);

  return {
    correctWords: correctCount,
    incorrectWords: incorrectCount,
    wpm: correctCount, // You can refine WPM calculation later
    accuracy: Math.round(accuracy * 100),
    correctChars,
    totalTypedChars,
    totalBackspaces
  };
};

