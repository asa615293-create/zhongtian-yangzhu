import React, { useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { FurnishingItem } from '@/types';

interface AddItemFormProps {
  roomId: string;
  onClose: () => void;
}

const generateId = () =>
  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const categories = ['沙发', '床', '餐桌', '椅子', '茶几', '电视柜', '书桌', '衣柜', '窗帘', '灯具', '地毯', '挂画', '绿植', '家电', '其他'];

const AddItemForm: React.FC<AddItemFormProps> = ({ roomId, onClose }) => {
  const rooms = useAppStore((s) => s.rooms);
  const addFurnishingItem = useAppStore((s) => s.addFurnishingItem);

  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [selectedRoomId, setSelectedRoomId] = useState(roomId);

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
              placeholder="例如：三人位沙发"
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
