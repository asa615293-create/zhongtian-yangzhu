import React, { useState, useCallback, useRef } from 'react';
import { Ruler, Plus, Trash2, Upload, X, Save } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { Measurement } from '@/types';
import Card from '@/components/common/Card';

const MeasurementsPage: React.FC = () => {
  const rooms = useAppStore((s) => s.rooms);
  const measurements = useAppStore((s) => s.measurements);
  const addMeasurement = useAppStore((s) => s.addMeasurement);
  const updateMeasurement = useAppStore((s) => s.updateMeasurement);
  const removeMeasurement = useAppStore((s) => s.removeMeasurement);

  const [activeRoomId, setActiveRoomId] = useState(rooms[0]?.id || 'entrance');
  const [saveIndicator, setSaveIndicator] = useState(false);
  const sketchInputRef = useRef<HTMLInputElement>(null);

  // Sketch photos stored in a special key in measurements
  const sketchKey = `__sketch_${activeRoomId}`;
  const sketchMeasurements = measurements[sketchKey] || [];

  const currentRoom = rooms.find((r) => r.id === activeRoomId);
  const roomMeasurements = measurements[activeRoomId] || [];

  const showSaveIndicator = useCallback(() => {
    setSaveIndicator(true);
    setTimeout(() => setSaveIndicator(false), 2000);
  }, []);

  const handleAddRow = useCallback(() => {
    const newMeasurement: Measurement = {
      id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      roomId: activeRoomId,
      wallName: '',
      width: null,
      height: null,
      notes: '',
    };
    addMeasurement(activeRoomId, newMeasurement);
    showSaveIndicator();
  }, [activeRoomId, addMeasurement, showSaveIndicator]);

  const handleDeleteRow = useCallback(
    (measurementId: string) => {
      removeMeasurement(activeRoomId, measurementId);
      showSaveIndicator();
    },
    [activeRoomId, removeMeasurement, showSaveIndicator]
  );

  const handleFieldUpdate = useCallback(
    (measurementId: string, field: keyof Measurement, value: string | number | null) => {
      updateMeasurement(activeRoomId, measurementId, { [field]: value });
      showSaveIndicator();
    },
    [activeRoomId, updateMeasurement, showSaveIndicator]
  );

  const handleSketchUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target?.result as string;
        const sketch: Measurement = {
          id: `sketch-${Date.now()}`,
          roomId: activeRoomId,
          wallName: '手绘尺寸草图',
          width: null,
          height: null,
          notes: base64Data,
        };
        addMeasurement(sketchKey, sketch);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    },
    [activeRoomId, sketchKey, addMeasurement]
  );

  const handleRemoveSketch = useCallback(
    (sketchId: string) => {
      removeMeasurement(sketchKey, sketchId);
    },
    [sketchKey, removeMeasurement]
  );

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Ruler className="w-6 h-6 text-accent" />
          <h1 className="section-title">尺寸测量</h1>
          {saveIndicator && (
            <span className="flex items-center gap-1.5 text-xs text-text-muted ml-auto">
              <Save className="w-3 h-3" />
              自动保存
            </span>
          )}
        </div>
        <p className="section-subtitle ml-9">记录各空间精确尺寸</p>
      </div>

      <div className="gold-divider mb-6" />

      {/* Room Tabs */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
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

      {/* Measurement Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-text-primary">
            {currentRoom?.name || ''} 尺寸
          </h3>
          <button className="btn-primary flex items-center gap-1.5 text-xs" onClick={handleAddRow}>
            <Plus className="w-3.5 h-3.5" />
            添加
          </button>
        </div>

        {/* Table Header - hidden on mobile */}
        <div className="hidden md:grid grid-cols-12 gap-2 mb-2 px-2">
          <div className="col-span-3 text-xs font-medium text-text-muted uppercase tracking-wider">墙面名称</div>
          <div className="col-span-2 text-xs font-medium text-text-muted uppercase tracking-wider">宽度(mm)</div>
          <div className="col-span-2 text-xs font-medium text-text-muted uppercase tracking-wider">高度(mm)</div>
          <div className="col-span-4 text-xs font-medium text-text-muted uppercase tracking-wider">备注</div>
          <div className="col-span-1" />
        </div>

        {/* Table Rows - card style on mobile, row style on desktop */}
        <div className="space-y-2 md:space-y-2">
          {roomMeasurements.map((m) => (
            <div
              key={m.id}
              className="md:grid grid-cols-12 gap-2 items-center p-3 md:p-2 rounded-lg bg-bg-primary/50"
            >
              {/* Mobile layout */}
              <div className="md:hidden space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-text-muted uppercase tracking-wider">墙面名称</label>
                    <input
                      type="text"
                      value={m.wallName}
                      onChange={(e) => handleFieldUpdate(m.id, 'wallName', e.target.value)}
                      placeholder="如：南墙"
                      className="form-input w-full text-sm"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => handleDeleteRow(m.id)}
                      className="p-2.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-text-muted uppercase tracking-wider">宽度(mm)</label>
                    <input
                      type="number"
                      value={m.width ?? ''}
                      onChange={(e) =>
                        handleFieldUpdate(m.id, 'width', e.target.value ? Number(e.target.value) : null)
                      }
                      placeholder="0"
                      className="form-input w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-text-muted uppercase tracking-wider">高度(mm)</label>
                    <input
                      type="number"
                      value={m.height ?? ''}
                      onChange={(e) =>
                        handleFieldUpdate(m.id, 'height', e.target.value ? Number(e.target.value) : null)
                      }
                      placeholder="0"
                      className="form-input w-full text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-text-muted uppercase tracking-wider">备注</label>
                  <input
                    type="text"
                    value={m.notes}
                    onChange={(e) => handleFieldUpdate(m.id, 'notes', e.target.value)}
                    placeholder="备注"
                    className="form-input w-full text-sm"
                  />
                </div>
              </div>

              {/* Desktop layout */}
              <div className="hidden md:block col-span-3">
                <input
                  type="text"
                  value={m.wallName}
                  onChange={(e) => handleFieldUpdate(m.id, 'wallName', e.target.value)}
                  placeholder="如：南墙"
                  className="form-input w-full text-sm"
                />
              </div>
              <div className="hidden md:block col-span-2">
                <input
                  type="number"
                  value={m.width ?? ''}
                  onChange={(e) =>
                    handleFieldUpdate(m.id, 'width', e.target.value ? Number(e.target.value) : null)
                  }
                  placeholder="0"
                  className="form-input w-full text-sm"
                />
              </div>
              <div className="hidden md:block col-span-2">
                <input
                  type="number"
                  value={m.height ?? ''}
                  onChange={(e) =>
                    handleFieldUpdate(m.id, 'height', e.target.value ? Number(e.target.value) : null)
                  }
                  placeholder="0"
                  className="form-input w-full text-sm"
                />
              </div>
              <div className="hidden md:block col-span-4">
                <input
                  type="text"
                  value={m.notes}
                  onChange={(e) => handleFieldUpdate(m.id, 'notes', e.target.value)}
                  placeholder="备注"
                  className="form-input w-full text-sm"
                />
              </div>
              <div className="hidden md:flex col-span-1 justify-center">
                <button
                  onClick={() => handleDeleteRow(m.id)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {roomMeasurements.length === 0 && (
            <div className="text-center py-8 text-text-muted text-sm">
              暂无测量数据，点击上方"添加"按钮开始记录
            </div>
          )}
        </div>
      </Card>

      {/* Hand-drawn Sketch Upload */}
      <Card className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-text-primary">手绘尺寸草图</h3>
          <button
            className="btn-secondary flex items-center gap-1.5 text-xs"
            onClick={() => sketchInputRef.current?.click()}
          >
            <Upload className="w-3.5 h-3.5" />
            上传草图
          </button>
          <input
            ref={sketchInputRef}
            type="file"
            accept="image/*"
            onChange={handleSketchUpload}
            className="hidden"
          />
        </div>

        {sketchMeasurements.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sketchMeasurements.map((sketch) => (
              <div key={sketch.id} className="relative group rounded-lg overflow-hidden bg-bg-primary">
                <img
                  src={sketch.notes}
                  alt="手绘草图"
                  className="w-full h-40 object-contain bg-white/5"
                />
                <button
                  onClick={() => handleRemoveSketch(sketch.id)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {sketchMeasurements.length === 0 && (
          <div className="text-center py-6 text-text-muted text-sm">
            上传手绘测量草图照片，方便对照参考
          </div>
        )}
      </Card>
    </div>
  );
};

export default MeasurementsPage;
