import React from 'react';
import Word from './Word';

type TextTypingAreaProps = {
  visibleWords: string[][];
  currentWordIndex: number;
  userInput: string;
  completedWords: string[];
  currentLine: number;
  wordsPerLine: number;
  hiddenInputAreaRef: React.RefObject<HTMLInputElement>;
};


const TextTypingArea: React.FC<TextTypingAreaProps> = ({
  visibleWords,
  currentWordIndex,
  userInput,
  completedWords,
  currentLine,
  wordsPerLine,
  hiddenInputAreaRef
}) => {

    const focusInput = () => {
        hiddenInputAreaRef.current?.focus();  
    }

    return (
        <div className="text-3xl main-text flex flex-wrap" onClick={focusInput}>
            {visibleWords.map((line: string[], lineIndex: number) => (

            <div key={lineIndex} className="flex">
                {line.map((word: string, wordIndex: number) => {

                const absoluteWordIndex = (currentLine + lineIndex) * wordsPerLine + wordIndex;
                
                return (
                    <Word 
                    key={`word-${absoluteWordIndex}`}
                    word={word}
                    wordIndex={absoluteWordIndex}
                    currentWordIndex={currentWordIndex}
                    userInput={userInput}
                    completedWords={completedWords}
                    />
                );
                })}
            </div>
            ))}
        </div>
        );
    };

export default TextTypingArea;