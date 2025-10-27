import { GoogleGenAI, Type } from "@google/genai";
import type { LotteryType, PredictionResult } from '../types';

const predictionSchema = {
  type: Type.OBJECT,
  properties: {
    ai: { type: Type.STRING, description: 'Angka Ikut (4 digit).' },
    cb: { type: Type.STRING, description: 'Colok Bebas (1 atau 2 digit, dipisah spasi jika 2).' },
    cn: { type: Type.STRING, description: 'Colok Naga (TEPAT 1 set, contoh: 1/2/3).' },
    bbfs: { type: Type.STRING, description: 'Bolak Balik Full Set (5-7 digit unik).' },
    bb4d: {
      type: Type.ARRAY,
      description: 'Array berisi TEPAT 4 angka prediksi 4D Bolak Balik.',
      items: { type: Type.STRING },
    },
    bb3d: {
      type: Type.ARRAY,
      description: 'Array berisi TEPAT 5 angka prediksi 3D Bolak Balik.',
      items: { type: Type.STRING },
    },
    bb2d: {
      type: Type.ARRAY,
      description: 'Array berisi TEPAT 5 angka prediksi utama 2D.',
      items: { type: Type.STRING },
    },
    bb2dCadangan: {
      type: Type.ARRAY,
      description: 'Array berisi TEPAT 2 angka prediksi cadangan 2D.',
      items: { type: Type.STRING },
    },
  },
  required: ['ai', 'cb', 'cn', 'bbfs', 'bb4d', 'bb3d', 'bb2d', 'bb2dCadangan'],
};

const TOGEL_FORMULAS = `
---
POLA RUMUSAN EKOR MATI
Unsur Ekor mati dari Angka ekor harian :
0 = 4.5
1 = 7.8
2 = 6.9
3 = 5.7
4 = 7.8
5 = 6.8
6 = 8.9
7 = 4.9
8 = 6.7
9 = 2.7

RUMUS AI DR EKOR. (95%). (pengeluaran sblumnya).
0 – 359-264 kmt 0178.
1 – 397-046 kmt 1258.
2 – 157-068 kmt 2349.
3 – 579-286 kmt 0134.
4 – 357-026 kmt 1489.
5 – 179-408 kmt 2356.
6 – 179-208 kmt 3456.
7 – 319-206 kmt 4578.
8 – 531-024 kmt 6789.
9 – 357-048 kmt 1269.
MAIN 2D : (85%).
TOP : AI Vs KMT.
CD : AI gnjl Vs AI gnap.

RUMUS LEMAH DIAMBIL DARI JUMLAH 2D HARIAN
JUMLAH 0= 02,06,17,19,20,28,29,33,37,46,48,55,56,59,60,64,65,66,67,71,73,76,77,78,82,84,87,88,91,92,95,99
JUMLAH 1= 00,02,03,06,13,17,20,28,30,31,39,44,48,57,59,60,66,67,71,75,76,77,78,82,84,87,88,89,93,95,98,99
JUMLAH 2= 00,04,06,09,11,13,14,17,24,28,31,39,40,41,42,55,59,60,68,71,77,78,82,86,87,88,8990,93,95,98,99
JUMLAH 3= 00,01,04,06,09,10,11,15,17,22,24,25,28,35,39,40,42,51,52,53,60,66,71,79,82,88,89,90,93,97,98,99
JUMLAH 4= 00,01,04,08,09,10,11,12,15,17,21,22,26,28,33,35,36,39,40,46,51,53,62,63,64,71,77,80,82,90,93,99
JUMLAH 5= 00,01,04,10,11,12,15,19,21,22,23,26,28,32,33,37,39,40,44,46,47,51,57,62,64,73,74,75,82,88,91,93
JUMLAH 6= 02,04,11,12,15,20,21,22,23,26,32,33,34,37,39,40,43,44,48,51,55,57,58,62,68,73,75,84,85,86,93,99
JUMLAH 7= 00,04,13,15,22,23,26,31,32,33,34,37,40,43,44,45,48,51,54,55,59,62,66,68,69,73,79,84,86,95,96,97
JUMLAH 8= 06,07,08,11,15,24,26,33,34,37,42,43,44,45,48,51,54,55,56,59,60,62,65,66,70,73,77,79,80,84,95,97
JUMLAH 9= 06,08,17,18,19,22,26,35,37,44,45,48,53,54,55,56,59,60,62,65,66,67,71,73,76,77,80,81,84,88,91,95
---
`;

