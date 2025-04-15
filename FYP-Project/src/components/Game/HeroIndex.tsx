// // Notes for now
// // THIS IS MORE LIKE A PAGE SO SHOULD MOVE THIS AT SOME POINT


// // TODO maybe make the cursor go smooth throughout the letters
// // Make it so that the first line is written and then when the second line is written change the visible words

// // How efficient are the updates of characters??

// import { useState, useEffect, useRef, useMemo, KeyboardEvent } from "react";
// import Word from "./Word";
// import HiddenInput from "./HiddenInput";
// import Timer from "./Timer";
// import ResultScreen from "./ResultScreen";
// import { fetchWords } from "../api/WordService";
// import { CompletedWord } from "../../types/CompletedWord";


// // TODO Could potentionally split it up in components? maybe
// const HeroIndex = () => {

//   // Constants
//   const MAX_LINES = 3; // Maximum lines the user can see at a given time
//   const WORDS_PER_LINE = 10 // Maximum words per line // Probably need to edit the scale of it on smaller screens
//   const GAME_DURATION = 10 // seconds of game duration

//   // Game State
//   // All of the words received by the API
//   const [words, setWords] = useState([]);

//   // The settings of the generated typing session
//   const [settings, setSettings] = useState<any>(null)

//   // The current user input
//   const [userInput, setUserInput] = useState("");

//   // The current word the user is working on
//   const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);

//   // The current character the user is working on
//   const [charIndex, setCharIndex] = useState<number>(0)

//   // All of the user inputted words
//   const [completedWords, setCompletedWords] = useState<CompletedWord[]>([]);
//   const [backspaceCount, setBackspaceCount] = useState<number>(0);

//   // Visible words to the use at any given time of the test
//   const [currentLine, setCurrentLine] = useState<number>(0);


//   // Timer implementation
//   const [isTestActive, setIsTestActive] = useState(false); // Start/stop flag
//   const [isGameEnded, setIsGameEnded] = useState(false)

//   const [timerKey, setTimerKey] = useState<number>(0); // Dirty way of doing it



//   // Used as a reference to the input box to focus on it later
//   const inputRef = useRef<HTMLInputElement>(null);
  
//   // Fetch words
//   useEffect(() => {
//     const getWords = async () => {
//       try {
//         const data = await fetchWords();
//         setWords(data.words);
//         setSettings(data.settings);
//       } catch (error) {
//         console.error("Error fetching words:", error); // add some error handling here
//       }
//     };

//     getWords();
//   }, []);


//   // DEBUG ONLY
//   // console.log(settings)

//   // Memoized line calculations rerenders when words or currentLine changes
//   // Sets the current visible words 
//   const visibleWords = useMemo(() => {
//     const lines: string[][] = [];
//     for (let i = 0; i < MAX_LINES; i++) {
//       const startIndex = (currentLine + i) * WORDS_PER_LINE;

//       // Gets the 10 words and pushes it into the lines array
//       lines.push(words.slice(startIndex, startIndex + WORDS_PER_LINE));
//     }


//     return lines;
//   }, [words, currentLine]);


//   // Handle keyboard input
//   const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {

//     if (!isTestActive && e.key.length === 1) {
//       setIsTestActive(true);
//     }

//     const currentWord: string = words[currentWordIndex];

//     // Ignore modifier keys except Backspace and Space
//     if (e.key.length > 1 && e.key !== "Backspace" && e.key !== " ") return;

//     switch(e.key) {
//       case "Backspace":
//         handleBackspace();
//         break;
//       case " ":
//         handleSpace(currentWord);
//         e.preventDefault();
//         break;
//       default:
//         handleCharacterInput(e.key, currentWord);
//     }
//   }

//   // Handles when backspace is clicked
//   const handleBackspace = () => {
//     if (charIndex === 0 && currentWordIndex > 0) {

//       // Only allow going back within the current lines
//       const currentLineStart = Math.floor(currentWordIndex / WORDS_PER_LINE) * WORDS_PER_LINE;

//       // If the first character i.e moves to the previous word
//       if (currentWordIndex > currentLineStart) {
//         // Move to the previous word the user inputted
//         const previousInput = completedWords[currentWordIndex - 1];

