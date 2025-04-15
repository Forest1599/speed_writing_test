import React from 'react'

type FormMessageProps = {
    type: "error" | "success";
    message: string | null;
}

export const FormMessage: React.FC<FormMessageProps> = ({ type, message }) => {
    if (!message) return null;
  
    const styles = {
      error: 'text-red-500 bg-red-100',
      success: 'text-green-500 bg-green-100',
    };
  
    return (
      <div className={`mb-4 p-2 rounded text-center ${styles[type]}`}>
        {message}
      </div>
    );
  };
