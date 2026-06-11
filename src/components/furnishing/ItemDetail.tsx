import React, { useState, useRef } from 'react';
import { X, Trash2, Upload, ChevronLeft } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { FurnishingItem, ReferenceImage } from '@/types';
import FormField from '@/components/common/FormField';

interface ItemDetailProps {
  item: FurnishingItem;
  onClose: () => void;
}

const categories = ['沙发', '床', '餐桌', '椅子', '茶几', '电视柜', '书桌', '衣柜', '窗帘', '灯具', '地毯', '挂画', '绿植', '家电', '其他'];

const priorityOptions: { value: FurnishingItem['priority']; label: string }[] = [
  { value: 'must', label: '必买' },
  { value: 'recommended', label: '建议买' },
  { value: 'optional', label: '可选' },
];

const statusOptions: { value: FurnishingItem['status']; label: string }[] = [
  { value: 'pending', label: '待选' },
  { value: 'selected', label: '已选' },
  { value: 'purchased', label: '已购' },
  { value: 'installed', label: '已安装' },
];

const generateId = () =>
  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const compressImage = (base64Data: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      const MAX_DIMENSION = 1920;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(base64Data); return; }
      ctx.drawImage(img, 0, 0, width, height);
      let quality = 0.8;
      let result = canvas.toDataURL('image/jpeg', quality);
      while (result.length > MAX_FILE_SIZE && quality > 0.1) {
        quality -= 0.1;
        result = canvas.toDataURL('image/jpeg', quality);
      }
      resolve(result);
    };
    img.onerror = () => resolve(base64Data);
    img.src = base64Data;
  });
};

