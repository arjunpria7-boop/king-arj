// File ini adalah "jembatan" aman yang berjalan di server Vercel.
// File ini akan menggunakan API Key yang dikirim dari aplikasi pengguna.
const { GoogleGenAI } = require("@google/genai");

// Menggunakan module.exports untuk kompatibilitas yang lebih baik di lingkungan Vercel/Node.js
module.exports = async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Ambil prompt dan apiKey dari body permintaan
  const { prompt, apiKey } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Gunakan apiKey yang diberikan oleh pengguna, atau fallback ke environment variable server
  const keyToUse = apiKey || process.env.API_KEY;

  if (!keyToUse) {
    return res.status(400).json({ error: 'API key not provided. Please add an API key in the application settings.' });
  }

  try {
    // Inisialisasi GoogleGenAI dengan API Key yang sesuai
    const ai = new GoogleGenAI({ apiKey: keyToUse });
    
    // Panggil model Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    const text = response.text;

    if (!text) {
        console.error("Gemini API returned no text. Full response:", JSON.stringify(response, null, 2));
        return res.status(500).json({ error: 'The model returned an empty response. This might be due to content safety filters.' });
    }
    
    // Kirim kembali hasilnya ke aplikasi Anda
    res.status(200).json({ text: text });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Kirim kembali pesan error yang lebih deskriptif ke client
    res.status(500).json({ error: 'An error occurred while generating the prediction.', details: error.message });
  }
};