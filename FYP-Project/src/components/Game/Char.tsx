import React from 'react';
import Cursor from './Cursor';

type CharProps = {
  char: string; // The current character displayed
  typedChar?: string; // The character that was typed or is being typed
  isCurrent: boolean; // Is it the current character that the user is on
  isCompleted: boolean; // Has it been completed already
  wasCorrect: boolean; // Was it correct
  shouldShowCursor: boolean;
}

const getCharClassName = (
  char: string,
  typedChar?: string,
  isCurrent?: boolean,
  isCompleted?: boolean,
  wasCorrect?: boolean
) => {

  if (isCurrent) {
    if (typedChar === undefined) return 'text-gray-400'; // Not Written Yet
    return typedChar === char ? 'text-white' : 'text-red-500'; // Written Correctly?
  }

  // Was the word correct or incorrect
  if (isCompleted) {
    return wasCorrect ? 'text-white' : typedChar === char ? 'text-white' : 'text-red-500';
  }

  // Default
  return 'text-gray-400';
}

const Char: React.FC<CharProps> = ({
  char,
  typedChar, 
  isCurrent, 
  isCompleted, 
  wasCorrect, 
  shouldShowCursor,
}) => {

  const className = getCharClassName(char, typedChar, isCurrent, isCompleted, wasCorrect);

  return (
    
        <span className="relative inline-block text-center">
            {shouldShowCursor && (
                <span className="absolute left-0 top-0 -translate-x-[3px]">
                    <Cursor/>
                </span>
            )}
            <span className={className}>{char}</span>

        </span>
    )
};


export default Char;