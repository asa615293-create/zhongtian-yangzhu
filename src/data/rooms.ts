import { Room } from '../types';

export const defaultRooms: Room[] = [
  { id: 'entrance', name: '玄关', type: 'entrance', sortOrder: 0, icon: 'DoorOpen' },
  { id: 'living', name: '客餐厅', type: 'living', sortOrder: 1, icon: 'Sofa' },
  { id: 'kitchen', name: '厨房', type: 'kitchen', sortOrder: 2, icon: 'ChefHat' },
  { id: 'masterBedroom', name: '主卧', type: 'masterBedroom', sortOrder: 3, icon: 'BedDouble' },
  { id: 'secondBedroom', name: '次卧', type: 'secondBedroom', sortOrder: 4, icon: 'BedSingle' },
  { id: 'study', name: '书房', type: 'study', sortOrder: 5, icon: 'BookOpen' },
  { id: 'bathroom1', name: '主卫', type: 'bathroom1', sortOrder: 6, icon: 'Bath' },
  { id: 'bathroom2', name: '次卫', type: 'bathroom2', sortOrder: 7, icon: 'Bath' },
  { id: 'bathroom3', name: '公卫', type: 'bathroom3', sortOrder: 8, icon: 'Bath' },
  { id: 'balcony', name: '阳台', type: 'balcony', sortOrder: 9, icon: 'Sun' },
];
