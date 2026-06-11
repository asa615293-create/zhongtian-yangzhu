import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  Palette,
  Paintbrush,
  LayoutGrid,
  Images,
  Upload,
  X,
  Camera,
  Type,
  AlignLeft,
  ChevronRight,
  Sparkles,
  Eye,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { DesignScheme } from '@/types';
import Card from '@/components/common/Card';

import Badge from '@/components/common/Badge';
import EmptyState from '@/components/common/EmptyState';

const generateId = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

type DesignTab = 'style' | 'color' | 'space' | 'reference';

const tabs: { key: DesignTab; label: string; icon: React.ReactNode }[] = [
  { key: 'style', label: '风格定位', icon: <Paintbrush className="w-4 h-4" /> },
  { key: 'color', label: '色彩方案', icon: <Palette className="w-4 h-4" /> },
  { key: 'space', label: '空间设计', icon: <LayoutGrid className="w-4 h-4" /> },
  { key: 'reference', label: '参考图集', icon: <Images className="w-4 h-4" /> },
];

// ─── Image Upload Helper ────────────────────────────────────────────────────────
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

// ─── Style Tab ──────────────────────────────────────────────────────────────────
const StyleTab: React.FC = () => {
  const designSchemes = useAppStore((s) => s.designSchemes);
  const addDesignScheme = useAppStore((s) => s.addDesignScheme);
  const updateDesignScheme = useAppStore((s) => s.updateDesignScheme);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const styleScheme = useMemo(
    () => designSchemes.find((s) => s.type === 'style'),
    [designSchemes]
  );

  const ensureScheme = useCallback((): DesignScheme => {
    if (styleScheme) return styleScheme;
    const newScheme: DesignScheme = {
      id: generateId(),
      type: 'style',
      title: '',
      description: '',
      keywords: '现代轻奢 · 珠宝艺术 · 隐奢',
      base64Data: '',
      colorValues: '',
      roomId: '',
      notes: '',
    };
    addDesignScheme(newScheme);
    return newScheme;
  }, [styleScheme, addDesignScheme]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const compressed = await compressImage(base64);
      const scheme = ensureScheme();
      updateDesignScheme(scheme.id, { base64Data: compressed });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleFieldUpdate = (field: 'keywords' | 'description', value: string) => {
    const scheme = ensureScheme();
    updateDesignScheme(scheme.id, { [field]: value });
  };

  return (
    <div className="fade-in space-y-6">
      {/* Hero Image Area */}
      <div className="relative group">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        {styleScheme?.base64Data ? (
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-border-subtle">
            <img
              src={styleScheme.base64Data}
              alt="灵感板"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 text-accent text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>灵感 / 情绪板</span>
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-video rounded-2xl border-2 border-dashed border-border-subtle bg-bg-secondary/50 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-accent/30 hover:bg-bg-secondary transition-all duration-300 group/upload"
          >
            <div className="w-16 h-16 rounded-2xl bg-accent-muted flex items-center justify-center group-hover/upload:bg-accent/20 transition-colors">
              <Upload className="w-7 h-7 text-accent" />
            </div>
            <div className="text-center">
              <p className="text-text-secondary font-medium">上传灵感板 / 情绪板</p>
              <p className="text-text-muted text-sm mt-1">点击选择图片，支持 JPG、PNG 格式</p>
            </div>
          </div>
        )}
      </div>

      {/* Style Keywords */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent to-accent/20 rounded-l-xl" />
        <div className="pl-4">
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">风格关键词</span>
          </div>
          <input
            type="text"
            value={styleScheme?.keywords || ''}
            onChange={(e) => handleFieldUpdate('keywords', e.target.value)}
            placeholder="例如：现代轻奢 · 珠宝艺术 · 隐奢"
            className="w-full bg-transparent text-text-primary text-lg font-display tracking-wide border-b border-border-subtle focus:border-accent/50 focus:ring-0 outline-none py-2 placeholder:text-text-muted/50"
          />
          <p className="text-xs text-text-muted mt-2">用 " · " 分隔关键词，定义整体风格方向</p>
        </div>
      </Card>

      {/* Style Description */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brown to-brown/20 rounded-l-xl" />
        <div className="pl-4">
          <div className="flex items-center gap-2 mb-4">
            <AlignLeft className="w-4 h-4 text-brown" />
            <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">风格描述</span>
          </div>
          <textarea
            value={styleScheme?.description || ''}
            onChange={(e) => handleFieldUpdate('description', e.target.value)}
            placeholder="详细描述设计方向、灵感来源、材质偏好、生活方式诉求……"
            rows={5}
            className="w-full bg-transparent text-text-primary border-b border-border-subtle focus:border-accent/50 focus:ring-0 outline-none py-2 placeholder:text-text-muted/50 resize-none"
          />
        </div>
      </Card>
    </div>
  );
};

// ─── Color Tab ──────────────────────────────────────────────────────────────────
interface ColorEntry {
  label: string;
  hex: string;
  name: string;
  usage: string;
  proportion: number;
}

const defaultColors: ColorEntry[] = [
  { label: '主色', hex: '#B5B0A8', name: '浅灰米', usage: '大面积墙面、天花板、主要家具面料', proportion: 70 },
  { label: '辅色', hex: '#5C4A3A', name: '深咖', usage: '木饰面、家具框架、地面材质', proportion: 20 },
  { label: '点缀色', hex: '#C4A265', name: '香槟金', usage: '金属配件、灯具、装饰摆件', proportion: 10 },
];

const ColorTab: React.FC = () => {
  const designSchemes = useAppStore((s) => s.designSchemes);
  const addDesignScheme = useAppStore((s) => s.addDesignScheme);
  const updateDesignScheme = useAppStore((s) => s.updateDesignScheme);

  const colorScheme = useMemo(
    () => designSchemes.find((s) => s.type === 'color'),
    [designSchemes]
  );

  const colors: ColorEntry[] = useMemo(() => {
    if (colorScheme?.colorValues) {
      try {
        return JSON.parse(colorScheme.colorValues);
      } catch {
        return defaultColors;
      }
    }
    return defaultColors;
  }, [colorScheme]);

  const ensureScheme = useCallback((): DesignScheme => {
    if (colorScheme) return colorScheme;
    const newScheme: DesignScheme = {
      id: generateId(),
      type: 'color',
      title: '色彩方案',
      description: '',
      keywords: '',
      base64Data: '',
      colorValues: JSON.stringify(defaultColors),
      roomId: '',
      notes: '',
    };
    addDesignScheme(newScheme);
    return newScheme;
  }, [colorScheme, addDesignScheme]);

  const updateColor = (index: number, field: keyof ColorEntry, value: string | number) => {
    const scheme = ensureScheme();
    const updated = [...colors];
    updated[index] = { ...updated[index], [field]: value };
    updateDesignScheme(scheme.id, { colorValues: JSON.stringify(updated) });
  };

  return (
    <div className="fade-in space-y-6">
      {/* Color Rows */}
      {colors.map((color, index) => (
        <Card key={index} className="relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-1.5 h-full rounded-l-xl"
            style={{ backgroundColor: color.hex }}
          />
          <div className="pl-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">
                  {color.label}
                </span>
                <span className="text-xs text-text-muted bg-bg-card px-2 py-0.5 rounded-full">
                  {color.proportion}%
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-5">
              {/* Color Swatch */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative group/swatch">
                  <div
                    className="w-24 h-24 rounded-2xl cursor-pointer border border-border-subtle shadow-lg transition-transform hover:scale-105"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => {
                      const input = document.getElementById(`color-picker-${index}`);
                      input?.click();
                    }}
                  />
                  <input
                    id={`color-picker-${index}`}
                    type="color"
                    value={color.hex}
                    onChange={(e) => updateColor(index, 'hex', e.target.value)}
                    className="absolute opacity-0 w-0 h-0"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/swatch:opacity-100 transition-opacity">
                    <Eye className="w-5 h-5 text-white drop-shadow-lg" />
                  </div>
                </div>
                <span className="text-xs text-text-muted font-mono">{color.hex}</span>
              </div>

              {/* Color Details */}
              <div className="flex-1 space-y-3">
                <div>
                  <label className="form-label">颜色名称</label>
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) => updateColor(index, 'name', e.target.value)}
                    className="form-input w-full"
                    placeholder="颜色名称"
                  />
                </div>
                <div>
                  <label className="form-label">用途描述</label>
                  <textarea
                    value={color.usage}
                    onChange={(e) => updateColor(index, 'usage', e.target.value)}
                    className="form-input w-full resize-none"
                    rows={2}
                    placeholder="描述该色彩在空间中的应用"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {/* Color Harmony Preview */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">色彩比例预览</span>
        </div>
        <div className="flex h-16 rounded-xl overflow-hidden border border-border-subtle">
          {colors.map((color, index) => (
            <div
              key={index}
              className="relative group/bar flex items-center justify-center transition-all duration-300 hover:flex-grow"
              style={{
                backgroundColor: color.hex,
                flexBasis: `${color.proportion}%`,
              }}
            >
              <span className="text-xs font-medium text-white/80 drop-shadow-md opacity-0 group-hover/bar:opacity-100 transition-opacity">
                {color.name} {color.proportion}%
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3">
          {colors.map((color, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full border border-border-subtle"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-xs text-text-muted">{color.name}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ─── Space Design Tab ───────────────────────────────────────────────────────────
const SpaceTab: React.FC = () => {
  const rooms = useAppStore((s) => s.rooms);
  const designSchemes = useAppStore((s) => s.designSchemes);
  const furnishingItems = useAppStore((s) => s.furnishingItems);
  const addDesignScheme = useAppStore((s) => s.addDesignScheme);
  const updateDesignScheme = useAppStore((s) => s.updateDesignScheme);
  const [activeRoomId, setActiveRoomId] = useState(rooms[0]?.id || 'entrance');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const spaceSchemes = useMemo(
    () => designSchemes.filter((s) => s.type === 'space'),
    [designSchemes]
  );

  const currentScheme = useMemo(
    () => spaceSchemes.find((s) => s.roomId === activeRoomId),
    [spaceSchemes, activeRoomId]
  );

  const roomItems = useMemo(
    () => furnishingItems.filter((i) => i.roomId === activeRoomId),
    [furnishingItems, activeRoomId]
  );

  const ensureScheme = useCallback((): DesignScheme => {
    if (currentScheme) return currentScheme;
    const newScheme: DesignScheme = {
      id: generateId(),
      type: 'space',
      title: rooms.find((r) => r.id === activeRoomId)?.name || '',
      description: '',
      keywords: '',
      base64Data: '',
      colorValues: '',
      roomId: activeRoomId,
      notes: '',
    };
    addDesignScheme(newScheme);
    return newScheme;
  }, [currentScheme, addDesignScheme, rooms, activeRoomId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const compressed = await compressImage(base64);
      const scheme = ensureScheme();
      updateDesignScheme(scheme.id, { base64Data: compressed });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleFieldUpdate = (field: 'description' | 'notes', value: string) => {
    const scheme = ensureScheme();
    updateDesignScheme(scheme.id, { [field]: value });
  };

  return (
    <div className="fade-in space-y-6">
      {/* Room Tabs */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max pb-1">
          {rooms.map((room) => (
            <button
              key={room.id}
              className={room.id === activeRoomId ? 'tab-active' : 'tab'}
              onClick={() => setActiveRoomId(room.id)}
            >
              {room.name}
            </button>
          ))}
        </div>
      </div>

      {/* Image Upload Area */}
      <div className="relative group">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        {currentScheme?.base64Data ? (
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-border-subtle">
            <img
              src={currentScheme.base64Data}
              alt="设计效果图"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-center gap-2 text-accent text-sm font-medium">
                <LayoutGrid className="w-4 h-4" />
                <span>
                  {rooms.find((r) => r.id === activeRoomId)?.name} · 设计效果图 / 平面图
                </span>
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-video rounded-2xl border-2 border-dashed border-border-subtle bg-bg-secondary/50 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-accent/30 hover:bg-bg-secondary transition-all duration-300 group/upload"
          >
            <div className="w-16 h-16 rounded-2xl bg-accent-muted flex items-center justify-center group-hover/upload:bg-accent/20 transition-colors">
              <Upload className="w-7 h-7 text-accent" />
            </div>
            <div className="text-center">
              <p className="text-text-secondary font-medium">上传设计效果图 / 平面图</p>
              <p className="text-text-muted text-sm mt-1">点击选择图片</p>
            </div>
          </div>
        )}
      </div>

      {/* Design Description */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent to-accent/20 rounded-l-xl" />
        <div className="pl-4">
          <div className="flex items-center gap-2 mb-3">
            <AlignLeft className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">设计说明</span>
          </div>
          <textarea
            value={currentScheme?.description || ''}
            onChange={(e) => handleFieldUpdate('description', e.target.value)}
            placeholder="描述该空间的设计理念、布局方案、材质搭配……"
            rows={4}
            className="w-full bg-transparent text-text-primary border-b border-border-subtle focus:border-accent/50 focus:ring-0 outline-none py-2 placeholder:text-text-muted/50 resize-none"
          />
        </div>
      </Card>

      {/* Related Furnishing Items */}
      {roomItems.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <ChevronRight className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">
              关联软装物品
            </span>
            <span className="text-xs text-text-muted ml-1">{roomItems.length} 件</span>
          </div>
          <div className="space-y-2">
            {roomItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-bg-card/50 hover:bg-bg-hover transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-primary">{item.name}</span>
                  <span className="text-xs text-text-muted">{item.category}</span>
                </div>
                <Badge variant={item.status}>
                  {item.status === 'pending' && '待选'}
                  {item.status === 'selected' && '已选'}
                  {item.status === 'purchased' && '已购'}
                  {item.status === 'installed' && '已安装'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

// ─── Reference Tab ──────────────────────────────────────────────────────────────
const ReferenceTab: React.FC = () => {
  const rooms = useAppStore((s) => s.rooms);
  const designSchemes = useAppStore((s) => s.designSchemes);
  const addDesignScheme = useAppStore((s) => s.addDesignScheme);
  const updateDesignScheme = useAppStore((s) => s.updateDesignScheme);
  const removeDesignScheme = useAppStore((s) => s.removeDesignScheme);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filterRoomId, setFilterRoomId] = useState<string>('all');

  const refSchemes = useMemo(
    () => designSchemes.filter((s) => s.type === 'reference'),
    [designSchemes]
  );

  const filteredSchemes = useMemo(
    () =>
      filterRoomId === 'all'
        ? refSchemes
        : refSchemes.filter((s) => s.roomId === filterRoomId),
    [refSchemes, filterRoomId]
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const compressed = await compressImage(base64);
        const newScheme: DesignScheme = {
          id: generateId(),
          type: 'reference',
          title: '',
          description: '',
          keywords: '',
          base64Data: compressed,
          colorValues: '',
          roomId: filterRoomId !== 'all' ? filterRoomId : '',
          notes: '',
        };
        addDesignScheme(newScheme);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const updateNote = (id: string, notes: string) => {
    updateDesignScheme(id, { notes });
  };

  return (
    <div className="fade-in space-y-5">
      {/* Controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select
            value={filterRoomId}
            onChange={(e) => setFilterRoomId(e.target.value)}
            className="form-input text-sm py-1.5"
          >
            <option value="all">全部空间</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
          <span className="text-xs text-text-muted">{filteredSchemes.length} 张参考图</span>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary flex items-center gap-1.5 text-sm"
        >
          <Upload className="w-4 h-4" />
          上传参考图
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Image Grid */}
      {filteredSchemes.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="relative group rounded-xl overflow-hidden bg-bg-secondary border border-border-subtle"
            >
              <img
                src={scheme.base64Data}
                alt={scheme.notes || '参考图'}
                className="w-full aspect-[4/3] object-cover"
              />
              <button
                onClick={() => removeDesignScheme(scheme.id)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {scheme.roomId && (
                <div className="absolute top-2 left-2">
                  <span className="text-xs bg-black/50 text-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {rooms.find((r) => r.id === scheme.roomId)?.name}
                  </span>
                </div>
              )}
              <div className="p-2.5">
                <input
                  type="text"
                  value={scheme.notes}
                  onChange={(e) => updateNote(scheme.id, e.target.value)}
                  placeholder="添加备注…"
                  className="w-full bg-transparent text-xs text-text-secondary placeholder:text-text-muted border-b border-border-subtle focus:outline-none focus:border-accent py-1"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Images className="w-12 h-12 text-text-muted" />}
          title="暂无参考图"
          description="上传灵感图片、参考案例，构建你的设计灵感库"
          action={
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              上传参考图
            </button>
          }
        />
      )}
    </div>
  );
};

// ─── Main DesignPage ────────────────────────────────────────────────────────────
const DesignPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DesignTab>('style');

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Palette className="w-6 h-6 text-accent" />
          <h1 className="section-title">设计方案</h1>
        </div>
        <p className="section-subtitle ml-9">风格定位 · 色彩方案 · 空间设计 · 参考图集</p>
      </div>

      <div className="gold-divider mb-6" />

      {/* Sub Tabs */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-accent-muted text-accent'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'style' && <StyleTab />}
      {activeTab === 'color' && <ColorTab />}
      {activeTab === 'space' && <SpaceTab />}
      {activeTab === 'reference' && <ReferenceTab />}
    </div>
  );
};

export default DesignPage;
