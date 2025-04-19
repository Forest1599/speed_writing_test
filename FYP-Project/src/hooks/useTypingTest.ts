import useWordProvider from './useWordProvider';
import useTypingSession from './useTypingSession';
import useTypingTimer from './useTypingTimer';
import { GameState } from '../types/GameState';
import { useState, useCallback, useEffect } from 'react';


const useTypingTest = (options: {
  gameDuration: number;
  mode: "random" | "adaptive"
}) => {

    // The main state of the game
    const [gameState, setGameState ] = useState<GameState>(GameState.Idle);
    const { words, settings, isLoading, error, fetchNewWords } = useWordProvider(options.mode);

    const typingSession = useTypingSession(words);

    const timer = useTypingTimer(options.gameDuration);

    // 3. Game Flow Control
    const startGame = useCallback(() => {
        setGameState(GameState.Running);
        timer.start();
    }, [timer]);

    const endGame = useCallback(() => {
        setGameState(GameState.Ended);
        timer.stop();
    }, [timer]);

    const resetGame = useCallback(() => {
        setGameState(GameState.Idle);

        // Resets the timer and typing session variables
        typingSession.handleReset();
        timer.reset();

        fetchNewWords();
    }, [typingSession, timer]);


    const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        // Start game on first key press
        if (gameState === GameState.Idle && e.key.length === 1) {
            startGame();
        }

        // Delegate to typing session if game is running
        if (gameState === GameState.Running) {
            typingSession.handleKeyPress(e);
        }
    }, [gameState, startGame, typingSession]);

    useEffect(() => {
        // Handle timer completion
        if (timer.timeLeft === 0 && gameState === GameState.Running) {
          endGame();
        }

    }, [timer.timeLeft, gameState, endGame]);


    return {
        ...typingSession,
        ...timer,
        words,
        settings,
        fetchNewWords,
        gameState,

        // Game controls
        handleKeyPress,
        resetGame,
    }
};

export default useTypingTest;