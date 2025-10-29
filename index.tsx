import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

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

    // API Key Management State
    const [apiKeys, setApiKeys] = useState<string[]>([]);
    const [selectedApiKey, setSelectedApiKey] = useState<string>('');
    const [isApiModalOpen, setIsApiModalOpen] = useState(false);
    const [newApiKey, setNewApiKey] = useState('');

    useEffect(() => {
        try {
            const storedKeys = localStorage.getItem('userApiKeys');
            const storedSelectedKey = localStorage.getItem('selectedApiKey');
            if (storedKeys) {
                const parsedKeys = JSON.parse(storedKeys);
                setApiKeys(parsedKeys);
                if (!storedSelectedKey && parsedKeys.length > 0) {
                    setSelectedApiKey(parsedKeys[0]);
                    localStorage.setItem('selectedApiKey', parsedKeys[0]);
                }
            }
            if (storedSelectedKey) {
                setSelectedApiKey(storedSelectedKey);
            }
        } catch (e) {
            console.error("Failed to parse API keys from localStorage", e);
            localStorage.removeItem('userApiKeys');
            localStorage.removeItem('selectedApiKey');
        }
    }, []);


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
        if (!selectedApiKey) {
            setError("Silakan tambahkan dan pilih Password di menu 'Password' untuk memulai.");
            setIsApiModalOpen(true);
            return;
        }

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

        const stylizeDate = (date: Date) => {
            const normal = 'abcdefghijklmnopqrstuvwxyz0123456789';
            const stylized = '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿';
            const dateString = `${date.getDate()} ${date.toLocaleString('id-ID', { month: 'long' })} ${date.getFullYear()}`;
            let result = '';
            for (const char of dateString.toLowerCase()) {
                const index = normal.indexOf(char);
                result += (index !== -1) ? stylized[index] : char;
            }
            return result;
        };

        const stylizedDateString = stylizeDate(new Date());

        try {
            const promises = selectedMarkets.map(market => {
                const previousNumber = previousNumbers[market];
                const prompt = `You are a lottery prediction AI. Your single task is to fill the provided template with prediction numbers based on the data given.

**ANALYSIS DATA:**
*   **Market:** ${market.toUpperCase()}
*   **Previous Result:** ${previousNumber}
*   **Formulas:** ${formulas}

**YOUR TASK:**
Based on your analysis of the data, complete the template below.
**CRITICAL RULE:** Your output must be ONLY the completed template. Do NOT change the market name or date. Just fill in the numbers where you see '...'.

**TEMPLATE TO COMPLETE:**
[ ${market.toUpperCase()}
${stylizedDateString}

𝘼𝙄 : ...
𝘾𝙉 : ...
𝘾𝘽 : ...
𝘽𝘽𝙁𝙎 : ...
4𝘿 : ...
3𝘿 : ...
2𝘿 : ...
𝚌𝚊𝚍𝚊𝚗𝚐𝚊𝚗 : ...
𝙏𝙒𝙀𝙉 : ...
ʲᵃᵈⁱᵏᵃⁿ ᵖᵉʳᵇᵃⁿᵈⁱⁿᵍᵃⁿ- ᵗⁱᵈᵃᵏ ᵃᵈᵃ ʲᵃᵐⁱⁿᵃⁿ ᴶᴾ ¹⁰⁰% ]

---
**NUMBER GENERATION RULES:**
*   **AI (Angka Ikut):** EXACTLY 4 unique digits.
*   **CN (Colok Naga):** EXACTLY 3 unique digits (derived from AI).
*   **CB (Colok Bebas):** EXACTLY 1 digit (derived from CN).
*   **BBFS:** EXACTLY 7 unique, shuffled digits.
*   **4D:** 4 distinct 4-digit combinations.
*   **3D:** 5 distinct 3-digit combinations.
*   **2D:** 5 distinct 2-digit combinations.
*   **Cadangan (Backup):** 2 distinct 2-digit combinations.
*   **TWEN (Twin Numbers):** 2 distinct 2-digit twin number combinations (e.g., 11, 22).`;

                return fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: prompt, apiKey: selectedApiKey }),
                }).then(async res => {
                    if (!res.ok) {
                        const errorBody = await res.text();
                        try {
                            const errJson = JSON.parse(errorBody);
                            throw new Error(errJson.details || errJson.error || `Error for ${market}: ${res.statusText}`);
                        } catch (e) {
                            throw new Error(errorBody || `Server returned an error: ${res.statusText}`);
                        }
                    }
                    return res.json();
                });
            });

            const responses = await Promise.all(promises);
            const allResults = responses.map(res => res.text.trim()).join('\n\n---\n\n');
            setResult(allResults);

        } catch (err: any) {
            console.error(err);
            if (err.message && (err.message.includes('429') || /quota|limit/i.test(err.message))) {
                setError("Kuota Password saat ini telah habis. Silakan ganti dengan Password lain di menu 'Password'.");
                setIsApiModalOpen(true);
            } else {
                setError(err.message || "Terjadi kesalahan saat menghasilkan prediksi. Silakan coba lagi.");
            }
        } finally {
            setLoading(false);
        }
    };
    
    const handleCopy = () => {
        if (result) {
            const textArea = document.createElement("textarea");
            textArea.value = result;
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                if (document.execCommand('copy')) {
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                }
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }
            document.body.removeChild(textArea);
        }
    };

    // API Key Modal Handlers
    const handleAddApiKey = () => {
        if (newApiKey.trim() && !apiKeys.includes(newApiKey.trim())) {
            const updatedKeys = [...apiKeys, newApiKey.trim()];
            setApiKeys(updatedKeys);
            localStorage.setItem('userApiKeys', JSON.stringify(updatedKeys));
            if (!selectedApiKey) {
                handleSelectApiKey(newApiKey.trim());
            }
            setNewApiKey('');
        }
    };

    const handleSelectApiKey = (key: string) => {
        setSelectedApiKey(key);
        localStorage.setItem('selectedApiKey', key);
    };

    const handleDeleteApiKey = (keyToDelete: string) => {
        const updatedKeys = apiKeys.filter(key => key !== keyToDelete);
        setApiKeys(updatedKeys);
        localStorage.setItem('userApiKeys', JSON.stringify(updatedKeys));
        if (selectedApiKey === keyToDelete) {
            const newSelected = updatedKeys.length > 0 ? updatedKeys[0] : '';
            handleSelectApiKey(newSelected);
        }
    };

    const ApiKeyModal = () => (
        <div className="modal-overlay" onClick={() => setIsApiModalOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Kelola Password</h2>
                <div className="api-key-input-group">
                    <input
                        type="text"
                        value={newApiKey}
                        onChange={(e) => setNewApiKey(e.target.value)}
                        placeholder="Masukkan Password baru"
                    />
                    <button onClick={handleAddApiKey}>Tambah</button>
                </div>
                {apiKeys.length > 0 ? (
                    <ul className="api-key-list">
                        {apiKeys.map(key => (
                            <li key={key} className="api-key-item">
                                <div className="api-key-item-info">
                                    <input
                                        type="radio"
                                        id={key}
                                        name="apiKey"
                                        checked={selectedApiKey === key}
                                        onChange={() => handleSelectApiKey(key)}
                                    />
                                    <label htmlFor={key}>{`${key.substring(0, 4)}...${key.substring(key.length - 4)}`}</label>
                                </div>
                                <button onClick={() => handleDeleteApiKey(key)}>Hapus</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{textAlign: 'center', margin: '1rem 0'}}>Belum ada Password. Silakan tambahkan satu.</p>
                )}
                <div className="modal-footer">
                    <button onClick={() => setIsApiModalOpen(false)}>Tutup</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container">
            {isApiModalOpen && <ApiKeyModal />}
            <div className="header-panel">
                <h1>Hokky Mas ARJ</h1>
                <button onClick={() => setIsApiModalOpen(true)} className="manage-password-icon-btn" title="Kelola Password">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                    </svg>
                </button>
            </div>
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
                disabled={loading || selectedMarkets.length < 1 || selectedMarkets.length > 6 || !selectedApiKey}
            >
                {loading && <div className="loader" style={{width: '20px', height: '20px', border: '3px solid #000', borderTopColor: 'transparent'}}></div>}
                {loading ? 'Menghasilkan...' : 'Hasilkan Prediksi'}
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
                {!loading && !error && !result && <p>{!selectedApiKey ? "Silakan tambahkan Password untuk memulai." : "Hasil Akan Muncul Disini"}</p>}
            </div>
        </div>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
} else {
    console.error('Failed to find the root element with id "root"');
}