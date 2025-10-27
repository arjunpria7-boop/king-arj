import React, { useState } from 'react';
import type { PredictionResult } from '../types';

interface PredictionDisplayProps {
  result: PredictionResult;
  market: string;
}

const PredictionCategory: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
    <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">{title}</h3>
    <div className="text-2xl font-bold text-white tracking-widest">
      {children}
    </div>
  </div>
);

const NumberGrid: React.FC<{ numbers: string[] }> = ({ numbers }) => (
  <div className="flex flex-wrap justify-center gap-2">
    {numbers.map((num, index) => (
      <span key={index} className="bg-slate-900 text-white font-semibold px-3 py-1 rounded-md text-base">
        {num}
      </span>
    ))}
  </div>
);

// Function to generate a unique, vibrant color from a string
const generateMarketColor = (marketName: string): string => {
  let hash = 0;
  for (let i = 0; i < marketName.length; i++) {
    hash = marketName.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 85%, 65%)`; // Use HSL for vibrant, consistent colors
};


const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ result, market }) => {
  const [isCopied, setIsCopied] = useState(false);
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('id-ID', options).format(today);
  
  const marketColor = generateMarketColor(market);

  // Helper functions for special text formatting
  const formatMarketName = (name: string): string => {
    const map: { [key: string]: string } = {
        'A':'𝗔','B':'𝗕','C':'𝗖','D':'𝗗','E':'𝗘','F':'𝗙','G':'𝗚','H':'𝗛','I':'𝗜','J':'𝗝','K':'𝗞','L':'𝗟','M':'𝗠',
        'N':'𝗡','O':'𝗢','P':'𝗣','Q':'𝗤','R':'𝗥','S':'𝗦','T':'𝗧','U':'𝗨','V':'𝗩','W':'𝗪','X':'𝗫','Y':'𝗬','Z':'𝗭', ' ':' ',
        '0':'𝟬', '1':'𝟭', '2':'𝟮', '3':'𝟯', '4':'𝟰', '5':'𝟱', '6':'𝟲', '7':'𝟳', '8':'𝟴', '9':'𝟵'
    };
    return name.toUpperCase().split('').map(char => map[char] || char).join('');
  };

  const formatSpecialDate = (date: Date): string => {
      const day = date.getDate().toString();
      const year = date.getFullYear().toString();
      const month = new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(date).toLowerCase();
      
      const digitMap: { [key: string]: string } = {
          '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺',
          '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿'
      };

      const formatNumber = (n: string) => n.split('').map(char => digitMap[char] || char).join('');

      return `${formatNumber(day)} ${month} ${formatNumber(year)}`;
  };
  
  const specialFormattedDate = formatSpecialDate(today);

  const textToCopy = `${formatMarketName(market)}
${specialFormattedDate}

𝘼𝙄 : ${result.ai}
𝘾𝙉 : ${result.cn}
𝘾𝘽 : ${result.cb}
𝘽𝘽𝙁𝙎 : ${result.bbfs}
4𝘿𝙗𝙗 : ${result.bb4d.join(' * ')}
3𝘿𝙗𝙗 : ${result.bb3d.join(' * ')}
2𝘿 : ${result.bb2d.join(' * ')}
𝚌𝚊𝚍𝚊𝚗𝚐𝚊𝚗 : ${result.bb2dCadangan.join(' * ')}

ʲᵃᵈⁱᵏᵃⁿ ᵖᵉʳᵇᵃⁿᵈⁱⁿᵍᵃⁿ- ᵗⁱᵈᵃᵏ ᵃᵈᵃ ʲᵃᵐⁱⁿᵃⁿ ᴶᴾ ¹⁰⁰%

Salam dari 𝗠𝗮𝘀 𝗔𝗥𝗝`;

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700 animate-fade-in">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        <span style={{ color: marketColor }} className="font-extrabold tracking-wider uppercase">
            {market}
        </span>
        <span className="block text-slate-400 text-sm font-normal mt-1">
            {formattedDate}
        </span>
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <PredictionCategory title="AI">{result.ai}</PredictionCategory>
        <PredictionCategory title="CB">{result.cb}</PredictionCategory>
        <PredictionCategory title="CN">{result.cn}</PredictionCategory>
        <PredictionCategory title="BBFS">{result.bbfs}</PredictionCategory>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
           <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">4D BB</h3>
           <NumberGrid numbers={result.bb4d} />
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
           <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">3D BB</h3>
           <NumberGrid numbers={result.bb3d} />
        </div>
         <div className="bg-slate-700/50 rounded-lg p-4 text-center">
           <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">2D</h3>
           <NumberGrid numbers={result.bb2d} />
           {result.bb2dCadangan && result.bb2dCadangan.length > 0 && (
            <>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-4 mb-2 pt-3 border-t border-slate-600">
                Cadangan
              </h4>
              <NumberGrid numbers={result.bb2dCadangan} />
            </>
           )}
        </div>
      </div>
      
      <div className="mt-6 relative bg-slate-700/50 p-4 rounded-lg text-slate-300 whitespace-pre-wrap font-mono">
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 bg-slate-600 hover:bg-emerald-500 text-white font-semibold py-1 px-3 rounded-md text-xs transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          aria-label="Salin prediksi"
        >
          {isCopied ? (
            <>
              <i className="fa-solid fa-check"></i>
              Tersalin!
            </>
          ) : (
            <>
              <i className="fa-regular fa-copy"></i>
              Salin
            </>
          )}
        </button>

        <p className="text-sm sm:text-base leading-relaxed mr-16 sm:mr-0">
          {formatMarketName(market)}
          <br />
          {specialFormattedDate}
          <br />
          <br />
          𝘼𝙄 : {result.ai}
          <br />
          𝘾𝙉 : {result.cn}
          <br />
          𝘾𝘽 : {result.cb}
          <br />
          𝘽𝘽𝙁𝙎 : {result.bbfs}
          <br />
          4𝘿𝙗𝙗 : {result.bb4d.join(' * ')}
          <br />
          3𝘿𝙗𝙗 : {result.bb3d.join(' * ')}
          <br />
          2𝘿 : {result.bb2d.join(' * ')}
          <br />
          𝚌𝚊𝚍𝚊𝚗𝚐𝚊𝚗 : {result.bb2dCadangan.join(' * ')}
          <br />
          <br />
          ʲᵃᵈⁱᵏᵃⁿ ᵖᵉʳᵇᵃⁿᵈⁱⁿᵍᵃⁿ- ᵗⁱᵈᵃᵏ ᵃᵈᵃ ʲᵃᵐⁱⁿᵃⁿ ᴶᴾ ¹⁰⁰%
          <br />
          <br />
          <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            Salam dari 𝗠𝗮𝘀 𝗔𝗥𝗝
          </span>
        </p>
      </div>

       <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PredictionDisplay;