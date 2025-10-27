export type LotteryType = '2D' | '3D' | '4D';

export interface PredictionResult {
  ai: string; // Angka Ikut
  cb: string; // Colok Bebas
  cn: string; // Colok Naga (1 set)
  bbfs: string; // Bolak Balik Full Set
  bb4d: string[]; // 4D Bolak Balik (4 sets)
  bb3d: string[]; // 3D Bolak Balik (5 sets)
  bb2d: string[]; // 2D (5 sets)
  bb2dCadangan: string[]; // 2D Cadangan (2 sets)
}
