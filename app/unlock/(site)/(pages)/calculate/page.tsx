'use client';

import Header from '@/app/shared/componets/layout/Header/Header';
import Footer from '@/app/shared/componets/layout/Footer/Footer';
import { useCalculateCalculator } from '@/app/features/calculate';
import {
  CalculateCenterCanvas,
  CalculateLeftPanel,
  CalculateRightPanel,
} from './components';
import cls from './calculate.module.scss';

export default function CalculatePage() {
  const calc = useCalculateCalculator();

  return (
    <>
      <Header />
      <div className={cls.pageShell}>
        <div className={cls.page}>
        

          <div className={cls.layout}>
            <CalculateLeftPanel
              staticData={calc.staticData}
              staticLoading={calc.staticLoading}
              staticError={calc.staticError}
              onRefetchStatic={calc.refetchStatic}
              formatId={calc.formatId}
              setFormatId={calc.setFormatId}
              useCustomSize={calc.useCustomSize}
              setUseCustomSize={calc.setUseCustomSize}
              customWidth={calc.customWidth}
              setCustomWidth={calc.setCustomWidth}
              customHeight={calc.customHeight}
              setCustomHeight={calc.setCustomHeight}
              materialId={calc.materialId}
              setMaterialId={calc.setMaterialId}
              thicknessId={calc.thicknessId}
              setThicknessId={calc.setThicknessId}
              bladeWidthId={calc.bladeWidthId}
              setBladeWidthId={calc.setBladeWidthId}
              sheetsCount={calc.sheetsCount}
              totalCutLength={calc.totalCutLength}
              wasteArea={calc.wasteArea}
              pricePerMeter={calc.pricePerMeter}
              totalPrice={calc.totalPrice}
              cuttingLoading={calc.cuttingLoading}
              cuttingError={calc.cuttingError}
              hasCuttingResult={calc.cuttingResult !== null}
            />

            <CalculateCenterCanvas
              canvasRef={calc.canvasRef}
              zoom={calc.zoom}
              setZoom={calc.setZoom}
              showDimensions={calc.showDimensions}
              setShowDimensions={calc.setShowDimensions}
              currentSheet={calc.currentSheet}
              sheetWidth={calc.sheetWidth}
              sheetHeight={calc.sheetHeight}
              onAddToCart={() => void calc.addToCart()}
              addingToCart={calc.addingToCart}
              canAddToCart={calc.canAddToCart}
              rotation={calc.rotation}
              setRotation={calc.setRotation}
              onDownloadPdf={() => void calc.downloadPdf()}
              generatingPdf={calc.generatingPdf}
              canDownloadPdf={calc.canDownloadPdf}
              pdfError={calc.pdfError}
            />

            <CalculateRightPanel
              sheets={calc.sheets}
              activeSheet={calc.activeSheet}
              setActiveSheet={calc.setActiveSheet}
              pieces={calc.pieces}
              updatePiece={calc.updatePiece}
              removePiece={calc.removePiece}
              addPiece={calc.addPiece}
              edgeOffsetX={calc.edgeOffsetX}
              setEdgeOffsetX={calc.setEdgeOffsetX}
              edgeOffsetY={calc.edgeOffsetY}
              setEdgeOffsetY={calc.setEdgeOffsetY}
              newSheetNotice={calc.newSheetNotice}
              onDismissNewSheetNotice={calc.dismissNewSheetNotice}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