//         setUserInput(previousInput.typedWord);
//         setCharIndex(previousInput.typedWord.length);
//         setBackspaceCount(previousInput.backspaceCount); // restores the backspace count
//         setCurrentWordIndex(currentWordIndex - 1);

//         // Remove the completed word from the list
//         setCompletedWords(completedWords.slice(0, -1));
//       }

//     } else if (charIndex > 0) { // If not the first character

//       setBackspaceCount((prev) => prev + 1); // adds a backspace

//       setUserInput(userInput.slice(0, -1)); // removes the last char from user Input
//       setCharIndex(charIndex - 1);
//     }
//   }


//   // Handles when space is clicked
//   const handleSpace = (currentWord: string) => {
//     if (charIndex < 1) return; // Do not allow space as first character


//     // Adds a new word to the completedWords
//     setCompletedWords((prev) => [
//       ...prev,
//       {
//         targetWord: words[currentWordIndex],
//         typedWord: userInput,
//         isCorrect: userInput.trim() === currentWord,
//         backspaceCount: backspaceCount
//       }
//     ])

//     // Clear the indexes
//     setUserInput("");
//     setCharIndex(0);
//     setCurrentWordIndex(currentWordIndex + 1);
//     setBackspaceCount(0);

//     if ((currentWordIndex + 1) % WORDS_PER_LINE === 0) { // If we have reached the end of the line
//       handleLineCompletion();
//     }
//   }

//   const handleCharacterInput = (key: string, currentWord: string) => {
//     if (charIndex < currentWord.length) {

//       // increment the inputs for the word
//       setUserInput(userInput + key);
//       setCharIndex(charIndex + 1);
//     }
//   }

//   const handleLineCompletion = () => {
    
//     // This essentially triggers for the visible lines to change
//     setCurrentLine(prev => {
//       const nextLine = prev + 1;
      
//       // Only if it reaches the end (shouldn't happen)
//       if ((nextLine + MAX_LINES) * WORDS_PER_LINE >= words.length) {
//         return prev;
//       }

//       return nextLine;
//     })
//   }
//   // Focus on the input field used main div in the hero section
//   const focusInput = () => {
//     inputRef.current?.focus();
//   }

//   // Runs when the timer finishes
//   const onTimeUp = () => {
//     setIsGameEnded(true);
//     setIsTestActive(false);
//   }

//   const handleReset = () => {
//     setIsTestActive(false);
//     setIsGameEnded(false);
//     setUserInput("");
//     setCompletedWords([]);
//     setCurrentWordIndex(0);
//     setCharIndex(0);
//     setCurrentLine(0);

//     setTimerKey(prev => prev + 1);
//   }

//   return (

//     <section className="">

//       {isGameEnded ? (
//         <ResultScreen completedWords={completedWords}  settings={settings}/>
//       ) : (
//         <>
//         {/* Hidden input tag that will be used for the user input */}
//         <HiddenInput ref={inputRef} onKeyDown={handleKeyPress}/>

//         <div className="text-3xl mt-52 main-text flex flex-wrap" onClick={focusInput}>
//           {/* Loops through the visible word lines */}
//           {visibleWords.map((line: string[], lineIndex: number) => (
//             <div key={lineIndex} className="flex">
//               {/* Loops through the lines word by word */}
//               {line.map((word: string, wordIndex: number) => {
                
//                 // Gets the true word Index
//                 const absoluteWordIndex = (currentLine + lineIndex) * WORDS_PER_LINE + wordIndex;

//                 return (
//                   <Word 
//                   key={`word-${absoluteWordIndex}`}
//                   word={word}
//                   wordIndex={absoluteWordIndex}
//                   currentWordIndex={currentWordIndex}
//                   userInput={userInput}
//                   completedWords={completedWords.map(w => w.typedWord)}/>
//                 )
//             })}
//             </div>
//           ))}

//           </div>
          
//           <div className="mt-5">
//             {/* Timer */}
//             <Timer
//              key={timerKey} // Dirty way of doing it
//              duration={GAME_DURATION}
//              isRunning={isTestActive}
//              onTimeUp={onTimeUp}/>
            
//             {/* Reset button */}
//             <button
//               onClick={handleReset}
//             >
//               Reset
//             </button>
//           </div>
//         </>
//       )}
      
//       {/* Some kind of reset button here */}
//     </section>
//   )
// }

// export default HeroIndex;