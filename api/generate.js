// File ini adalah "jembatan" aman yang berjalan di server Vercel.
// File ini akan menggunakan API Key Anda dari Environment Variables Vercel.
const { GoogleGenAI } = require("@google/genai");

export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  // Ambil prompt dari body permintaan yang dikirim oleh aplikasi
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Periksa apakah API Key sudah diatur di Vercel
  if (!process.env.API_KEY) {
    return res.status(500).json({ error: 'API key is not configured on the server.' });
  }

  try {
    // Inisialisasi GoogleGenAI di sisi server dengan API Key yang aman
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Panggil model Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    // Kirim kembali hasilnya ke aplikasi Anda
    res.status(200).json({ text: response.text });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'An error occurred while generating the prediction.' });
  }
}
