import { CompletedWord } from "../types/CompletedWord";

export const selectWordsToStore = (completedWords: CompletedWord[]): CompletedWord[] => {
  const incorrectWords = completedWords.filter(word => !word.isCorrect);

  const sortedIncorrect = incorrectWords.sort(
    (a, b) => b.backspaceCount - a.backspaceCount
  );

  if (sortedIncorrect.length >= 5) {
    return sortedIncorrect.slice(0, 5);
  }

  const remaining = 5 - sortedIncorrect.length;

  const remainingWords = completedWords
    .filter(word => word.isCorrect && !sortedIncorrect.includes(word))
    .sort((a, b) => b.backspaceCount - a.backspaceCount)
    .slice(0, remaining);

  return [...sortedIncorrect, ...remainingWords];
};