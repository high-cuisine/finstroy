import type { SheetResult } from '../../helpers/types';
import cls from './CuttingVisualization.module.scss';

type Props = {
  sheet: SheetResult;
  showDimensions: boolean;
};

export function CuttingVisualization({ sheet, showDimensions }: Props) {
  const maxW = 600;
  const maxH = 400;
  const scale = Math.min(maxW / sheet.sheetWidth, maxH / sheet.sheetHeight);
  const w = sheet.sheetWidth * scale;
  const h = sheet.sheetHeight * scale;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={cls.svgCanvas}>
      <rect x={0} y={0} width={w} height={h} fill="var(--calc-template-bg)" rx={8} />

      {sheet.pieces.map((piece, idx) => {
        const px = piece.x * scale;
        const py = piece.y * scale;
        const pw = piece.width * scale;
        const ph = piece.height * scale;

        return (
          <g key={piece.id}>
            <rect
              x={px + 2}
              y={py + 2}
              width={Math.max(0, pw - 4)}
              height={Math.max(0, ph - 4)}
              fill="var(--calc-piece-bg)"
              rx={4}
            />
            <text
              x={px + 8}
              y={py + 18}
              fill="var(--calc-piece-text)"
              fontSize={10}
              fontWeight={500}
              fontFamily="Inter, sans-serif"
            >
              {idx + 1}
            </text>
            {showDimensions && pw > 60 && ph > 30 && (
              <text
                x={px + pw / 2}
                y={py + ph / 2 + 4}
                fill="var(--calc-piece-subtext)"
                fontSize={10}
                fontFamily="Inter, sans-serif"
                textAnchor="middle"
              >
                {piece.width} мм x {piece.height} мм
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
