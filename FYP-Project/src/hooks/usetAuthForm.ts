// useAuthForm.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants/constants';
import api from '../components/api/api';

export const useAuthForm = (route: string, method: string) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

    // Handles the submit of the form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await api.post(route, { username, password });
            
            // Handles logic for login
            if (method === 'login') {
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            navigate('/');

            } else {
            localStorage.setItem('successMessage', 'Account created successfully! Please log in.');
            navigate('/login');
            }

        } catch (err: any) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    // maybe move this elsewhere
    const handleApiError = (error : any): string => {
        let errorMessage = "";

        if (error.response) {
            try {
                const responseData = JSON.parse(error.request.responseText);
                
                if (responseData.detail) {
                    errorMessage = responseData.detail; 
                } else if (typeof responseData === "object") {
                    const firstKey = Object.keys(responseData)[0];
                    errorMessage = responseData[firstKey][0];
                } else {
                    errorMessage = "An error occurred. Please try again.";
                }
            } catch (parseError) {
                errorMessage = "An unexpected error occurred.";
            }
        } else {
            errorMessage = "Network error. Please try again.";
        }

        return errorMessage;
    }

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  };
};