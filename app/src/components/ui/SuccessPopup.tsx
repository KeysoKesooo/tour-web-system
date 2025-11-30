import React, { useEffect, useState } from "react";

interface SuccessPopupProps {
  message: string;
  onClose: () => void;
  autoCloseMs?: number; // optional auto-close duration
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({
  message,
  onClose,
  autoCloseMs = 3000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      // start fade-out
      setVisible(false);
      // close completely after transition duration
      setTimeout(onClose, 500);
    }, autoCloseMs);

    return () => clearTimeout(timer);
  }, [autoCloseMs, onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className={`bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded shadow-lg max-w-sm text-center transform transition-all duration-500 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <p>{message}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;
