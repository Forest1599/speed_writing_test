import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';



type ResetButtonProps = {
    resetGame: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ resetGame }) => {
    return (
        <div className="flex justify-center">
            <button 
                onClick={resetGame}
                className='text-gray-500 hover:text-white transition-colors duration-200'>
                <FontAwesomeIcon icon={faArrowRotateLeft} size="lg"/>
            </button>
        </div>
    );
  };

export default ResetButton