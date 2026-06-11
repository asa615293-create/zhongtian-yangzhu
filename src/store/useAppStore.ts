import { create } from 'zustand';
import type {
  PropertyInfo,
  Room,
  DeliverySpec,
  Photo,
  Measurement,
  FurnishingItem,
  DesignScheme,
  BudgetRecord,
} from '../types';
import { defaultRooms } from '../data/rooms';

// API 基础地址：开发时走本地，部署后走同域
const API_BASE = import.meta.env.VITE_API_URL || '';

// 防抖保存
let saveTimer: ReturnType<typeof setTimeout> | null = null;

async function debouncedSave(data: AppData) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await fetch(`${API_BASE}/api/data`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error('自动保存失败:', err);
    }
  }, 1000);
}

interface AppData {
  property: PropertyInfo;
  rooms: Room[];
  deliverySpecs: Record<string, DeliverySpec[]>;
  photos: Record<string, Photo[]>;
  measurements: Record<string, Measurement[]>;
  furnishingItems: FurnishingItem[];
  designSchemes: DesignScheme[];
  budgetRecords: BudgetRecord[];
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

  // 预算记录操作
  addBudgetRecord: (record: BudgetRecord) => void;
  updateBudgetRecord: (id: string, data: Partial<BudgetRecord>) => void;
  removeBudgetRecord: (id: string) => void;

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
    budgetRecords: state.budgetRecords,
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
  furnishingItems: [],
  designSchemes: [],
  budgetRecords: [],

  // 从服务器加载数据
  loadFromServer: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/data`);
      if (res.ok) {
        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
          set({
            property: data.property || defaultProperty,
            rooms: data.rooms || defaultRooms,
            deliverySpecs: data.deliverySpecs || {},
            photos: data.photos || {},
            measurements: data.measurements || {},
            furnishingItems: data.furnishingItems || [],
            designSchemes: data.designSchemes || [],
            budgetRecords: data.budgetRecords || [],
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

  // 预算记录操作
  addBudgetRecord: (record) =>
    set((state) => {
      const next = { budgetRecords: [...state.budgetRecords, record] };
      triggerSave({ ...state, ...next });
      return next;
    }),

  updateBudgetRecord: (id, data) =>
    set((state) => {
      const next = {
        budgetRecords: state.budgetRecords.map((record) =>
          record.id === id ? { ...record, ...data } : record
        ),
      };
      triggerSave({ ...state, ...next });
      return next;
    }),

  removeBudgetRecord: (id) =>
    set((state) => {
      const next = {
        budgetRecords: state.budgetRecords.filter((record) => record.id !== id),
      };
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
      budgetRecords: state.budgetRecords,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
    return JSON.stringify(exportObj, null, 2);
  },

  importData: (json) => {
    try {
      const data = JSON.parse(json);
      const next = {
        property: data.property || defaultProperty,
        rooms: data.rooms || defaultRooms,
        deliverySpecs: data.deliverySpecs || {},
        photos: data.photos || {},
        measurements: data.measurements || {},
        furnishingItems: data.furnishingItems || [],
        designSchemes: data.designSchemes || [],
        budgetRecords: data.budgetRecords || [],
      };
      set(next);
      triggerSave({ ...get(), ...next });
    } catch {
      console.error('导入数据失败：JSON格式无效');
    }
  },
}));
