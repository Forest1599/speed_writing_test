import { useState, useEffect, useMemo, KeyboardEvent } from 'react';
import { fetchWords } from '../components/api/WordService';
import { CompletedWord } from '../types/CompletedWord';

const useTypingTest = (options: {
    maxLines: number;
    wordsPerLine: number;
    gameDuration: number;
  }) => {

  // All of the words received by the API
  const [words, setWords] = useState([]);

  // The settings of the generated typing session
  const [settings, setSettings] = useState<any>(null)

  // The current user input
  const [userInput, setUserInput] = useState("");

  // The current word the user is working on
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);

  // The current character the user is working on
  const [charIndex, setCharIndex] = useState<number>(0)

  // All of the user inputted words
  const [completedWords, setCompletedWords] = useState<CompletedWord[]>([]);
  const [backspaceCount, setBackspaceCount] = useState<number>(0);

  // Visible words to the use at any given time of the test
  const [currentLine, setCurrentLine] = useState<number>(0);


  // Timer implementation
  const [isTestActive, setIsTestActive] = useState(false); // Start/stop flag
  const [isGameEnded, setIsGameEnded] = useState(false)

//   const [timerKey, setTimerKey] = useState<number>(0); // Dirty way of doing it

  
  // Fetch words
  useEffect(() => {
    const getWords = async () => {
      try {
        const data = await fetchWords();
        setWords(data.words);
        setSettings(data.settings);
      } catch (error) {
        console.error("Error fetching words:", error); // add some error handling here
      }
    };

    getWords();
  }, []);


  // DEBUG ONLY
  // console.log(settings)

  // Memoized line calculations rerenders when words or currentLine changes
  // Sets the current visible words 
  const visibleWords = useMemo(() => {
    const lines: string[][] = [];
    for (let i = 0; i < options.maxLines; i++) {
      const startIndex = (currentLine + i) * options.wordsPerLine;

      // Gets the 10 words and pushes it into the lines array
      lines.push(words.slice(startIndex, startIndex + options.wordsPerLine));
    }


    return lines;
  }, [words, currentLine]);


  // Handle keyboard input
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {

    if (!isTestActive && e.key.length === 1) {
      setIsTestActive(true);
    }

    const currentWord: string = words[currentWordIndex];

    // Ignore modifier keys except Backspace and Space
    if (e.key.length > 1 && e.key !== "Backspace" && e.key !== " ") return;

    switch(e.key) {
      case "Backspace":
        handleBackspace();
        break;
      case " ":
        handleSpace(currentWord);
        e.preventDefault();
        break;
      default:
        handleCharacterInput(e.key, currentWord);
    }
  }

  // Handles when backspace is clicked
  const handleBackspace = () => {
    if (charIndex === 0 && currentWordIndex > 0) {

      // Only allow going back within the current lines
      const currentLineStart = Math.floor(currentWordIndex / options.wordsPerLine) * options.wordsPerLine;

      // If the first character i.e moves to the previous word
      if (currentWordIndex > currentLineStart) {
        // Move to the previous word the user inputted
        const previousInput = completedWords[currentWordIndex - 1];

        setUserInput(previousInput.typedWord);
        setCharIndex(previousInput.typedWord.length);
        setBackspaceCount(previousInput.backspaceCount); // restores the backspace count
        setCurrentWordIndex(currentWordIndex - 1);

        // Remove the completed word from the list
        setCompletedWords(completedWords.slice(0, -1));
      }

    } else if (charIndex > 0) { // If not the first character

      setBackspaceCount((prev) => prev + 1); // adds a backspace

      setUserInput(userInput.slice(0, -1)); // removes the last char from user Input
      setCharIndex(charIndex - 1);
    }
  }


  // Handles when space is clicked
  const handleSpace = (currentWord: string) => {
    if (charIndex < 1) return; // Do not allow space as first character

    // Adds a new word to the completedWords
    setCompletedWords((prev) => [
      ...prev,
      {
        targetWord: words[currentWordIndex],
        typedWord: userInput,
        isCorrect: userInput.trim() === currentWord,
        backspaceCount: backspaceCount
      }
    ])

    // Clear the indexes
    setUserInput("");
    setCharIndex(0);
    setCurrentWordIndex(currentWordIndex + 1);
    setBackspaceCount(0);

    if ((currentWordIndex + 1) % options.wordsPerLine === 0) { // If we have reached the end of the line
      handleLineCompletion();
    }
  }

  const handleCharacterInput = (key: string, currentWord: string) => {
    if (charIndex < currentWord.length) {

      // increment the inputs for the word
      setUserInput(userInput + key);
      setCharIndex(charIndex + 1);
    }
  }

  const handleLineCompletion = () => {
    
    // This essentially triggers for the visible lines to change
    setCurrentLine(prev => {
      const nextLine = prev + 1;
      
      // Only if it reaches the end (shouldn't happen)
      if ((nextLine + options.maxLines) * options.wordsPerLine >= words.length) {
        return prev;
      }

      return nextLine;
    })
  }

  // Runs when the timer finishes
  const onTimeUp = () => {
    setIsGameEnded(true);
    setIsTestActive(false);
  }

  const handleReset = () => {
    setIsTestActive(false);
    setIsGameEnded(false);
    setUserInput("");
    setCompletedWords([]);
    setCurrentWordIndex(0);
    setCharIndex(0);
    setCurrentLine(0);

    // setTimerKey(prev => prev + 1);
  }

  return {
    visibleWords,
    userInput,
    currentWordIndex,
    completedWords,
    isTestActive,
    isGameEnded,
    settings,
    handleKeyPress,
    handleReset,
    onTimeUp,
    currentLine,
    // timerKey,
  };
}
  
export default useTypingTest;
