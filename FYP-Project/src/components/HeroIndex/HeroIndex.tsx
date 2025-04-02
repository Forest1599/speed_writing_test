// Notes for now

// TODO maybe make the cursor go smooth throughout the letters
// Make it so that the first line is written and then when the second line is written change the visible words

// How efficient are the updates of characters??

import { useState, useEffect, useRef, useMemo, KeyboardEvent } from "react";
import WordDisplay from "./WordDisplay";
import HiddenInput from "./HiddenInput";
import Timer from "./Timer";

// TODO Could potentionally split it up in components? maybe

const HeroIndex = () => {

  // Constants
  const MAX_LINES = 3; // Maximum lines the user can see at a given time
  const WORDS_PER_LINE = 10 // Maximum words per line
  const GAME_DURATION = 10 // seconds of game duration

  // Game State
  // All of the words received by the API
  const [words, setWords] = useState([]);

  // The current user input
  const [userInput, setUserInput] = useState("");

  // The current word the user is working on
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);

  // The current character the user is working on
  const [charIndex, setCharIndex] = useState<number>(0)

  // All of the user inputted words
  const [completedWords, setCompletedWords] = useState<string[]>([]);

  // Visible words to the use at any given time of the test
  const [currentLine, setCurrentLine] = useState<number>(0);


  // Timer implementation
  const [isTestActive, setIsTestActive] = useState(false); // Start/stop flag
  const [isGameEnded, setIsGameEnded] = useState(false)

  // Result Stats
  const [correctWords, setCorrectWords] = useState<number>(0);
  const [incorrectWords, setIncorrectWords] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);

  // Used as a reference to the input box to focus on it later
  const inputRef = useRef<HTMLInputElement>(null);
  

  // Fetch words
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/test/')
      .then(response => response.json())
      .then(data => setWords(data.words))
      .catch(error => console.error("Error fetching words:", error));
  }, []);

  // Memoized line calculations rerenders when words or currentLine changes
  // Sets the current visible words 
  const visibleWords = useMemo(() => {
    const lines: string[][] = [];
    for (let i = 0; i < MAX_LINES; i++) {
      const startIndex = (currentLine + i) * WORDS_PER_LINE;

      // Gets the 10 words and pushes it into the lines array
      lines.push(words.slice(startIndex, startIndex + WORDS_PER_LINE));
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
      const currentLineStart = Math.floor(currentWordIndex / WORDS_PER_LINE) * WORDS_PER_LINE;

      if (currentWordIndex > currentLineStart) {
        // Move to the previous word the user inputted
        const previousInput = completedWords[currentWordIndex - 1];
        setUserInput(previousInput);
        setCharIndex(previousInput.length);
        setCurrentWordIndex(currentWordIndex - 1);

        // Remove the completed word from the list
        setCompletedWords(completedWords.slice(0, -1));
      }

    } else if (charIndex > 0) { // If not the first character
      setUserInput(userInput.slice(0, -1)); // removes the last char from user Input
      setCharIndex(charIndex - 1);
    }
  }

  // Handles when space is clicked
  const handleSpace = (currentWord: string) => {
    if (charIndex < 1) return; // Do not allow space as first character

    // Checks if the word is correct 
    if (userInput.trim() === currentWord) {
      console.log(`Word correct: ${userInput}`);
    } else {
      console.log(`Word incorrect: ${userInput}`)
    }

    // Clear the indexes
    setUserInput("");
    setCharIndex(0);
    setCurrentWordIndex(currentWordIndex + 1);

    // Copies the completed words
    setCompletedWords([...completedWords, userInput])

    if ((currentWordIndex + 1) % WORDS_PER_LINE === 0) { // If we have reached the end of the line
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
      if ((nextLine + MAX_LINES) * WORDS_PER_LINE >= words.length) {
        return prev;
      }

      return nextLine;
    })
  }
  // Focus on the input field used main div in the hero section
  const focusInput = () => {
    inputRef.current?.focus();
  }

  const onTimeUp = () => {
    console.log("Time is up!")
    setIsGameEnded(true);
    calculateResults();
  }

  const calculateResults = () => {
    const totalWords = completedWords.length;
    const correctCount = completedWords.filter(
      (word : string, index: number) => word === words[index]).length
    
    const incorrectCount = totalWords - correctCount;
    const totalChars = completedWords.join("").length;

    const correctChars = completedWords.reduce((acc, word, index) => {
      return acc + [...word].filter((char, charIndex) => char === words[index][charIndex]).length;
    }, 0);

    setCorrectWords(correctCount);
    setIncorrectWords(incorrectCount);
    setWpm(correctCount);
    setAccuracy(Math.round((correctChars/ totalChars) * 100))
  }

  return (

    <section className="">

      {/* Hidden input tag that will be used for the user input */}
      <HiddenInput ref={inputRef} onKeyDown={handleKeyPress}/>


      

      {/* Timer */}
      <Timer duration={GAME_DURATION} isRunning={isTestActive} onTimeUp={onTimeUp}/>

      {/* Some kind of reset button here */}
    </section>


  )
}

export default HeroIndex;