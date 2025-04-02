import React from 'react';
import Cursor from './Cursor';

type CharDisplayProps = {
  char: string;
  typedChar?: string;
  isCurrent: boolean;
  isCompleted: boolean;
  wasCorrect: boolean;
  isCursor: boolean;
  isLastChar: boolean;
};

const CharDisplay: React.FC<CharDisplayProps> = ({
  char, // The current character displayed
  typedChar, // The character that was typed or is being typed
  isCurrent, // Is it the current character that the user is on
  isCompleted, // Has it been completed already
  wasCorrect, // Was it correct
  isCursor,
}) => {
  let className = "text-gray-400";

  // Determine the character colour
  if (isCurrent) {

    if (typedChar === undefined) {
        className = "text-gray-400"; // Not written yet
    }else if (typedChar === char) {
        className = "text-white"; // Written correctly
    }else {
        className = "text-red-500"; // Written incorrectly
    }  

  } else if (isCompleted) {

    // If the word was correct it will stay white
    if (wasCorrect) {
      className = "text-white";

    // If the word was written incorrect leave it was red or white depedning on the letter
    } else {
      className = typedChar === char ? "text-white" : "text-red-500";
    }
  }

  return (
    // Maybe make the cursor smooth 
    
        <span className="relative inline-block text-center">
            {isCursor && (
                <span className="absolute left-0 top-0 -translate-x-[3px]">
                    <Cursor/>
                </span>
            )}
            <span className={className}>{char}</span>

        </span>
    )
};


export default CharDisplay;