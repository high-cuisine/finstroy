import type { Dispatch, SetStateAction } from 'react';
import type { CutPiece, SheetResult } from '../../helpers/types';
import { ChevronDown, TrashIcon } from '../icons';
import cls from './CalculateRightPanel.module.scss';

type Props = {
  sheets: SheetResult[];
  activeSheet: number;
  setActiveSheet: Dispatch<SetStateAction<number>>;
  pieces: CutPiece[];
  updatePiece: (id: number, field: 'width' | 'height' | 'quantity', value: number) => void;
  removePiece: (id: number) => void;
  addPiece: () => void;
  edgeOffsetX: string;
  setEdgeOffsetX: Dispatch<SetStateAction<string>>;
  edgeOffsetY: string;
  setEdgeOffsetY: Dispatch<SetStateAction<string>>;
  newSheetNotice?: { sheetNumber: number } | null;
  onDismissNewSheetNotice?: () => void;
};

export function CalculateRightPanel({
  sheets,
  activeSheet,
  setActiveSheet,
  pieces,
  updatePiece,
  removePiece,
  addPiece,
  edgeOffsetX,
  setEdgeOffsetX,
  edgeOffsetY,
  setEdgeOffsetY,
  newSheetNotice,
  onDismissNewSheetNotice,
}: Props) {
  const totalSheets = Math.max(1, sheets.length);
  const canPrev = activeSheet > 0;
  const canNext = activeSheet < totalSheets - 1;

  return (
    <aside className={cls.root}>
      <div className={cls.panelCard}>
        <h3 className={cls.panelTitle}>Параметры раскроя:</h3>

        <div className={cls.sheetHeaderRow}>
          <div className={cls.sheetRow}>
          <button
            type="button"
            className={cls.sheetNavBtn}
            disabled={!canPrev}
            onClick={() => setActiveSheet((s) => Math.max(0, s - 1))}
            aria-label="Предыдущий лист"
          >
            ‹
          </button>

          {sheets.length > 1 ? (
            <label className={cls.selectWrap}>
              <select
                className={cls.select}
                value={activeSheet}
                onChange={(e) => setActiveSheet(Number(e.target.value))}
              >
                {Array.from({ length: totalSheets }).map((_, i) => (
                  <option key={i} value={i}>
                    Лист {i + 1}
                  </option>
                ))}
              </select>
              <ChevronDown />
            </label>
          ) : (
            <div className={cls.sheetLabel}>Лист 1</div>
          )}

          <button
            type="button"
            className={cls.sheetNavBtn}
            disabled={!canNext}
            onClick={() => setActiveSheet((s) => Math.min(totalSheets - 1, s + 1))}
            aria-label="Следующий лист"
          >
            ›
          </button>
          </div>

          {newSheetNotice && (
            <div className={cls.newSheetNotice} role="status">
              <span>Добавлен лист {newSheetNotice.sheetNumber}</span>
              <button
                type="button"
                className={cls.noticeClose}
                onClick={() => onDismissNewSheetNotice?.()}
                aria-label="Закрыть уведомление"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <div className={cls.sheetMeta}>
          Лист {Math.min(activeSheet + 1, totalSheets)} из {totalSheets}
        </div>

        <hr className={cls.divider} />

        <div className={cls.piecesScroll}>
          <div className={cls.piecesList}>
            {pieces.map((piece, index) => (
              <div key={piece.id} className={cls.pieceRow}>
                <span className={cls.pieceNum}>{index + 1}</span>
                <input
                  type="number"
                  className={cls.pieceInput}
                  value={piece.width || ''}
                  placeholder="X мм"
                  min={1}
                  onChange={(e) =>
                    updatePiece(piece.id, 'width', parseInt(e.target.value, 10) || 0)
                  }
                />
                <span className={cls.pieceSep}>×</span>
                <input
                  type="number"
                  className={cls.pieceInput}
                  value={piece.height || ''}
                  placeholder="Y мм"
                  min={1}
                  onChange={(e) =>
                    updatePiece(piece.id, 'height', parseInt(e.target.value, 10) || 0)
                  }
                />
                <input
                  type="number"
                  className={cls.pieceQty}
                  title="Количество"
                  value={piece.quantity ?? 1}
                  min={1}
                  onChange={(e) =>
                    updatePiece(piece.id, 'quantity', parseInt(e.target.value, 10) || 0)
                  }
                />
                <button
                  type="button"
                  className={cls.removeBtn}
                  onClick={() => removePiece(piece.id)}
                  aria-label="Удалить"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
            <button type="button" className={cls.addBtn} onClick={addPiece}>
              +
            </button>
          </div>
        </div>

        <div className={cls.edgeOffsetsSection}>
          <h3 className={cls.edgeOffsetsTitle}>Отступы от краев:</h3>
          <div className={cls.edgeOffsetsRow}>
            <input
              type="number"
              className={cls.edgeOffsetInput}
              value={edgeOffsetX}
              placeholder="0 мм"
              min={0}
              onChange={(e) => setEdgeOffsetX(e.target.value)}
              aria-label="Горизонтальный отступ от краев"
            />
            <span className={cls.pieceSep}>×</span>
            <input
              type="number"
              className={cls.edgeOffsetInput}
              value={edgeOffsetY}
              placeholder="0 мм"
              min={0}
              onChange={(e) => setEdgeOffsetY(e.target.value)}
              aria-label="Вертикальный отступ от краев"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
