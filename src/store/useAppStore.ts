import { create } from 'zustand';
import type {
  PropertyInfo,
  Room,
  DeliverySpec,
  Photo,
  Measurement,
  FurnishingItem,
  DesignScheme,
} from '../types';
import { defaultRooms } from '../data/rooms';

const defaultFurnishingItems: FurnishingItem[] = [
  // 玄关
  {
    id: 'default-entrance-shoe-cabinet',
    roomId: 'entrance',
    name: '鞋柜',
    category: '柜体',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: null,
    budgetMax: null,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '精装不含玄关柜，全屋定制',
    referenceImages: [],
    pricingMode: 'custom',
    cabinetWidth: 1200,
    cabinetHeight: 2400,
    boardType: 'ENF级颗粒板',
    unitPrice: 1500,
  },
  {
    id: 'default-entrance-mirror',
    roomId: 'entrance',
    name: '穿衣镜',
    category: '镜类',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 500,
    budgetMax: 2000,
    actualPrice: null,
    priority: 'recommended',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-entrance-floor-mat',
    roomId: 'entrance',
    name: '入户地垫',
    category: '地垫',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 200,
    budgetMax: 800,
    actualPrice: null,
    priority: 'optional',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  // 客餐厅
  {
    id: 'default-living-sofa',
    roomId: 'living',
    name: '三人位沙发',
    category: '沙发',
    sizeRequirement: '',
    materialRequirement: '真皮/高端布艺',
    colorRequirement: '米白/浅灰/深咖',
    styleRequirement: '现代轻奢',
    brandPreference: '',
    budgetMin: 15000,
    budgetMax: 40000,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-living-coffee-table',
    roomId: 'living',
    name: '茶几',
    category: '茶几',
    sizeRequirement: '',
    materialRequirement: '岩板/大理石台面+金属框架',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 3000,
    budgetMax: 10000,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-living-tv-cabinet',
    roomId: 'living',
    name: '电视柜',
    category: '电视柜',
    sizeRequirement: '',
    materialRequirement: '与背景墙协调',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: null,
    budgetMax: null,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '全屋定制',
    referenceImages: [],
    pricingMode: 'custom',
    cabinetWidth: 2400,
    cabinetHeight: 400,
    boardType: 'ENF级颗粒板',
    unitPrice: 1500,
  },
  {
    id: 'default-living-dining-table',
    roomId: 'living',
    name: '餐桌(圆桌)',
    category: '餐桌',
    sizeRequirement: '直径1.3-1.5m',
    materialRequirement: '岩板/大理石台面',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 8000,
    budgetMax: 20000,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-living-dining-chairs',
    roomId: 'living',
    name: '餐椅',
    category: '餐椅',
    sizeRequirement: '6-8把',
    materialRequirement: '真皮/高端绒布',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 6000,
    budgetMax: 15000,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-living-curtain',
    roomId: 'living',
    name: '客厅窗帘',
    category: '窗帘',
    sizeRequirement: '',
    materialRequirement: '遮光帘+纱帘双层',
    colorRequirement: '米色/香槟色',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 5000,
    budgetMax: 12000,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-living-rug',
    roomId: 'living',
    name: '客厅地毯',
    category: '地毯',
    sizeRequirement: '',
    materialRequirement: '手工羊毛/真丝混纺',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 3000,
    budgetMax: 8000,
    actualPrice: null,
    priority: 'recommended',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-living-chandelier',
    roomId: 'living',
    name: '餐厅吊灯',
    category: '灯具',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '水晶/金属质感',
    brandPreference: '',
    budgetMin: 3000,
    budgetMax: 10000,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-living-art',
    roomId: 'living',
    name: '装饰画',
    category: '装饰画',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 2000,
    budgetMax: 8000,
    actualPrice: null,
    priority: 'recommended',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-living-plants',
    roomId: 'living',
    name: '绿植',
    category: '绿植',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 500,
    budgetMax: 3000,
    actualPrice: null,
    priority: 'optional',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  // 主卧
  {
    id: 'default-master-bed-frame',
    roomId: 'masterBedroom',
    name: '主卧床架',
    category: '床',
    sizeRequirement: '1.8m',
    materialRequirement: '真皮/布艺高背床',
    colorRequirement: '深咖/米白',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 8000,
    budgetMax: 20000,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-master-mattress',
    roomId: 'masterBedroom',
    name: '主卧床垫',
    category: '床垫',
    sizeRequirement: '1.8m',
    materialRequirement: '独立袋装弹簧/乳胶',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 8000,
    budgetMax: 25000,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-master-nightstand',
    roomId: 'masterBedroom',
    name: '床头柜(2个)',
    category: '床头柜',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 2000,
    budgetMax: 6000,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-master-curtain',
    roomId: 'masterBedroom',
    name: '主卧窗帘',
    category: '窗帘',
    sizeRequirement: '',
    materialRequirement: '遮光帘+纱帘',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 3000,
    budgetMax: 8000,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-master-wardrobe',
    roomId: 'masterBedroom',
    name: '主卧衣柜',
    category: '衣柜',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: null,
    budgetMax: null,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '精装不含衣柜，全屋定制',
    referenceImages: [],
    pricingMode: 'custom',
    cabinetWidth: 3000,
    cabinetHeight: 2400,
    boardType: 'ENF级颗粒板',
    unitPrice: 1500,
  },
  // 次卧
  {
    id: 'default-second-bed-frame',
    roomId: 'secondBedroom',
    name: '次卧床架',
    category: '床',
    sizeRequirement: '1.5m',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 5000,
    budgetMax: 12000,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-second-mattress',
    roomId: 'secondBedroom',
    name: '次卧床垫',
    category: '床垫',
    sizeRequirement: '1.5m',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 5000,
    budgetMax: 15000,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-second-nightstand',
    roomId: 'secondBedroom',
    name: '床头柜(2个)',
    category: '床头柜',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 1500,
    budgetMax: 4000,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-second-curtain',
    roomId: 'secondBedroom',
    name: '次卧窗帘',
    category: '窗帘',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 2000,
    budgetMax: 5000,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-second-wardrobe',
    roomId: 'secondBedroom',
    name: '次卧衣柜',
    category: '衣柜',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: null,
    budgetMax: null,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '精装不含衣柜，全屋定制',
    referenceImages: [],
    pricingMode: 'custom',
    cabinetWidth: 2400,
    cabinetHeight: 2400,
    boardType: 'ENF级颗粒板',
    unitPrice: 1500,
  },
  // 书房
  {
    id: 'default-study-desk',
    roomId: 'study',
    name: '书桌',
    category: '书桌',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 3000,
    budgetMax: 8000,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-study-chair',
    roomId: 'study',
    name: '书椅',
    category: '书椅',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 2000,
    budgetMax: 6000,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  {
    id: 'default-study-curtain',
    roomId: 'study',
    name: '书房窗帘',
    category: '窗帘',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 2000,
    budgetMax: 5000,
    actualPrice: null,
    priority: 'recommended',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
  // 阳台
  {
    id: 'default-balcony-drying-rack',
    roomId: 'balcony',
    name: '晾衣架',
    category: '晾衣架',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 800,
    budgetMax: 3000,
    actualPrice: null,
    priority: 'must',
    status: 'pending',
    matchingNotes: '',
    notes: '电动晾衣架',
    referenceImages: [],
  },
  {
    id: 'default-balcony-lounge-chair',
    roomId: 'balcony',
    name: '休闲椅',
    category: '休闲椅',
    sizeRequirement: '',
    materialRequirement: '',
    colorRequirement: '',
    styleRequirement: '',
    brandPreference: '',
    budgetMin: 2000,
    budgetMax: 6000,
    actualPrice: null,
    priority: 'optional',
    status: 'pending',
    matchingNotes: '',
    notes: '',
    referenceImages: [],
  },
];

// API 基础地址：开发时走本地，部署后走同域
const API_BASE = import.meta.env.VITE_API_URL || '';

// 防抖保存
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let isComposing = false; // IME 组合输入中，延迟保存

export function setComposing(value: boolean) {
  isComposing = value;
}

let saveError = false;

async function debouncedSave(data: AppData) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    // IME 组合输入中，延迟保存避免中间拼音被持久化
    if (isComposing) {
      debouncedSave(data);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/data`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        saveError = false;
      } else {
        saveError = true;
        console.error('自动保存失败: HTTP', res.status);
      }
    } catch (err) {
      saveError = true;
      console.error('自动保存失败:', err);
    }
  }, 1000);
}

export function isSaveError() {
  return saveError;
}

interface AppData {
  property: PropertyInfo;
  rooms: Room[];
  deliverySpecs: Record<string, DeliverySpec[]>;
  photos: Record<string, Photo[]>;
  measurements: Record<string, Measurement[]>;
  furnishingItems: FurnishingItem[];
  designSchemes: DesignScheme[];
  budgetTarget: number;
}

interface AppStore extends AppData {
  loaded: boolean;

  // 房屋档案操作
  updateProperty: (data: Partial<PropertyInfo>) => void;

  // 精装交付标准操作
  updateDeliverySpec: (roomId: string, specId: string, data: Partial<DeliverySpec>) => void;
  setDeliverySpecs: (roomId: string, specs: DeliverySpec[]) => void;

  // 照片操作
  addPhoto: (roomId: string, photo: Photo) => void;
  removePhoto: (roomId: string, photoId: string) => void;
  updatePhoto: (roomId: string, photoId: string, data: Partial<Photo>) => void;

  // 尺寸测量操作
  addMeasurement: (roomId: string, measurement: Measurement) => void;
  updateMeasurement: (roomId: string, measurementId: string, data: Partial<Measurement>) => void;
  removeMeasurement: (roomId: string, measurementId: string) => void;

  // 软装清单操作
  addFurnishingItem: (item: FurnishingItem) => void;
  updateFurnishingItem: (id: string, data: Partial<FurnishingItem>) => void;
  removeFurnishingItem: (id: string) => void;

  // 设计方案操作
  addDesignScheme: (scheme: DesignScheme) => void;
  updateDesignScheme: (id: string, data: Partial<DesignScheme>) => void;
  removeDesignScheme: (id: string) => void;

  // 软装总预算操作
  updateBudgetTarget: (amount: number) => void;

  // 数据导入导出
  exportData: () => string;
  importData: (json: string) => void;

  // 从服务器加载数据
  loadFromServer: () => Promise<void>;
}

const defaultProperty: PropertyInfo = {
  id: 'zhongtian-yangzhu',
  name: '中天·央著',
  location: '大连市中山区东港商务区',
  area: 142.31,
  floor: '5楼',
  totalPrice: 3823301,
  deposit: 100000,
  depositDate: '2026-06-09',
  deliveryDate: '2026-12-31',
  deliveryStandard: '精装修',
  privateElevator: true,
  panoramicWindow: true,
  unitType: '143㎡ 三室三卫（边户）',
};

function triggerSave(state: AppData) {
  const data: AppData = {
    property: state.property,
    rooms: state.rooms,
    deliverySpecs: state.deliverySpecs,
    photos: state.photos,
    measurements: state.measurements,
    furnishingItems: state.furnishingItems,
    designSchemes: state.designSchemes,
    budgetTarget: state.budgetTarget,
  };
  debouncedSave(data);
}

export const useAppStore = create<AppStore>()((set, get) => ({
  loaded: false,
  property: defaultProperty,
  rooms: defaultRooms,
  deliverySpecs: {},
  photos: {},
  measurements: {},
  furnishingItems: defaultFurnishingItems,
  designSchemes: [],
  budgetTarget: 150000,

  // 从服务器加载数据
  loadFromServer: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/data`);
      if (res.ok) {
        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
          set({
            property: data.property ?? defaultProperty,
            rooms: data.rooms ?? defaultRooms,
            deliverySpecs: data.deliverySpecs ?? {},
            photos: data.photos ?? {},
            measurements: data.measurements ?? {},
            furnishingItems: data.furnishingItems ?? defaultFurnishingItems,
            designSchemes: data.designSchemes ?? [],
            budgetTarget: data.budgetTarget ?? 150000,
            loaded: true,
          });
          return;
        }
      }
    } catch (err) {
      console.error('从服务器加载数据失败，使用本地默认值:', err);
    }
    set({ loaded: true });
  },

  // 房屋档案操作
  updateProperty: (data) =>
    set((state) => {
      const next = { property: { ...state.property, ...data } };
      triggerSave({ ...state, ...next });
      return next;
    }),

  // 精装交付标准操作
  updateDeliverySpec: (roomId, specId, data) =>
    set((state) => {
      const roomSpecs = state.deliverySpecs[roomId] || [];
      const next = {
        deliverySpecs: {
          ...state.deliverySpecs,
          [roomId]: roomSpecs.map((spec) =>
            spec.id === specId ? { ...spec, ...data } : spec
          ),
        },
      };
      triggerSave({ ...state, ...next });
      return next;
    }),

  setDeliverySpecs: (roomId, specs) =>
    set((state) => {
      const next = {
        deliverySpecs: {
          ...state.deliverySpecs,
          [roomId]: specs,
        },
      };
      triggerSave({ ...state, ...next });
      return next;
    }),

  // 照片操作
  addPhoto: (roomId, photo) =>
    set((state) => {
      const roomPhotos = state.photos[roomId] || [];
      const next = {
        photos: {
          ...state.photos,
          [roomId]: [...roomPhotos, photo],
        },
      };
      triggerSave({ ...state, ...next });
      return next;
    }),

  removePhoto: (roomId, photoId) =>
    set((state) => {
      const roomPhotos = state.photos[roomId] || [];
      const next = {
        photos: {
          ...state.photos,
          [roomId]: roomPhotos.filter((p) => p.id !== photoId),
        },
      };
      triggerSave({ ...state, ...next });
      return next;
    }),

  updatePhoto: (roomId, photoId, data) =>
    set((state) => {
      const roomPhotos = state.photos[roomId] || [];
      const next = {
        photos: {
          ...state.photos,
          [roomId]: roomPhotos.map((p) =>
            p.id === photoId ? { ...p, ...data } : p
          ),
        },
      };
      triggerSave({ ...state, ...next });
      return next;
    }),

  // 尺寸测量操作
  addMeasurement: (roomId, measurement) =>
    set((state) => {
      const roomMeasurements = state.measurements[roomId] || [];
      const next = {
        measurements: {
          ...state.measurements,
          [roomId]: [...roomMeasurements, measurement],
        },
      };
      triggerSave({ ...state, ...next });
      return next;
    }),

  updateMeasurement: (roomId, measurementId, data) =>
    set((state) => {
      const roomMeasurements = state.measurements[roomId] || [];
      const next = {
        measurements: {
          ...state.measurements,
          [roomId]: roomMeasurements.map((m) =>
            m.id === measurementId ? { ...m, ...data } : m
          ),
        },
      };
      triggerSave({ ...state, ...next });
      return next;
    }),

  removeMeasurement: (roomId, measurementId) =>
    set((state) => {
      const roomMeasurements = state.measurements[roomId] || [];
      const next = {
        measurements: {
          ...state.measurements,
          [roomId]: roomMeasurements.filter((m) => m.id !== measurementId),
        },
      };
      triggerSave({ ...state, ...next });
      return next;
    }),

  // 软装清单操作
  addFurnishingItem: (item) =>
    set((state) => {
      const next = { furnishingItems: [...state.furnishingItems, item] };
      triggerSave({ ...state, ...next });
      return next;
    }),

  updateFurnishingItem: (id, data) =>
    set((state) => {
      const next = {
        furnishingItems: state.furnishingItems.map((item) =>
          item.id === id ? { ...item, ...data } : item
        ),
      };
      triggerSave({ ...state, ...next });
      return next;
    }),

  removeFurnishingItem: (id) =>
    set((state) => {
      const next = {
        furnishingItems: state.furnishingItems.filter((item) => item.id !== id),
      };
      triggerSave({ ...state, ...next });
      return next;
    }),

  // 设计方案操作
  addDesignScheme: (scheme) =>
    set((state) => {
      const next = { designSchemes: [...state.designSchemes, scheme] };
      triggerSave({ ...state, ...next });
      return next;
    }),

  updateDesignScheme: (id, data) =>
    set((state) => {
      const next = {
        designSchemes: state.designSchemes.map((scheme) =>
          scheme.id === id ? { ...scheme, ...data } : scheme
        ),
      };
      triggerSave({ ...state, ...next });
      return next;
    }),

  removeDesignScheme: (id) =>
    set((state) => {
      const next = {
        designSchemes: state.designSchemes.filter((scheme) => scheme.id !== id),
      };
      triggerSave({ ...state, ...next });
      return next;
    }),

  updateBudgetTarget: (amount) =>
    set((state) => {
      const next = { budgetTarget: amount };
      triggerSave({ ...state, ...next });
      return next;
    }),

  // 数据导入导出
  exportData: () => {
    const state = get();
    const exportObj = {
      property: state.property,
      rooms: state.rooms,
      deliverySpecs: state.deliverySpecs,
      photos: state.photos,
      measurements: state.measurements,
      furnishingItems: state.furnishingItems,
      designSchemes: state.designSchemes,
      budgetTarget: state.budgetTarget,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
    return JSON.stringify(exportObj, null, 2);
  },

  importData: (json) => {
    try {
      const data = JSON.parse(json);
      const state = get();

      // Merge deliverySpecs: import overwrites existing keys, preserves keys not in import
      const mergedDeliverySpecs = { ...state.deliverySpecs };
      if (data.deliverySpecs) {
        for (const [roomId, specs] of Object.entries(data.deliverySpecs)) {
          mergedDeliverySpecs[roomId] = specs as DeliverySpec[];
        }
      }

      // Merge photos: import overwrites existing keys, preserves keys not in import
      const mergedPhotos = { ...state.photos };
      if (data.photos) {
        for (const [roomId, photos] of Object.entries(data.photos)) {
          mergedPhotos[roomId] = photos as Photo[];
        }
      }

      // Merge measurements: same approach
      const mergedMeasurements = { ...state.measurements };
      if (data.measurements) {
        for (const [roomId, measurements] of Object.entries(data.measurements)) {
          mergedMeasurements[roomId] = measurements as Measurement[];
        }
      }

      // Merge furnishingItems: add new items, update existing by id
      const mergedItems = [...state.furnishingItems];
      if (data.furnishingItems?.length) {
        for (const item of data.furnishingItems) {
          const idx = mergedItems.findIndex((i) => i.id === item.id);
          if (idx >= 0) {
            mergedItems[idx] = item;
          } else {
            mergedItems.push(item);
          }
        }
      }

      // Merge designSchemes: add new, update existing by id
      const mergedSchemes = [...state.designSchemes];
      if (data.designSchemes?.length) {
        for (const scheme of data.designSchemes) {
          const idx = mergedSchemes.findIndex((s) => s.id === scheme.id);
          if (idx >= 0) {
            mergedSchemes[idx] = scheme;
          } else {
            mergedSchemes.push(scheme);
          }
        }
      }

      const next = {
        property: data.property || state.property,
        rooms: data.rooms || state.rooms,
        deliverySpecs: mergedDeliverySpecs,
        photos: mergedPhotos,
        measurements: mergedMeasurements,
        furnishingItems: mergedItems,
        designSchemes: mergedSchemes,
        budgetTarget: data.budgetTarget || state.budgetTarget,
      };
      set(next);
      triggerSave({ ...get(), ...next });
    } catch {
      console.error('导入数据失败：JSON格式无效');
    }
  },
}));

// 页面关闭前尝试保存未持久化的数据
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (saveTimer) {
      clearTimeout(saveTimer);
      const state = useAppStore.getState();
      const data = JSON.stringify({
        property: state.property,
        rooms: state.rooms,
        deliverySpecs: state.deliverySpecs,
        photos: state.photos,
        measurements: state.measurements,
        furnishingItems: state.furnishingItems,
        designSchemes: state.designSchemes,
        budgetTarget: state.budgetTarget,
      });
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', `${API_BASE}/api/data`, false); // synchronous
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(data);
      } catch (e) {
        // Best effort - can't block page close
      }
    }
  });
}
