import { useRef } from 'react';
import useTypingTestB from '../../hooks/useTypingTestB';
import HiddenInput from './HiddenInput';
import Timer from './Timer';
import ResultScreen from './ResultScreen';
import TextTypingArea from './TextTypingArea';
import ResetButton from './ResetButton';
import { GameState } from '../../types/GameState';


const TypingTest = () => {
  const gameOptions = {
    maxLines: 3,
    wordsPerLine: 10,
    gameDuration: 10,
  };

  const {
    visibleWords,
    userInput,
    currentWordIndex,
    completedWords,
    handleKeyPress,
    currentLine,
    timeLeft,       // use this if needed when you fully reset the test
    settings,
    gameState,
    resetGame,
  } = useTypingTestB(gameOptions);

  const inputRef = useRef<HTMLInputElement>(null);

  if (gameState === GameState.Ended) {
    return (
        <>
            <ResultScreen completedWords={completedWords} settings={settings} />
            <ResetButton resetGame={resetGame}/>
        </>
    )
  }

  return (
    <section className="">
      <HiddenInput ref={inputRef} onKeyDown={handleKeyPress} />
       
      <div className='mt-52'>
        <Timer
            duration={gameOptions.gameDuration}
            timeLeft={timeLeft}
        />

        <TextTypingArea
            visibleWords={visibleWords}
            currentWordIndex={currentWordIndex}
            userInput={userInput}
            completedWords={completedWords.map(w => w.typedWord)}
            currentLine={currentLine}
            wordsPerLine={gameOptions.wordsPerLine}
            hiddenInputAreaRef={inputRef}
        />
      </div> 
      
      <div className="mt-5 ">
        <ResetButton resetGame={resetGame}/>
      </div>

    </section>
  );
};

export default TypingTest;