import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

const markets = [
    "HONGKONG", "CAMBODIA", "CHINA", "SINGAPORE", "SYDNEY", "TAIWAN",
    "TOTO MACAU 00", "TOTO MACAU 13", "TOTO MACAU 16", "TOTO MACAU 19", "TOTO MACAU 22", "TOTO MACAU 23",
    "SYDNEY LOTTO", "HONGKONG LOTTO", "GERMANI PLUS", "KENTUCY MID", "TEXAS DAY", "NEW YORK MID",
    "CAROLINA DAY", "CHICAGO LOTTERY", "OREGON 01", "GANGNAM", "BERLIN LOTTERY", "NAMDONG",
    "TEXAS EVENING", "OREGON 04", "QATAR MORNING", "GWANSAN POOLS", "YORDANIA", "CALIFORNIA",
    "FLORIDA EVE", "OREGON 07", "SIPRUS MORNING", "NEW YORK EVE", "KENTUKY EVE", "TEXAS NIGHT",
    "CAROLINA EVENING", "MAGNUM CAMBODIA", "BULLSEYE", "QATAR MIDDAY", "OREGON 10", "FUJI LOTTO",
    "SIPRUS MIDDAY", "MANILA LOTTERY", "VIETNAM", "CHINA POOLS", "QATAR EVENING", "NANOI LOTERRY",
    "JAPAN POOLS", "BANGKOK POOL", "SIPRUS EVENING", "GIEYANG POOLS", "MIAMI LOTTERY", "OSAKA LOTTERY",
    "QATAR NIGHT", "PCSO", "TENNESE", "DUBAI", "SIPRUS NIGHT", "TEXAS MORNING", "GENTING LOTTERY", "ALASKA"
];

