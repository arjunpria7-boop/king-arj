import React, { useRef } from 'react';

interface HistoryInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const HistoryInput: React.FC<HistoryInputProps> = ({ value, onChange }) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newChar = e.target.value.slice(-1);
    if (!/^\d*$/.test(newChar)) {
      return;
    }

    const newValue = [...value];
    newValue[index] = newChar;
    onChange(newValue);

    if (newChar && index < value.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pastedData.length === 4) {
      const newValue = pastedData.split('');
      onChange(newValue);
      inputsRef.current[3]?.focus();
    }
  };


  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {value.map((digit, index) => (
        <input
          key={index}
          // FIX: The ref callback must not return a value. Wrapped in a block statement to ensure a void return type and fix the type error.
          ref={(el) => {inputsRef.current[index] = el}}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleInputChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-bold bg-slate-700 border-2 border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default HistoryInput;