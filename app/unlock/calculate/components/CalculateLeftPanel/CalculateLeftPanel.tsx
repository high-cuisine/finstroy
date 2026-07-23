import type { Dispatch, SetStateAction } from 'react';
import type { CalculatorStaticData } from '@/app/features/calculate/api/types';
import { formatNumberRu } from '../../helpers/format';
import { ChevronDown } from '../icons';
import cls from './CalculateLeftPanel.module.scss';

type Props = {
  staticData: CalculatorStaticData | null;
  staticLoading: boolean;
  staticError: string | null;
  onRefetchStatic: () => void;

  formatId: number | null;
  setFormatId: Dispatch<SetStateAction<number | null>>;
  useCustomSize: boolean;
  setUseCustomSize: Dispatch<SetStateAction<boolean>>;
  customWidth: string;
  setCustomWidth: Dispatch<SetStateAction<string>>;
  customHeight: string;
  setCustomHeight: Dispatch<SetStateAction<string>>;

  materialId: number | null;
  setMaterialId: Dispatch<SetStateAction<number | null>>;
  thicknessId: number | null;
  setThicknessId: Dispatch<SetStateAction<number | null>>;
  bladeWidthId: number | null;
  setBladeWidthId: Dispatch<SetStateAction<number | null>>;

  sheetsCount: number;
  totalCutLength: number;
  wasteArea: number;
  pricePerMeter: number;
  totalPrice: number;
  cuttingLoading: boolean;
  cuttingError: string | null;
  hasCuttingResult: boolean;
};

export function CalculateLeftPanel({
  staticData,
  staticLoading,
  staticError,
  onRefetchStatic,
  formatId,
  setFormatId,
  useCustomSize,
  setUseCustomSize,
  customWidth,
  setCustomWidth,
  customHeight,
  setCustomHeight,
  materialId,
  setMaterialId,
  thicknessId,
  setThicknessId,
  bladeWidthId,
  setBladeWidthId,
  sheetsCount,
  totalCutLength,
  wasteArea,
  pricePerMeter,
  totalPrice,
  cuttingLoading,
  cuttingError,
  hasCuttingResult,
}: Props) {
  const disabled = staticLoading || !staticData;

  return (
    <aside className={cls.root}>
      <div className={`${cls.panelCard} ${cls.conditions}`}>
        <h3 className={cls.panelTitle}>Условия раскроя листа:</h3>

        {staticError && (
          <p className={cls.staticError}>
            {staticError}{' '}
            <button type="button" className={cls.retryBtn} onClick={() => onRefetchStatic()}>
              Повторить
            </button>
          </p>
        )}

        <div className={cls.sizeInputs}>
          <input
            type="number"
            className={cls.sizeInput}
            placeholder="X мм"
            value={customWidth}
            onChange={(e) => setCustomWidth(e.target.value)}
          />
          <span className={cls.sizeSep}>×</span>
          <input
            type="number"
            className={cls.sizeInput}
            placeholder="Y мм"
            value={customHeight}
            onChange={(e) => setCustomHeight(e.target.value)}
          />
        </div>

        <label className={cls.selectWrap}>
          <select
            className={cls.select}
            disabled={disabled}
            value={materialId ?? staticData?.materials[0]?.id ?? ''}
            onChange={(e) => setMaterialId(Number(e.target.value))}
          >
            {staticData?.materials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <ChevronDown />
        </label>

        <label className={cls.selectWrap}>
          <select
            className={cls.select}
            disabled={disabled}
            value={bladeWidthId ?? staticData?.blade_widths[0]?.id ?? ''}
            onChange={(e) => setBladeWidthId(Number(e.target.value))}
          >
            {staticData?.blade_widths.map((o) => (
              <option key={o.id} value={o.id}>
                Ширина пропила, {o.value_mm} мм
              </option>
            ))}
          </select>
          <ChevronDown />
        </label>

        <label className={cls.selectWrap}>
          <select
            className={cls.select}
            disabled={disabled}
            value={thicknessId ?? staticData?.thickness[0]?.id ?? ''}
            onChange={(e) => setThicknessId(Number(e.target.value))}
          >
            {staticData?.thickness.map((o) => (
              <option key={o.id} value={o.id}>
                Толщина реза, {o.value_mm} мм
              </option>
            ))}
          </select>
          <ChevronDown />
        </label>

        <hr className={cls.divider} />

        <div className={cls.priceRow}>
          <span>Цена реза за 1м:</span>
          <span>
            {hasCuttingResult || cuttingLoading ? `${pricePerMeter}₽` : '—'}
          </span>
        </div>
      </div>

      <div className={`${cls.panelCard} ${cls.results}`}>
        <h3 className={cls.panelTitle}>Результаты расчета:</h3>

        {cuttingError && <p className={cls.cuttingError}>{cuttingError}</p>}

        <hr className={cls.divider} />

        <div className={cls.resultsList}>
          <div className={cls.resultRow}>
            <span>Количество листов:</span>
            <span>
              {cuttingLoading && !hasCuttingResult
                ? '…'
                : `${sheetsCount} шт`}
            </span>
          </div>
          <div className={cls.resultRow}>
            <span>Общая длина реза:</span>
            <span>
              {cuttingLoading && !hasCuttingResult
                ? '…'
                : `${totalCutLength.toFixed(2)} м`}
            </span>
          </div>
          <div className={cls.resultRow}>
            <span>Цена реза за 1м:</span>
            <span>
              {cuttingLoading && !hasCuttingResult
                ? '…'
                : `${pricePerMeter} ₽`}
            </span>
          </div>
          <div className={cls.resultRow}>
            <span>Площадь остатка:</span>
            <span>
              {cuttingLoading && !hasCuttingResult
                ? '…'
                : `${wasteArea.toFixed(2)} м²`}
            </span>
          </div>
        </div>

        <hr className={cls.divider} />

        <div className={cls.totalRow}>
          <span>Итого:</span>
          <span>
            {cuttingLoading && !hasCuttingResult
              ? '…'
              : `${formatNumberRu(totalPrice)} ₽`}
          </span>
        </div>
      </div>
    </aside>
  );
}
