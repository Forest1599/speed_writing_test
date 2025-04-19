import React from 'react';

interface Props {
  onLogout: () => void;
  onDelete: () => void;
}

const StatButtonGroup: React.FC<Props> = ({ onLogout, onDelete }) => {
  return (
    <div className="flex justify-center mt-6 mb-4 gap-4">
      <button 
        className="px-4 py-2 border border-gray-400 text-gray-300 rounded hover:bg-gray-700 transition-colors duration-200"
        onClick={onLogout}>
        Logout
      </button>

      <button 
        className="px-4 py-2 border border-red-400 text-red-300 rounded hover:bg-red-600 hover:text-white transition-colors duration-200"
        onClick={onDelete}>
        Delete Account
      </button>
    </div>
  );
};

export default StatButtonGroup;