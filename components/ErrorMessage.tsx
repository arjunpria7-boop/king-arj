
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative text-center" role="alert">
      <strong className="font-bold mr-2"><i className="fa-solid fa-circle-exclamation"></i> Terjadi Kesalahan!</strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default ErrorMessage;
