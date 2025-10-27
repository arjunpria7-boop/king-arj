import React from 'react';

const BrowserSupportWarning: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center text-center p-6">
      <div className="max-w-md">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-amber-400 mb-6"></i>
        <h1 className="text-3xl font-bold mb-4">Browser Anda Tidak Didukung</h1>
        <p className="text-slate-300 mb-6">
          Aplikasi ini menggunakan teknologi web modern yang tidak tersedia di browser Anda.
          Untuk pengalaman terbaik, silakan perbarui ke versi terbaru dari browser modern seperti:
        </p>
        <div className="flex justify-center items-center gap-6 text-4xl text-slate-400">
          <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer" aria-label="Download Google Chrome" title="Google Chrome" className="hover:text-emerald-400 transition-colors">
            <i className="fa-brands fa-chrome"></i>
          </a>
          <a href="https://www.mozilla.org/firefox/new/" target="_blank" rel="noopener noreferrer" aria-label="Download Mozilla Firefox" title="Mozilla Firefox" className="hover:text-emerald-400 transition-colors">
            <i className="fa-brands fa-firefox"></i>
          </a>
           <a href="https://www.microsoft.com/edge" target="_blank" rel="noopener noreferrer" aria-label="Download Microsoft Edge" title="Microsoft Edge" className="hover:text-emerald-400 transition-colors">
            <i className="fa-brands fa-edge"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default BrowserSupportWarning;
