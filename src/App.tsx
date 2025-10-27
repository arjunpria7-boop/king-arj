import React, { useState, useCallback } from 'react';
import { generatePrediction } from './services/geminiService';
import type { LotteryType, PredictionResult } from './types';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import PredictionDisplay from './components/PredictionDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Disclaimer from './components/Disclaimer';

const App: React.FC = () => {
  const [lotteryType, setLotteryType] = useState<LotteryType>('4D');
  const [market, setMarket] = useState<string>('HONGKONG');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<string[]>(['', '', '', '']);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const result = await generatePrediction(lotteryType, market, lastResult);
      setPrediction(result);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [lotteryType, market, lastResult]);

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <Header />
        <main className="mt-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
            <ControlPanel
              market={market}
              setMarket={setMarket}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              lastResult={lastResult}
              onLastResultChange={setLastResult}
            />
          </div>

          <div className="mt-8">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {prediction && !isLoading && <PredictionDisplay result={prediction} market={market} />}
          </div>
        </main>
        <Disclaimer />
      </div>
    </div>
  );
};

export default App;
