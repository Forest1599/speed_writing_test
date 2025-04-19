import React from "react";

type Props = {
  onCancel: () => void;
  onConfirm: () => void;
};


const ConfirmDeleteModal: React.FC<Props> = ({ 
    onCancel,
    onConfirm
 }) => {
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-[90%] max-w-sm">
          <h3 className="text-xl font-bold text-white mb-4">Are you sure?</h3>
          <p className="text-gray-300 mb-6">This action will permanently delete your account.</p>
  
          <div className="flex justify-center gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-400 text-gray-300 rounded hover:bg-gray-700 transition"
            >
              Cancel
            </button>
  
            <button
              onClick={onConfirm}
              className="px-4 py-2 border border-red-400 text-red-300 rounded hover:bg-red-600 hover:text-white transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
};

export default ConfirmDeleteModal;
