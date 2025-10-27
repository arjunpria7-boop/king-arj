import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 py-2">
        <i className="fa-solid fa-brain mr-3"></i>
        Rumus Mas ARJ
      </h1>
      <p className="text-slate-400 mt-2 text-lg">Analisis Cerdas untuk Angka Keberuntungan Anda</p>
    </header>
  );
};

export default Header;
