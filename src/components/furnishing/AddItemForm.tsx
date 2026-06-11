import React, { useState, useEffect, useMemo } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { FurnishingItem } from '@/types';

interface AddItemFormProps {
  roomId: string;
  onClose: () => void;
}

const generateId = () =>
  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// 按空间推荐品类映射
const roomCategoryMap: Record<string, string[]> = {
  entrance: ['鞋柜', '挂画', '灯具', '地垫', '穿衣镜', '衣帽架', '其他'],
  living: ['沙发', '茶几', '电视柜', '餐桌', '餐椅', '窗帘', '灯具', '地毯', '挂画', '绿植', '装饰摆件', '其他'],
  kitchen: ['其他'],
  masterBedroom: ['床', '床垫', '床头柜', '衣柜', '窗帘', '灯具', '挂画', '绿植', '其他'],
  secondBedroom: ['床', '床垫', '床头柜', '衣柜', '窗帘', '灯具', '其他'],
  study: ['书桌', '书柜', '椅子', '灯具', '窗帘', '其他'],
  bathroom1: ['浴巾架', '镜前灯', '其他'],
  bathroom2: ['浴巾架', '镜前灯', '其他'],
  bathroom3: ['浴巾架', '镜前灯', '其他'],
  balcony: ['晾衣架', '绿植', '休闲椅', '其他'],
};

// 所有品类合集（去重）
const allCategories = [
  '鞋柜', '沙发', '茶几', '电视柜', '餐桌', '餐椅', '床', '床垫', '床头柜',
  '衣柜', '书桌', '书柜', '椅子', '窗帘', '灯具', '地毯', '挂画', '绿植',
  '装饰摆件', '浴巾架', '镜前灯', '穿衣镜', '衣帽架', '地垫', '晾衣架', '休闲椅', '其他',
];

// 每个品类的placeholder
const categoryPlaceholderMap: Record<string, string> = {
  '鞋柜': '例如：玄关翻斗鞋柜',
  '沙发': '例如：三人位真皮沙发',
  '茶几': '例如：岩板圆形茶几',
  '电视柜': '例如：悬浮式电视柜',
  '餐桌': '例如：1.4m岩板餐桌',
  '餐椅': '例如：皮质餐椅×4',
  '床': '例如：1.8m真皮床架',
  '床垫': '例如：1.8m乳胶床垫',
  '床头柜': '例如：双人床头柜×2',
  '衣柜': '例如：到顶定制衣柜',
  '书桌': '例如：1.2m实木书桌',
  '书柜': '例如：开放式书柜',
  '椅子': '例如：人体工学椅',
  '窗帘': '例如：客厅遮光帘+纱帘',
  '灯具': '例如：餐厅吊灯',
  '地毯': '例如：客厅2m×3m地毯',
  '挂画': '例如：抽象装饰画',
  '绿植': '例如：龟背竹盆栽',
  '装饰摆件': '例如：陶瓷花瓶',
  '浴巾架': '例如：不锈钢浴巾架',
  '镜前灯': '例如：LED镜前灯',
  '穿衣镜': '例如：全身穿衣镜',
  '衣帽架': '例如：落地衣帽架',
  '地垫': '例如：玄关进门地垫',
  '晾衣架': '例如：升降晾衣架',
  '休闲椅': '例如：阳台藤编休闲椅',
  '其他': '例如：装饰品',
};

const AddItemForm: React.FC<AddItemFormProps> = ({ roomId, onClose }) => {
  const rooms = useAppStore((s) => s.rooms);
  const addFurnishingItem = useAppStore((s) => s.addFurnishingItem);

  const [name, setName] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState(roomId);

  // 根据空间获取推荐品类列表
  const categories = useMemo(() => {
    return roomCategoryMap[selectedRoomId] || allCategories;
  }, [selectedRoomId]);

  const [category, setCategory] = useState(categories[0]);

  // 当切换空间时，如果当前品类不在新空间的推荐列表中，自动切换为第一个
  useEffect(() => {
    if (!categories.includes(category)) {
      setCategory(categories[0]);
    }
  }, [selectedRoomId, categories]);

  // 根据品类获取placeholder
  const placeholder = categoryPlaceholderMap[category] || '例如：物品名称';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: FurnishingItem = {
      id: generateId(),
      roomId: selectedRoomId,
      name: name.trim(),
      category,
      sizeRequirement: '',
      materialRequirement: '',
      colorRequirement: '',
      styleRequirement: '',
      brandPreference: '',
      budgetMin: null,
      budgetMax: null,
      actualPrice: null,
      priority: 'recommended',
      status: 'pending',
      matchingNotes: '',
      notes: '',
      referenceImages: [],
    };

    addFurnishingItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - bottom sheet on mobile, centered on desktop */}
      <div className="relative w-full md:max-w-md bg-bg-secondary border-t md:border border-border-subtle rounded-t-2xl md:rounded-xl p-5 md:p-6 slide-up max-h-[85vh] md:max-h-none overflow-y-auto">
        {/* Handle bar - mobile only */}
        <div className="w-10 h-1 bg-text-muted/30 rounded-full mx-auto mb-4 md:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-display font-semibold text-text-primary">添加物品</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="form-group">
            <label className="form-label">物品名称 *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={placeholder}
              className="form-input w-full"
              autoFocus
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">品类</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-input w-full appearance-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Room */}
          <div className="form-group">
            <label className="form-label">所属空间</label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="form-input w-full appearance-none"
            >
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 py-3"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              添加
            </button>
          </div>

          <p className="text-xs text-text-muted text-center">
            其他信息可在添加后编辑详情补充
          </p>
        </form>
      </div>
    </div>
  );
};

export default AddItemForm;
