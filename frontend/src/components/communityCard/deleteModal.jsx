import React from "react";

const DeleteModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-sm shadow-md border border-slate-200 dark:border-slate-600">
        <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">{title}</h2>
        <p className="mb-6 text-slate-700 dark:text-slate-300">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 dark:bg-slate-600 text-gray-800 dark:text-slate-200 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-slate-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded hover:bg-red-600 dark:hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
