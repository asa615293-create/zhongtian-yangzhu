import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ClipboardList, Save } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { deliveryFieldDefinitions } from '@/data/deliveryFields';
import { useComposingInput } from '@/hooks/useComposingInput';

import type { DeliverySpec } from '@/types';
import Card from '@/components/common/Card';
import FormField from '@/components/common/FormField';

const DeliveryPage: React.FC = () => {
  const { onCompositionStart, onCompositionEnd } = useComposingInput();
  const rooms = useAppStore((s) => s.rooms);
  const deliverySpecs = useAppStore((s) => s.deliverySpecs);
  const updateDeliverySpec = useAppStore((s) => s.updateDeliverySpec);
  const setDeliverySpecs = useAppStore((s) => s.setDeliverySpecs);

  const [activeRoomId, setActiveRoomId] = useState(rooms[0]?.id || 'entrance');
  const [saveIndicator, setSaveIndicator] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const showSaveIndicator = useCallback(() => {
    setSaveIndicator(true);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setSaveIndicator(false), 2000);
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const currentRoom = rooms.find((r) => r.id === activeRoomId);
  const fieldCategories = deliveryFieldDefinitions[activeRoomId] || [];
  const roomSpecs = deliverySpecs[activeRoomId] || [];

  const getSpec = useCallback(
    (fieldKey: string): DeliverySpec | undefined => {
      return roomSpecs.find((s) => s.fieldKey === fieldKey);
    },
    [roomSpecs]
  );

  const getOrCreateSpec = useCallback(
    (fieldKey: string, fieldLabel: string, category: string): DeliverySpec => {
      const existing = roomSpecs.find((s) => s.fieldKey === fieldKey);
      if (existing) return existing;
      return {
        id: `${activeRoomId}-${fieldKey}`,
        roomId: activeRoomId,
        category,
        fieldKey,
        fieldLabel,
        value: '',
        notes: '',
      };
    },
    [activeRoomId, roomSpecs]
  );

  const handleFieldChange = useCallback(
    (fieldKey: string, fieldLabel: string, category: string, value: string) => {
      const spec = getSpec(fieldKey);
      if (spec) {
        updateDeliverySpec(activeRoomId, spec.id, { value });
      } else {
        const newSpec: DeliverySpec = {
          id: `${activeRoomId}-${fieldKey}`,
          roomId: activeRoomId,
          category,
          fieldKey,
          fieldLabel,
          value,
          notes: '',
        };
        setDeliverySpecs(activeRoomId, [...roomSpecs, newSpec]);
      }
      showSaveIndicator();
    },
    [activeRoomId, getSpec, roomSpecs, setDeliverySpecs, updateDeliverySpec, showSaveIndicator]
  );

  const handleCategoryNotesChange = useCallback(
    (category: string, value: string) => {
      const notesKey = `__notes_${category}`;
      const spec = getSpec(notesKey);
      if (spec) {
        updateDeliverySpec(activeRoomId, spec.id, { value });
      } else {
        const newSpec: DeliverySpec = {
          id: `${activeRoomId}-${notesKey}`,
          roomId: activeRoomId,
          category,
          fieldKey: notesKey,
          fieldLabel: '分类备注',
          value,
          notes: '',
        };
        setDeliverySpecs(activeRoomId, [...roomSpecs, newSpec]);
      }
      showSaveIndicator();
    },
    [activeRoomId, getSpec, roomSpecs, setDeliverySpecs, updateDeliverySpec, showSaveIndicator]
  );

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <ClipboardList className="w-6 h-6 text-accent" />
          <h1 className="section-title">精装交付标准</h1>
          {saveIndicator && (
            <span className="flex items-center gap-1.5 text-xs text-text-muted ml-auto">
              <Save className="w-3 h-3" />
              自动保存
            </span>
          )}
        </div>
        <p className="section-subtitle ml-9">逐空间记录精装交付配置</p>
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

      {/* Category Cards */}
      <div className="space-y-6">
        {fieldCategories.map((category) => {
          const categoryNotesSpec = getSpec(`__notes_${category.name}`);
          return (
            <Card key={category.name}>
              <h3 className="text-base font-semibold text-accent mb-4">{category.name}</h3>
              <div className="gold-divider mb-4" />
              <div className="space-y-4 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-1 md:space-y-0">
                {category.fields.map((field) => {
                  const spec = getOrCreateSpec(field.key, field.label, category.name);
                  return (
                    <div key={field.key}>
                      <FormField
                        label={field.label}
                        value={spec?.value || ''}
                        onChange={(value) => handleFieldChange(field.key, field.label, category.name, value)}
                        type={field.type}
                        placeholder={field.placeholder}
                        options={field.options}
                        unit={field.unit}
                      />
                    </div>
                  );
                })}
              </div>
              {/* Category Notes */}
              <div className="mt-4 pt-3 border-t border-border-subtle">
                <textarea
                  value={categoryNotesSpec?.value || ''}
                  onChange={(e) => handleCategoryNotesChange(category.name, e.target.value)}
                  onCompositionStart={onCompositionStart}
                  onCompositionEnd={onCompositionEnd}
                  placeholder={`${category.name}备注...`}
                  className="form-input w-full text-sm resize-none"
                  rows={2}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryPage;
