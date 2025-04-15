import { useState, useEffect } from 'react';
import { fetchWords } from '../components/api/WordService';

const useWordProvider = () => {
  const [words, setWords] = useState<string[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNewWords = async () => {
    setIsLoading(true);

    try {
      const data = await fetchWords();
      setWords(data.words);
      setSettings(data.settings);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewWords();
  }, []);

  return {
    words,
    settings,
    isLoading,
    error,
    fetchNewWords
  };
};

export default useWordProvider;