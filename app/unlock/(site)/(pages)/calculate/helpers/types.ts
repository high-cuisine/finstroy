export interface CutPiece {
  id: number;
  width: number;
  height: number;
  /** Количество деталей (для POST `parts[].quantity` и превью). По умолчанию 1. */
  quantity?: number;
}

export interface PlacedPiece {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SheetResult {
  pieces: PlacedPiece[];
  sheetWidth: number;
  sheetHeight: number;
}
