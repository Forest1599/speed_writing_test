import React, { useEffect, useRef, useState } from 'react';
import { CompletedWord } from '../../types/CompletedWord';
import Word from './Word';

type Props = {
  words: string[];
  currentWordIndex: number;
  userInput: string;
  completedWords: CompletedWord[];
  hiddenInputRef: React.RefObject<HTMLInputElement>;
};

const TextTypingArea: React.FC<Props> = ({
  words,
  currentWordIndex,
  userInput,
  completedWords,
  hiddenInputRef,

}) => {

  const wordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scrollLine, setScrollLine] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);

  const focusInput = () => hiddenInputRef.current?.focus();


  useEffect(() => {
    const currentWordEl = wordRefs.current[currentWordIndex];
    if (!currentWordEl) return;

    const currentTop = currentWordEl.offsetTop;

    // Initial line height calculation
    if (lineHeight === 0 && wordRefs.current[0]) {
      setLineHeight(wordRefs.current[0].offsetHeight);
    }

    // Check if we're on a new line
    const previousWordEl = wordRefs.current[currentWordIndex - 1];
    if (previousWordEl && currentTop > previousWordEl.offsetTop) {
      setScrollLine(prev => prev + 1);
    }
  }, [currentWordIndex]);

  return (
    <div className="typing-area overflow-hidden h-[calc(3.1*3rem)]" onClick={focusInput}>
      <div
        className="text-3xl flex flex-wrap transition-transform duration-200"
        style={{
          transform: `translateY(-${scrollLine * lineHeight}px)`,
        }}
      >
        {words.map((word, index) => (
          <div
            ref={el => (wordRefs.current[index] = el)}
            key={index}
            className="whitespace-nowrap" // Prevent words from breaking
          >
            <Word
              word={word}
              wordIndex={index}
              currentWordIndex={currentWordIndex}
              userInput={userInput}
              completedWords={completedWords.map(completed => completed.typedWord)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextTypingArea;