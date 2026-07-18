'use client';

import { useCallback, useRef, useState, type Dispatch, type PointerEvent, type RefObject, type SetStateAction, useMemo } from 'react';
import type { SheetResult } from '../../helpers/types';
import { CuttingVisualization } from '../CuttingVisualization/CuttingVisualization';
import {
  CartIcon,
  PdfIcon,
  ViewGridIcon,
  ViewSingleIcon,
  ZoomInIcon,
  ZoomOutIcon,
  ZoomResetIcon,
} from '../icons';
import cls from './CalculateCenterCanvas.module.scss';

type Props = {
  canvasRef: RefObject<HTMLDivElement | null>;
  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>;
  showDimensions: boolean;
  setShowDimensions: (v: boolean) => void;
  currentSheet: SheetResult | null;
  sheetWidth: number;
  sheetHeight: number;
  onAddToCart: () => void;
  addingToCart: boolean;
  canAddToCart: boolean;
  rotation: number;
  setRotation: Dispatch<SetStateAction<number>>;
  onDownloadPdf: () => void;
  generatingPdf: boolean;
  canDownloadPdf: boolean;
  pdfError: string | null;
};

type DragState = {
  mode: 'pan' | 'rotate';
  pointerId: number;
  startX: number;
  startY: number;
  startPanX: number;
  startPanY: number;
  startRotation: number;
  centerX: number;
  centerY: number;
};

function RotateLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8a4.5 4.5 0 0 1 7.7-3.18l.8-.8V2.5h2.5V6H10.3l-.8-.8A3.5 3.5 0 1 0 11.5 8h1.5A5 5 0 1 1 2 8h1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function RotateRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M12.5 8a4.5 4.5 0 0 0-7.7-3.18l-.8-.8V2.5H1.5V6h3.2l.8-.8A3.5 3.5 0 1 1 4.5 8H3a5 5 0 1 0 11 0h-1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CalculateCenterCanvas({
  canvasRef,
  zoom,
  setZoom,
  showDimensions,
  setShowDimensions,
  currentSheet,
  sheetWidth,
  sheetHeight,
  onAddToCart,
  addingToCart,
  canAddToCart,
  rotation,
  setRotation,
  onDownloadPdf,
  generatingPdf,
  canDownloadPdf,
  pdfError,
}: Props) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragDelta, setDragDelta] = useState(0);
  const dragRef = useRef<DragState | null>(null);

  const visualRotation = useMemo(() => rotation + dragDelta, [rotation, dragDelta]);

  const resetView = useCallback(() => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
    setDragDelta(0);
  }, [setZoom]);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;

      const wrap = event.currentTarget;
      const rect = wrap.getBoundingClientRect();
      const rotateMode = event.shiftKey;

      wrap.setPointerCapture(event.pointerId);
      dragRef.current = {
        mode: rotateMode ? 'rotate' : 'pan',
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startPanX: pan.x,
        startPanY: pan.y,
        startRotation: visualRotation,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
      };
    },
    [pan.x, pan.y, visualRotation]
  );

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (drag.mode === 'pan') {
      setPan({
        x: drag.startPanX + (event.clientX - drag.startX),
        y: drag.startPanY + (event.clientY - drag.startY),
      });
      return;
    }

    const startAngle = Math.atan2(drag.startY - drag.centerY, drag.startX - drag.centerX);
    const currentAngle = Math.atan2(event.clientY - drag.centerY, event.clientX - drag.centerX);
    const deltaDeg = ((currentAngle - startAngle) * 180) / Math.PI;
    setDragDelta(drag.startRotation + deltaDeg - rotation);
  }, []);

  const handlePointerUp = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  return (
    <div className={cls.root}>
      <div className={cls.canvasToolbar}>
        <div className={cls.zoomControls}>
          <span className={cls.zoomValue}>{zoom}%</span>
          <div className={cls.zoomGroup}>
            <span className={cls.toolLabel}>Масштаб:</span>
            <button type="button" className={cls.toolBtn} onClick={resetView} aria-label="Сбросить вид">
              <ZoomResetIcon />
            </button>
            <button
              type="button"
              className={cls.toolBtn}
              onClick={() => setZoom((z) => Math.min(200, z + 25))}
              aria-label="Увеличить"
            >
              <ZoomInIcon />
            </button>
            <button
              type="button"
              className={cls.toolBtn}
              onClick={() => setZoom((z) => Math.max(25, z - 25))}
              aria-label="Уменьшить"
            >
              <ZoomOutIcon />
            </button>
          </div>
        </div>

        <div className={cls.orientationControls}>
          <span className={cls.toolLabel}>Ориентация:</span>
          <button
            type="button"
            className={cls.toolBtn}
            onClick={() => { setRotation((v) => v - 90); setDragDelta(0); }}
            aria-label="Повернуть против часовой стрелки"
          >
            <RotateLeftIcon />
          </button>
          <button
            type="button"
            className={cls.toolBtn}
            onClick={() => { setRotation((v) => v + 90); setDragDelta(0); }}
            aria-label="Повернуть по часовой стрелке"
          >
            <RotateRightIcon />
          </button>
          <span className={cls.rotationValue}>{((Math.round(rotation) % 360) + 360) % 360}°</span>
        </div>

        <div className={cls.displayControls}>
          <span className={cls.toolLabel}>Отображение:</span>
          <button
            type="button"
            className={cls.viewBtn}
            onClick={() => setShowDimensions(true)}
            aria-label="Показать размеры"
          >
            <ViewSingleIcon />
          </button>
          <button
            type="button"
            className={cls.viewBtn}
            onClick={() => setShowDimensions(false)}
            aria-label="Скрыть размеры"
          >
            <ViewGridIcon />
          </button>
        </div>
      </div>

      <div
        className={cls.canvasWrap}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          ref={canvasRef}
          className={cls.canvas}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) rotate(${visualRotation}deg) scale(${zoom / 100})`,
            transformOrigin: 'center center',
          }}
        >
          {currentSheet && sheetWidth > 0 && sheetHeight > 0 ? (
            <CuttingVisualization sheet={currentSheet} showDimensions={showDimensions} />
          ) : (
            <div className={cls.emptyCanvas}>Добавьте детали для расчёта</div>
          )}
        </div>
      </div>

      <p className={cls.canvasHint}>Перетаскивайте лист для перемещения, удерживайте Shift — для поворота</p>

      <div className={cls.canvasActions}>
        <button
          type="button"
          className={cls.cartBtn}
          onClick={onAddToCart}
          disabled={!canAddToCart || addingToCart}
        >
          <CartIcon />
          {addingToCart ? 'Добавляем…' : 'Добавить в корзину'}
        </button>
        <button
          type="button"
          className={cls.pdfBtn}
          onClick={onDownloadPdf}
          disabled={!canDownloadPdf || generatingPdf}
        >
          <PdfIcon />
          {generatingPdf ? 'Формируем…' : 'Сохранить в PDF'}
        </button>
      </div>
      {pdfError && <p className={cls.pdfError}>{pdfError}</p>}
    </div>
  );
}
