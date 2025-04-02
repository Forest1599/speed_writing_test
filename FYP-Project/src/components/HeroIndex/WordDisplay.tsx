import React from 'react'
import CharDisplay from './CharDisplay';
import Cursor from './Cursor';

type WordDisplayProps = {
    word: string;
    wordIndex: number;
    currentWordIndex: number;
    userInput: string;
    completedWords: string[];
}

const WordDisplay: React.FC<WordDisplayProps> = ({
    word, // The actual word string
    wordIndex, // The word index in the whole array
    currentWordIndex, // The word index from the list
    userInput, // The current user inputted word
    completedWords // All of the completed words
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

        {/* Take each word and split it and use a tag for each letter  */}
        {word.split("").map((char: string, charIndex: number) => {
        
        // The actual typed character
        const typedChar = typedWord[charIndex];

        // Used for cursor
        const shouldShowCursor = isCurrentWord  && charIndex === typedWord.length;
        const isLastChar = charIndex === word.length - 1;

        return (
            <CharDisplay
                key={`char-${charIndex}`}
                char={char}
                typedChar={typedChar}
                isCurrent={isCurrentWord}
                isCompleted={isCompleted}
                wasCorrect={wasCorrect}
                isCursor={shouldShowCursor}
                isLastChar={isLastChar}
            />
        );
        })}


        {isCurrentWord && typedWord.length >= word.length && (
        <span className="absolute right-0 top-0 translate-x-[2px]">
            <Cursor />
        </span>
        )}

        
    </div>
    )
}

export default WordDisplay;