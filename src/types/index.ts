export interface PropertyInfo {
  id: string;
  name: string;
  location: string;
  area: number;
  floor: string;
  totalPrice: number;
  deposit: number;
  depositDate: string;
  deliveryDate: string;
  deliveryStandard: string;
  privateElevator: boolean;
  panoramicWindow: boolean;
  unitType: string;
}

export interface Room {
  id: string;
  name: string;
  type: 'entrance' | 'living' | 'kitchen' | 'masterBedroom' | 'secondBedroom' | 'study' | 'bathroom1' | 'bathroom2' | 'bathroom3' | 'balcony';
  sortOrder: number;
  icon: string;
}

export interface DeliverySpec {
  id: string;
  roomId: string;
  category: string;
  fieldKey: string;
  fieldLabel: string;
  value: string;
  notes: string;
}

export interface Photo {
  id: string;
  roomId: string;
  category: string;
  base64Data: string;
  takenDate: string;
  notes: string;
}

export interface Measurement {
  id: string;
  roomId: string;
  wallName: string;
  width: number | null;
  height: number | null;
  notes: string;
}

export interface FurnishingItem {
  id: string;
  roomId: string;
  name: string;
  category: string;
  sizeRequirement: string;
  materialRequirement: string;
  colorRequirement: string;
  styleRequirement: string;
  brandPreference: string;
  budgetMin: number | null;
  budgetMax: number | null;
  actualPrice: number | null;
  priority: 'must' | 'recommended' | 'optional';
  status: 'pending' | 'selected' | 'purchased' | 'installed';
  matchingNotes: string;
  notes: string;
  referenceImages: ReferenceImage[];
  // 全屋定制专用字段
  pricingMode?: 'standard' | 'custom'; // standard=标准预算区间, custom=全屋定制投影面积计价
  cabinetWidth?: number | null;  // 柜体宽度(mm)
  cabinetHeight?: number | null; // 柜体高度(mm)
  boardType?: string;  // 板材类型
  unitPrice?: number | null;  // 投影面积单价(元/㎡)
}

export interface ReferenceImage {
  id: string;
  itemId: string;
  base64Data: string;
  notes: string;
}

export interface DesignScheme {
  id: string;
  type: 'style' | 'color' | 'space' | 'reference';
  title: string;
  description: string;
  keywords: string;
  base64Data: string;
  colorValues: string;
  roomId: string;
  notes: string;
}