const ItemDetail: React.FC<ItemDetailProps> = ({ item, onClose }) => {
  const rooms = useAppStore((s) => s.rooms);
  const updateFurnishingItem = useAppStore((s) => s.updateFurnishingItem);
  const removeFurnishingItem = useAppStore((s) => s.removeFurnishingItem);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (data: Partial<FurnishingItem>) => {
    updateFurnishingItem(item.id, data);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      removeFurnishingItem(item.id);
      onClose();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      const compressed = await compressImage(base64Data);
      const newImage: ReferenceImage = {
        id: generateId(),
        itemId: item.id,
        base64Data: compressed,
        notes: '',
      };
      update({ referenceImages: [...item.referenceImages, newImage] });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveImage = (imageId: string) => {
    update({ referenceImages: item.referenceImages.filter((img) => img.id !== imageId) });
  };

  const handleUpdateImageNotes = (imageId: string, notes: string) => {
    update({
      referenceImages: item.referenceImages.map((img) =>
        img.id === imageId ? { ...img, notes } : img
      ),
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel - full screen on mobile, side panel on desktop */}
      <div className="relative w-full md:w-[480px] h-full bg-bg-secondary border-l border-border-subtle slide-in-right flex flex-col md:absolute md:right-0 md:top-0 md:bottom-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-border-subtle">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              onClick={onClose}
              className="p-2 -ml-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-card transition-colors flex-shrink-0 md:hidden"
            >
              <ChevronLeft size={22} />
            </button>
            <h3 className="text-lg font-display font-semibold text-text-primary truncate">
              {item.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-card transition-colors flex-shrink-0 hidden md:block"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-6 pb-24 md:pb-6">
          {/* 基本信息 */}
          <section>
            <h4 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wider">基本信息</h4>
            <div className="gold-divider mb-4" />
            <FormField
              label="物品名称"
              value={item.name}
              onChange={(v) => update({ name: v })}
              placeholder="物品名称"
            />
            <FormField
              label="品类"
              value={item.category}
              onChange={(v) => update({ category: v })}
              type="select"
              options={categories}
            />
            <FormField
              label="所属空间"
              value={item.roomId}
              onChange={(v) => update({ roomId: v })}
              type="select"
              options={rooms.map((r) => ({ value: r.id, label: r.name }))}
              placeholder="选择空间"
            />
          </section>

          {/* 规格要求 */}
          <section>
            <h4 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wider">规格要求</h4>
            <div className="gold-divider mb-4" />
            <FormField
              label="尺寸要求"
              value={item.sizeRequirement}
              onChange={(v) => update({ sizeRequirement: v })}
              placeholder="例如：2200×900mm"
            />
            <FormField
              label="材质要求"
              value={item.materialRequirement}
              onChange={(v) => update({ materialRequirement: v })}
              placeholder="例如：头层牛皮"
            />
            <FormField
              label="颜色要求"
              value={item.colorRequirement}
              onChange={(v) => update({ colorRequirement: v })}
              placeholder="例如：深灰色"
            />
            <FormField
              label="风格要求"
              value={item.styleRequirement}
              onChange={(v) => update({ styleRequirement: v })}
              placeholder="例如：现代简约"
            />
          </section>

          {/* 品牌与预算 */}
          <section>
            <h4 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wider">品牌与预算</h4>
            <div className="gold-divider mb-4" />
            <FormField
              label="品牌偏好"
              value={item.brandPreference}
              onChange={(v) => update({ brandPreference: v })}
              placeholder="例如：顾家、芝华仕"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="form-label">预算下限</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">¥</span>
                  <input
                    type="number"
                    value={item.budgetMin ?? ''}
                    onChange={(e) => update({ budgetMin: e.target.value ? Number(e.target.value) : null })}
                    placeholder="0"
                    className="form-input w-full pl-7"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">预算上限</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">¥</span>
                  <input
                    type="number"
                    value={item.budgetMax ?? ''}
                    onChange={(e) => update({ budgetMax: e.target.value ? Number(e.target.value) : null })}
                    placeholder="0"
                    className="form-input w-full pl-7"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 优先级与状态 */}
          <section>
            <h4 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wider">优先级与状态</h4>
            <div className="gold-divider mb-4" />
            <div className="form-group">
              <label className="form-label">优先级</label>
              <select
                value={item.priority}
                onChange={(e) => update({ priority: e.target.value as FurnishingItem['priority'] })}
                className="form-input w-full appearance-none"
              >
                {priorityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">状态</label>
              <select
                value={item.status}
                onChange={(e) => update({ status: e.target.value as FurnishingItem['status'] })}
                className="form-input w-full appearance-none"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {(item.status === 'purchased' || item.status === 'installed') && (
              <div className="form-group">
                <label className="form-label">实际价格</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">¥</span>
                  <input
                    type="number"
                    value={item.actualPrice ?? ''}
                    onChange={(e) => update({ actualPrice: e.target.value ? Number(e.target.value) : null })}
                    placeholder="请输入实际支出金额"
                    className="form-input w-full pl-7"
                  />
                </div>
                {item.actualPrice === null && (
                  <p className="text-xs text-warning mt-1">请填写实际价格，否则将按预算上限计算</p>
                )}
              </div>
            )}
          </section>

          {/* 搭配说明 */}
          <section>
            <h4 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wider">搭配说明</h4>
            <div className="gold-divider mb-4" />
            <FormField
              label="搭配说明"
              value={item.matchingNotes}
              onChange={(v) => update({ matchingNotes: v })}
              type="textarea"
              placeholder="与其他物品的搭配建议..."
            />
          </section>

          {/* 备注 */}
          <section>
            <h4 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wider">备注</h4>
            <div className="gold-divider mb-4" />
            <FormField
              label="备注"
              value={item.notes}
              onChange={(v) => update({ notes: v })}
              type="textarea"
              placeholder="其他备注信息..."
            />
          </section>

          {/* 参考图 */}
          <section>
            <h4 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wider">参考图</h4>
            <div className="gold-divider mb-4" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div
              className="photo-upload-zone"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-text-muted" />
              <span className="text-sm text-text-muted">点击上传参考图</span>
            </div>
            {item.referenceImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                {item.referenceImages.map((img) => (
                  <div key={img.id} className="relative group rounded-lg overflow-hidden bg-card">
                    <img
                      src={img.base64Data}
                      alt={img.notes || '参考图'}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute top-1 right-1 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="p-2">
                      <input
                        type="text"
                        value={img.notes}
                        onChange={(e) => handleUpdateImageNotes(img.id, e.target.value)}
                        placeholder="添加备注..."
                        className="w-full bg-transparent text-xs text-text-secondary placeholder:text-text-muted border-b border-border-subtle focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer - Delete - fixed on mobile */}
        <div className="p-4 md:p-5 border-t border-border-subtle bg-bg-secondary">
          {showDeleteConfirm ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-error">确认删除此物品？</span>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-error/15 text-error hover:bg-error/25 transition-colors"
              >
                确认删除
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-ghost text-sm"
              >
                取消
              </button>
            </div>
          ) : (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 text-sm text-error hover:text-error/80 transition-colors py-2"
            >
              <Trash2 className="w-4 h-4" />
              删除物品
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
