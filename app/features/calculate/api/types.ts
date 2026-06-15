export type SheetFormat = {
  id: number;
  name: string;
  width_mm: number;
  height_mm: number;
};

export type Material = {
  id: number;
  name: string;
  type: string;
  density: number;
};

export type ThicknessOption = {
  id: number;
  value_mm: number;
};

export type BladeWidthOption = {
  id: number;
  value_mm: number;
};

export type CalculatorStaticData = {
  formats: SheetFormat[];
  materials: Material[];
  thickness: ThicknessOption[];
  blade_widths: BladeWidthOption[];
};

export type CuttingPart = {
  width: number;
  height: number;
  quantity: number;
};

export type CuttingRequest = {
  sheet_width: number;
  sheet_height: number;
  parts: CuttingPart[];
  blade_width_id: number;
  thickness_id: number;
  material_id: number;
};

export type CuttingResponse = {
  success: boolean;
  sheets_used: number;
  total_cut_length: number;
  total_parts: number;
  waste_area: number;
  price_per_meter: number;
  total_price: number;
};
