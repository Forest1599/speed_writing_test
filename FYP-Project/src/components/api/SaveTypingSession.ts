import { CompletedWord } from "../../types/CompletedWord";
import api from "./api";


// Saves typing session information
const SaveTypingSession = async (
  wpm: number,
  accuracy: number,
  minWordLength: number,
  maxWordLength: number,
  frequencyRank: number,
  mode: string,
  wordsToStore: CompletedWord[],
) => {
  try {

    // Used so it is interpreted by Django
    const payloadWords = wordsToStore.map(word => ({
      target_word: word.targetWord,
      typed_word: word.typedWord,
      is_correct: word.isCorrect,
      backspace_count: word.backspaceCount,
    }));

    const response = await api.post("/api/typing-sessions/", {
      wpm,
      accuracy,
      min_word_length: minWordLength,
      max_word_length: maxWordLength,
      frequency_rank: frequencyRank,
      word_performances: payloadWords,
      mode: mode
    });

    console.log("Session saved:", response.data); // DEBUG ONLY
  } catch (error) {
    console.error("Error saving session:", error); // Need to add some sort of error handling
  }
};

export default SaveTypingSession;