const buildPrompt = (lotteryType: LotteryType, market: string, lastResult?: string[]): string => {
  let historyPrompt = '';
  const isValidHistory = lastResult && lastResult.length === 4 && lastResult.every(digit => /^\d$/.test(digit));
  
  if (isValidHistory) {
    const historyNumber = lastResult.join('');
    historyPrompt = `Hasil keluaran 4D terakhir adalah ${historyNumber}. Gunakan angka ini, terutama ekornya (${historyNumber.slice(-1)}), sebagai dasar untuk menerapkan rumus yang diberikan.`;
  }

  return `Anda adalah seorang master numerologi dan analis data togel dari Indonesia.
  Tugas Anda adalah membuat prediksi angka keberuntungan untuk permainan togel ${lotteryType} untuk pasaran ${market}.
  
  ANDA HARUS SECARA KETAT MENGIKUTI DAN MENGGUNAKAN KUMPULAN RUMUS DAN TABEL BERIKUT DALAM ANALISIS ANDA:
  ${TOGEL_FORMULAS}

  Gunakan data di atas untuk menganalisis dan menghasilkan prediksimu.
  ${historyPrompt}
  
  Setelah melakukan analisis dengan rumus tersebut, berikan hasil lengkap dalam format berikut:
- AI (Angka Ikut): 4 digit yang berpotensi kuat muncul.
- CB (Colok Bebas): 1 atau 2 digit terkuat.
- CN (Colok Naga): TEPAT 1 set colok naga (contoh: 1/2/3).
- BBFS (Bolak Balik Full Set): 5 hingga 7 digit untuk kombinasi.
- 4D BB: TEPAT 4 kombinasi 4D Bolak Balik dari BBFS.
- 3D BB: TEPAT 5 kombinasi 3D Bolak Balik dari BBFS.
- 2D: TEPAT 5 kombinasi utama 2D.
- 2D Cadangan: TEPAT 2 kombinasi cadangan 2D.
  
  Pastikan hasilnya sesuai dengan format JSON yang diminta.`;
};

export const generatePrediction = async (lotteryType: LotteryType, market: string, lastResult?: string[]): Promise<PredictionResult> => {
  // FIX: Adhering to @google/genai coding guidelines to use process.env.API_KEY directly.
  if (!process.env.API_KEY) {
    throw new Error("Kunci API tidak dikonfigurasi. Pastikan variabel lingkungan API_KEY telah diatur.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: buildPrompt(lotteryType, market, lastResult),
      config: {
        responseMimeType: "application/json",
        responseSchema: predictionSchema,
        temperature: 0.9,
      }
    });

    // FIX: Per @google/genai guidelines, `response.text` is the correct way to access the text content and is not optional on a successful response.
    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("Respons dari AI kosong atau tidak valid.");
    }

    const result = JSON.parse(jsonText);
    
    // Basic validation
    if (!result.ai || !result.cb || !result.cn || !result.bbfs || !result.bb4d || !result.bb3d || !result.bb2d || !result.bb2dCadangan) {
        throw new Error("Format respons dari AI tidak valid atau tidak lengkap.");
    }

    return result as PredictionResult;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error("Kunci API tidak valid. Pastikan kunci API Anda benar dan aktif.");
        }
        throw new Error(`Gagal berkomunikasi dengan AI: ${error.message}`);
    }
    throw new Error("Gagal berkomunikasi dengan AI karena kesalahan yang tidak diketahui.");
  }
};