import React from 'react';
import HistoryInput from './HistoryInput';

interface ControlPanelProps {
  market: string;
  setMarket: (market: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  lastResult: string[];
  onLastResultChange: (value: string[]) => void;
}

const MARKETS: string[] = [
  "HONGKONG", "CAMBODIA", "CHINA", "SINGAPORE", "SYDNEY", "TAIWAN", 
  "TOTO MACAU 00", "TOTO MACAU 13", "TOTO MACAU 16", "TOTO MACAU 19", "TOTO MACAU 22", "TOTO MACAU 23",
  "SYDNEY LOTTO", "HONGKONG LOTTO", "GERMANI PLUS", "KENTUCY MID", "TEXAS DAY", "NEW YORK MID", 
  "CAROLINA DAY", "CHICAGO LOTTERY", "OREGON 01", "GANGNAM", "BERLIN LOTTERY", "NAMDONG", 
  "TEXAS EVENING", "OREGON 04", "QATAR MORNING", "GWANSAN POOLS", "YORDANIA", "CALIFORNIA", 
  "FLORIDA EVE", "OREGON 07", "SIPRUS MORNING", "NEW YORK EVE", "KENTUKY EVE", "TEXAS NIGHT", 
  "CAROLINA EVENING", "MAGNUM CAMBODIA", "BULLSEYE", "QATAR MIDDAY", "OREGON 10", "FUJI LOTTO", 
  "SIPRUS MIDDAY", "MANILA LOTTERY", "VIETNAM", "CHINA POOLS", "QATAR EVENING", "NANOI LOTERRY", 
  "JAPAN POOLS", "BANGKOK POOL", "SIPRUS EVENING", "GIEYANG POOLS", "MIAMI LOTTERY", 
  "OSAKA LOTTERY", "QATAR NIGHT", "PCSO", "TENNESE", "DUBAI", "SIPRUS NIGHT", "TEXAS MORNING", 
  "GENTING LOTTERY", "ALASKA"
];

const ControlPanel: React.FC<ControlPanelProps> = ({
  market,
  setMarket,
  onGenerate,
  isLoading,
  lastResult,
  onLastResultChange,
}) => {
  
  const handleReset = () => {
    onLastResultChange(['', '', '', '']);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-xs">
          <select
              id="market-select"
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              className="w-full bg-slate-700/80 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none text-center"
              aria-label="Pilih Pasaran"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem',
              }}
          >
              {MARKETS.map(marketName => (
                  <option key={marketName} value={marketName} className="bg-slate-800 text-white">{marketName}</option>
              ))}
          </select>
      </div>

      <div className="w-full flex flex-col items-center gap-3 pt-4">
        <label className="text-slate-400 text-sm">
          Input Hasil 4D Terakhir (Opsional)
        </label>
        <div className="flex items-center gap-2 sm:gap-3">
            <HistoryInput value={lastResult} onChange={onLastResultChange} />
            <button 
                onClick={handleReset}
                className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-slate-700 text-slate-400 rounded-lg transition-colors hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Reset input angka"
                title="Reset"
            >
                <i className="fa-solid fa-rotate-right"></i>
            </button>
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full shadow-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-4"
      >
        {isLoading ? (
          <>
            <i className="fa-solid fa-spinner animate-spin"></i>
            Menganalisis...
          </>
        ) : (
          <>
            <i className="fa-solid fa-bolt"></i>
            Hasilkan Prediksi
          </>
        )}
      </button>
    </div>
  );
};

export default ControlPanel;