const App = () => {
    const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
    const [previousNumbers, setPreviousNumbers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY as string }), []);

    const today = new Date();
    const displayDate = today.toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });


    const handleMarketSelection = (market: string) => {
        const newSelectedMarkets = selectedMarkets.includes(market)
            ? selectedMarkets.filter(m => m !== market)
            : [...selectedMarkets, market];

        if (newSelectedMarkets.length > 6) {
            alert("Anda hanya dapat memilih maksimal 6 pasaran.");
            return;
        }

        setSelectedMarkets(newSelectedMarkets);
    };
    
    const handlePreviousNumberChange = (market: string, value: string) => {
        if (/^\d*$/.test(value) && value.length <= 4) {
            setPreviousNumbers(prev => ({ ...prev, [market]: value }));
        }
    };

    const generatePrediction = async () => {
        if (selectedMarkets.length === 0 || selectedMarkets.length > 6) {
            setError("Silakan pilih 1 hingga 6 pasaran.");
            return;
        }

        const invalidInputs = selectedMarkets.filter(m => !previousNumbers[m] || previousNumbers[m].length !== 4);
        if (invalidInputs.length > 0) {
            setError(`Silakan masukkan 4 digit angka sebelumnya untuk: ${invalidInputs.join(', ')}`);
            return;
        }

        setLoading(true);
        setError('');
        setResult('');

        const formulas = `
            POLA RUMUSAN EKOR MATI Unsur Ekor mati dari Angka ekor harian :
            0=4.5 | 1=7.8 | 2=6.9 | 3=5.7 | 4=7.8 | 5=6.8 | 6=8.9 | 7=4.9 | 8=6.7 | 9=2.7

            RUMUS AI DR EKOR:
            0–359-264 kmt 0178 | 1–397-046 kmt 1258 | 2–157-068 kmt 2349 | 3–579-286 kmt 0134 | 4–357-026 kmt 1489 | 5–179-408 kmt 2356 | 6–179-208 kmt 3456 | 7–319-206 kmt 4578 | 8–531-024 kmt 6789 | 9–357-048 kmt 1269

            Analyze the previous number step-by-step using these formulas. First, identify the tail digit. Then, apply the 'EKOR MATI' and 'AI DR EKOR' formulas for that specific digit. Synthesize the results to generate the prediction.
        `;

        const todayForPrompt = new Date();
        const dateString = `${todayForPrompt.getDate()} ${todayForPrompt.toLocaleString('id-ID', { month: 'long' })} ${todayForPrompt.getFullYear()}`;

        try {
            const promises = selectedMarkets.map(market => {
                const previousNumber = previousNumbers[market];
                const prompt = `
                You are an expert lottery prediction analyst. Your task is to generate a prediction for the market "${market}" for today's date, which is "${dateString}".

                The previous 4D result for this market was ${previousNumber}.

                You must use the following formulas and analytical steps to generate the new numbers:
                ${formulas}

                After your analysis, you must present the result in a single, strictly formatted text block.
                Follow the example format below precisely, including the special fonts and characters. DO NOT include any instructional text like "(4 digit)" in the final output.

                **Example Format (THIS IS HOW THE OUTPUT MUST LOOK):**
                [ 𝐇𝐎𝐍𝐆𝐊𝐎𝐍𝐆
                𝟸𝟽 𝚘𝚔𝚝𝚘𝚋𝚎𝚛 𝟸𝟶𝟸𝟻 

                𝘼𝙄 : 1234
                𝘾𝙉 : 123
                𝘾𝘽 : 1
                𝘽𝘽𝙁𝙎 : 1234567
                4𝘿 : 1234*4567*2345*1267
                3𝘿 : 123*456*712*345*671
                2𝘿 : 12*23*34*45*56
                𝚌𝚊𝚍𝚊𝚗𝚐𝚊𝚗 : 56*74
                𝙏𝙒𝙀𝙉 : 11*88
                ʲᵃᵈⁱᵏᵃⁿ ᵖᵉʳᵇᵃⁿᵈⁱⁿᵍᵃⁿ- ᵗⁱᵈᵃᵏ ᵃᵈᵃ ʲᵃᵐⁱⁿᵃⁿ ᴶᴾ ¹⁰⁰% ]

                **STRICT OUTPUT RULES (These are instructions for you, DO NOT print them):**
                1.  **Market Name:** Replace "HONGKONG" with the correct market name: "${market}".
                2.  **Date:** You MUST replace the example date with today's date: "${dateString}". You must format it to match the example's aesthetic (e.g., "𝟸𝟺 𝚓𝚞𝚕𝚒 𝟸𝟶𝟸𝟺").
                3.  **AI (Angka Ikut):** CRITICAL RULE: Must be EXACTLY 4 unique digits.
                4.  **CN (Colok Naga):** Must be EXACTLY 3 unique digits (derived from AI).
                5.  **CB (Colok Bebas):** Must be EXACTLY 1 digit (derived from CN).
                6.  **BBFS:** CRITICAL RULE: Must be EXACTLY 7 unique, shuffled digits.
                7.  **4D:** You MUST generate EXACTLY 4 distinct 4-digit combinations. **Crucially, these combinations must not be monotonous or simple sequences.** Use your analytical ability to derive these numbers from the AI and BBFS digits, prioritizing combinations you assess as having a high probability of appearing.
                8.  **3D:** You MUST generate EXACTLY 5 distinct 3-digit combinations. **Avoid simple patterns.** These should be intelligently selected combinations from the AI and BBFS numbers that you assess as strong candidates.
                9.  **2D:** You MUST generate EXACTLY 5 distinct 2-digit combinations. **Do not create simple sequences (e.g., 12*23*34).** Instead, create varied and strong pairs based on your analysis of the core numbers. **CRITICAL AVOIDANCE RULE:** You must avoid generating "bolak-balik" numbers (reversed pairs) within the same result. For example, if you generate \`13\`, you are forbidden from also generating \`31\`. If you generate \`25\`, you are forbidden from generating \`52\`. You must only show one of the two possibilities in the final set.
                10. **Cadangan (Backup):** You MUST generate EXACTLY 2 distinct 2-digit combinations. These should also be intelligently derived and not simple sequential numbers.
                11. **TWEN (Twin Numbers):** You MUST generate EXACTLY 2 distinct 2-digit twin number combinations (e.g., 11, 22, 33). Use your analytical skills to determine which twin numbers have the highest probability of appearing based on your analysis of the previous number and the derived core numbers.
                12. **Aesthetics:** Pay close attention to the special fonts, spacing, and alignment to ensure the final output is neat, professional, and easy to read, matching the example.
                13. **Final Output:** Do not output anything else, no explanations, no introductory text, just the final formatted block as shown in the example.
                `;

                return ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: prompt
                });
            });

            const responses = await Promise.all(promises);
            const allResults = responses.map(res => res.text.trim()).join('\n\n---\n\n');
            setResult(allResults);

        } catch (err) {
            console.error(err);
            setError("Terjadi kesalahan saat menghasilkan prediksi. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleCopy = () => {
        if (result) {
            navigator.clipboard.writeText(result);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000); // Hide message after 2 seconds
        }
    };

    return (
        <div className="container">
            <h1>Togel Number Generator</h1>
            <p className="date-display">Prediksi untuk: {displayDate}</p>
            <div className="controls">
                <label>Pilih 1 hingga 6 Pasaran (Terpilih: {selectedMarkets.length})</label>
                <div className="market-grid">
                    {markets.map(market => (
                        <div key={market} className="market-item">
                            <input
                                type="checkbox"
                                id={market}
                                checked={selectedMarkets.includes(market)}
                                onChange={() => handleMarketSelection(market)}
                                disabled={selectedMarkets.length >= 6 && !selectedMarkets.includes(market)}
                            />
                            <label htmlFor={market}>{market}</label>
                        </div>
                    ))}
                </div>
            </div>

            {selectedMarkets.length > 0 && (
                <div className="previous-numbers-container">
                    {selectedMarkets.map(market => (
                        <div key={market} className="previous-number-item">
                            <label htmlFor={`prev-${market}`}>{market}</label>
                            <input
                                type="tel"
                                inputMode="numeric"
                                id={`prev-${market}`}
                                placeholder="1234"
                                value={previousNumbers[market] || ''}
                                onChange={(e) => handlePreviousNumberChange(market, e.target.value)}
                                maxLength={4}
                            />
                        </div>
                    ))}
                </div>
            )}

            <button
                id="generate-btn"
                onClick={generatePrediction}
                disabled={loading || selectedMarkets.length < 1 || selectedMarkets.length > 6}
            >
                {loading && <div className="loader" style={{width: '20px', height: '20px', border: '3px solid #333', borderTopColor: '#000'}}></div>}
                Hasilkan Prediksi
            </button>

            <div className="results">
                {loading && <div className="loader"></div>}
                {error && <p className="error">{error}</p>}
                {result && (
                    <>
                        <button className="copy-btn" onClick={handleCopy} title="Salin Hasil">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                            </svg>
                        </button>
                        <span className={`copy-success-msg ${copySuccess ? 'show' : ''}`}>
                            Tersalin!
                        </span>
                        <pre className="result-text">{result}</pre>
                    </>
                )}
                {!loading && !error && !result && <p>Hasil prediksi akan muncul di sini.</p>}
            </div>
        </div>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error('Failed to find the root element with id "root"');
}