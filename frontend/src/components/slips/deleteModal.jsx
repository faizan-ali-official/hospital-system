import React from "react";

const DeleteModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  reasonSlip,
  setReasonSlip
}) => {
  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-md">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="mb-5">{message}</p>
        <div className="flex flex-col mb-5 min-w-[14%]">
          <input
            type="text"
            placeholder="Reason for delete slip"
            value={reasonSlip}
            onChange={(e) => setReasonSlip(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded text-white ${
              reasonSlip.length < 5
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
            disabled={reasonSlip.length < 5}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
