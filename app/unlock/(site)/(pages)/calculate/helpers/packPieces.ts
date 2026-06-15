import type { CutPiece, SheetResult } from './types';

/** Разворачивает строки с `quantity` в отдельные прямоугольники для локального packPieces. */
export function expandPiecesForPacking(pieces: CutPiece[]): CutPiece[] {
  const out: CutPiece[] = [];
  for (const p of pieces) {
    if (p.width <= 0 || p.height <= 0) continue;
    const qRaw = p.quantity != null ? Math.floor(p.quantity) : 1;
    const q = qRaw > 0 ? Math.min(10000, qRaw) : 0;
    if (q <= 0) continue;
    for (let i = 0; i < q; i++) {
      out.push({ id: p.id * 10_000 + i, width: p.width, height: p.height });
    }
  }
  return out;
}

export function packPieces(
  pieces: CutPiece[],
  sheetW: number,
  sheetH: number,
  kerf: number,
  edgeOffsetX = 0,
  edgeOffsetY = 0
): SheetResult[] {
  const sheetWn = Number(sheetW) || 0;
  const sheetHn = Number(sheetH) || 0;
  const kerfN = Math.max(0, Number(kerf) || 0);
  const offsetX = Math.max(0, Number(edgeOffsetX) || 0);
  const offsetY = Math.max(0, Number(edgeOffsetY) || 0);
  const usableW = Math.max(0, sheetWn - offsetX * 2);
  const usableH = Math.max(0, sheetHn - offsetY * 2);

  if (pieces.length === 0) return [];
  if (sheetWn <= 0 || sheetHn <= 0 || usableW <= 0 || usableH <= 0) return [];

  const sorted = [...pieces].sort((a, b) => b.height * b.width - a.height * a.width);
  const sheets: SheetResult[] = [];
  const remaining = [...sorted];

  while (remaining.length > 0) {
    // Если деталь не влезает ни в один выбранный формат (в обеих ориентациях),
    // создаём отдельный лист 1:1 под эту деталь, чтобы превью не "пустело".
    // (Это только локальное превью packPieces; серверный расчёт остаётся на выбранных размерах.)
    for (let i = remaining.length - 1; i >= 0; i--) {
      const p = remaining[i];
      const w = Number(p.width) || 0;
      const h = Number(p.height) || 0;
      if (w <= 0 || h <= 0) {
        remaining.splice(i, 1);
        continue;
      }
      const fitsNormal = w + kerfN <= usableW && h + kerfN <= usableH;
      const fitsRot = h + kerfN <= usableW && w + kerfN <= usableH;
      if (fitsNormal || fitsRot) continue;

      remaining.splice(i, 1);
      sheets.push({
        sheetWidth: w,
        sheetHeight: h,
        pieces: [{ id: p.id, x: 0, y: 0, width: w, height: h }],
      });
    }

    if (remaining.length === 0) break;

    const sheet: SheetResult = { pieces: [], sheetWidth: sheetWn, sheetHeight: sheetHn };
    const spaces = [{ x: offsetX, y: offsetY, w: usableW, h: usableH }];

    const toPlace = [...remaining];
    remaining.length = 0;

    for (const piece of toPlace) {
      let placed = false;

      for (let i = 0; i < spaces.length; i++) {
        const space = spaces[i];
        const pw = (Number(piece.width) || 0) + kerfN;
        const ph = (Number(piece.height) || 0) + kerfN;

        if (pw <= space.w && ph <= space.h) {
          sheet.pieces.push({
            id: piece.id,
            x: space.x,
            y: space.y,
            width: Number(piece.width) || 0,
            height: Number(piece.height) || 0,
          });

          spaces.splice(i, 1);

          const rightW = space.w - pw;
          const bottomH = space.h - ph;

          if (rightW > 0) {
            spaces.push({ x: space.x + pw, y: space.y, w: rightW, h: ph });
          }
          if (bottomH > 0) {
            spaces.push({ x: space.x, y: space.y + ph, w: space.w, h: bottomH });
          }

          spaces.sort((a, b) => a.w * a.h - b.w * b.h);
          placed = true;
          break;
        }

        if (piece.height !== piece.width && ph <= space.w && pw <= space.h) {
          sheet.pieces.push({
            id: piece.id,
            x: space.x,
            y: space.y,
            width: Number(piece.height) || 0,
            height: Number(piece.width) || 0,
          });

          spaces.splice(i, 1);

          const rightW = space.w - ph;
          const bottomH = space.h - pw;

          if (rightW > 0) {
            spaces.push({ x: space.x + ph, y: space.y, w: rightW, h: pw });
          }
          if (bottomH > 0) {
            spaces.push({ x: space.x, y: space.y + pw, w: space.w, h: bottomH });
          }

          spaces.sort((a, b) => a.w * a.h - b.w * b.h);
          placed = true;
          break;
        }
      }

      if (!placed) {
        remaining.push(piece);
      }
    }

    if (sheet.pieces.length > 0) {
      sheets.push(sheet);
    } else {
      break;
    }
  }

  return sheets;
}
