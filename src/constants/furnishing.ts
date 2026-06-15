import type { FurnishingItem } from '@/types';

export const statusLabels: Record<FurnishingItem['status'], string> = {
  pending: '待选',
  selected: '已选',
  purchased: '已购',
  installed: '已安装',
};

export const priorityLabels: Record<FurnishingItem['priority'], string> = {
  must: '必买',
  recommended: '建议买',
  optional: '可选',
};

export const cabinetCategories = ['柜体', '衣柜', '电视柜', '鞋柜', '书柜', '餐边柜', '阳台柜', '储物柜'];

export const isCabinetCategory = (category: string) => cabinetCategories.includes(category);

export const boardTypeOptions = [
  'E0级颗粒板 (700-1100元/㎡)',
  'ENF级颗粒板 (1200-1600元/㎡)',
  'E0级多层实木板 (1400-1800元/㎡)',
  'ENF级多层实木板 (1600-2000元/㎡)',
  '实木贴皮板 (2000-3000元/㎡)',
  '纯实木 (3000-4000元/㎡)',
];

export const boardTypePriceMap: Record<string, [number, number]> = {
  'E0级颗粒板 (700-1100元/㎡)': [700, 1100],
  'ENF级颗粒板 (1200-1600元/㎡)': [1200, 1600],
  'E0级多层实木板 (1400-1800元/㎡)': [1400, 1800],
  'ENF级多层实木板 (1600-2000元/㎡)': [1600, 2000],
  '实木贴皮板 (2000-3000元/㎡)': [2000, 3000],
  '纯实木 (3000-4000元/㎡)': [3000, 4000],
};
