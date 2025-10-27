
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-emerald-500"></div>
      <p className="text-slate-300 mt-4 text-lg font-semibold">AI sedang meracik angka keberuntungan...</p>
    </div>
  );
};

export default LoadingSpinner;
