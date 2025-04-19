import React from 'react'
import Char from './Char';
import Cursor from './Cursor';

type WordProps = {
    word: string;  // The actual word string
    wordIndex: number; // The word index in the whole array
    currentWordIndex: number; // The word index from the list
    userInput: string; // The current user inputted word
    completedWords: string[]; // All of the completed words
}

const Word: React.FC<WordProps> = ({
    word,
    wordIndex, 
    currentWordIndex,
    userInput,
    completedWords
  }) => {
    
    // Is this the word the user is currently typing?
    const isCurrentWord = wordIndex === currentWordIndex;

    // Is this word completed already before
    const isCompleted = wordIndex < currentWordIndex;

    // Is the word typed already, if so get the typed word so we can compare it
    const typedWord = isCompleted ? completedWords[wordIndex] || "" : userInput;
    
    // If the word was correct previously
    const wasCorrect = typedWord === word;


    return (
        <div key={wordIndex} className="relative m-2 flex gap-[2px]">
        
            {/* Maybe memoization */}
            {/* Take each word and split it and use a tag for each letter  */}
            {word.split("").map((char: string, charIndex: number) => {
            
            // The actual typed character
            const typedChar = typedWord[charIndex];

            // Used for cursor after the letter
            const shouldShowCursor = isCurrentWord  && charIndex === typedWord.length;

            return (
                <Char
                    key={`char-${charIndex}`}
                    char={char}
                    typedChar={typedChar}
                    isCurrent={isCurrentWord}
                    isCompleted={isCompleted}
                    wasCorrect={wasCorrect}
                    shouldShowCursor={shouldShowCursor}
                />
            );
            })}

            {/* Display cursor after the word once enough chars are typed */}
            {isCurrentWord && typedWord.length === word.length && (
            <span className="absolute right-0 top-0 translate-x-[2px]">
                <Cursor />
            </span>
            )}

        
        </div>
    )
}

export default Word;