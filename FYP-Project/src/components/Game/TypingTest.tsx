import { useRef } from 'react';
import useTypingTest from '../../hooks/useTypingTest';
import HiddenInput from './HiddenInput';
import Timer from './Timer';
import ResultScreen from './ResultScreen';
import TextTypingArea from './TextTypingArea';

import ResetButton from './ResetButton';
import { GameState } from '../../types/GameState';

type TypingTestProps = {
  mode: 'random' | 'adaptive'
}

const TypingTest: React.FC<TypingTestProps> = ({mode}) => {
  const gameOptions = {
    gameDuration: 10,
    mode: mode,
  };

  const {
    userInput,
    completedWords,
    handleKeyPress,
    timeLeft,       
    settings,
    gameState,
    resetGame,
    currentWordIndex,
    words
  } = useTypingTest(gameOptions);

  const inputRef = useRef<HTMLInputElement>(null);


  if (gameState === GameState.Ended) {
    return (
        <>
            <div className='mt-10'>
              <ResetButton resetGame={resetGame}/>
            </div>

            <ResultScreen completedWords={completedWords} settings={settings} />

        </>
    )
  }

  return (
    <section className="">
      <HiddenInput ref={inputRef} onKeyDown={handleKeyPress} />
       
      <div className='mt-44'>

        <h2 className="text-center text-4xl font-semibold text-gray-700 mb-8">
          {mode === 'random' ? 'Randomized Word Test' : 'Adapted Word Test'}
        </h2>

        <Timer
            duration={gameOptions.gameDuration}
            timeLeft={timeLeft}
        />

        <TextTypingArea
            words={words}
            currentWordIndex={currentWordIndex}

            userInput={userInput}
            completedWords={completedWords}
            hiddenInputRef={inputRef}
        />
      </div> 
      
      <div className="mt-5 ">
        <ResetButton resetGame={resetGame}/>
      </div>

    </section>
  );
};

export default TypingTest;