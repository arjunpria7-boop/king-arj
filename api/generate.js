// File ini adalah "jembatan" aman yang berjalan di server Vercel.
// File ini akan menggunakan API Key Anda dari Environment Variables Vercel.
const { GoogleGenAI } = require("@google/genai");

// Menggunakan module.exports untuk kompatibilitas yang lebih baik di lingkungan Vercel/Node.js
module.exports = async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Ambil prompt dari body permintaan yang dikirim oleh aplikasi
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Periksa apakah API Key sudah diatur di Vercel
  if (!process.env.API_KEY) {
    return res.status(500).json({ error: 'API key is not configured on the server. Please set it in Vercel environment variables.' });
  }

  try {
    // Inisialisasi GoogleGenAI di sisi server dengan API Key yang aman
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
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
    res.status(500).json({ error: 'An error occurred while generating the prediction.', details: error.message });
  }
};