import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Wind, Save } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { systemsFieldDefinitions } from '@/data/deliveryFields';
import type { DeliverySpec } from '@/types';
import Card from '@/components/common/Card';
import FormField from '@/components/common/FormField';
import { useComposingInput } from '@/hooks/useComposingInput';

const SYSTEMS_KEY = 'systems';

const SystemsPage: React.FC = () => {
  const deliverySpecs = useAppStore((s) => s.deliverySpecs);
  const updateDeliverySpec = useAppStore((s) => s.updateDeliverySpec);
  const setDeliverySpecs = useAppStore((s) => s.setDeliverySpecs);
  const { onCompositionStart, onCompositionEnd } = useComposingInput();

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

  const roomSpecs = deliverySpecs[SYSTEMS_KEY] || [];

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
        id: `${SYSTEMS_KEY}-${fieldKey}`,
        roomId: SYSTEMS_KEY,
        category,
        fieldKey,
        fieldLabel,
        value: '',
        notes: '',
      };
    },
    [roomSpecs]
  );

  const handleFieldChange = useCallback(
    (fieldKey: string, fieldLabel: string, category: string, value: string) => {
      const spec = getSpec(fieldKey);
      if (spec) {
        updateDeliverySpec(SYSTEMS_KEY, spec.id, { value });
      } else {
        const newSpec: DeliverySpec = {
          id: `${SYSTEMS_KEY}-${fieldKey}`,
          roomId: SYSTEMS_KEY,
          category,
          fieldKey,
          fieldLabel,
          value,
          notes: '',
        };
        setDeliverySpecs(SYSTEMS_KEY, [...roomSpecs, newSpec]);
      }
      showSaveIndicator();
    },
    [getSpec, roomSpecs, setDeliverySpecs, updateDeliverySpec, showSaveIndicator]
  );

  const handleCategoryNotesChange = useCallback(
    (category: string, value: string) => {
      const notesKey = `__notes_${category}`;
      const spec = getSpec(notesKey);
      if (spec) {
        updateDeliverySpec(SYSTEMS_KEY, spec.id, { value });
      } else {
        const newSpec: DeliverySpec = {
          id: `${SYSTEMS_KEY}-${notesKey}`,
          roomId: SYSTEMS_KEY,
          category,
          fieldKey: notesKey,
          fieldLabel: '分类备注',
          value,
          notes: '',
        };
        setDeliverySpecs(SYSTEMS_KEY, [...roomSpecs, newSpec]);
      }
      showSaveIndicator();
    },
    [getSpec, roomSpecs, setDeliverySpecs, updateDeliverySpec, showSaveIndicator]
  );

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Wind className="w-6 h-6 text-accent" />
          <h1 className="section-title">三大件与智能化</h1>
          {saveIndicator && (
            <span className="flex items-center gap-1.5 text-xs text-text-muted ml-auto">
              <Save className="w-3 h-3" />
              自动保存
            </span>
          )}
        </div>
        <p className="section-subtitle ml-9">中央空调/新风/地暖/智能系统配置</p>
      </div>

      <div className="gold-divider mb-6" />

      {/* Category Cards */}
      <div className="space-y-6">
        {systemsFieldDefinitions.map((category) => {
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

export default SystemsPage;
