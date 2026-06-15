import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Minus, Plus } from 'lucide-react';
import { setComposing } from '@/store/useAppStore';

interface SelectOption {
  value: string;
  label: string;
}

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'select' | 'textarea';
  placeholder?: string;
  options?: string[] | SelectOption[];
  unit?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}

const isSelectOptionArray = (options: string[] | SelectOption[] | undefined): options is SelectOption[] => {
  return Array.isArray(options) && options.length > 0 && typeof options[0] === 'object' && 'value' in options[0];
};

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  options,
  unit,
  className,
  min,
  max,
  step = 1,
}) => {
  // 本地状态：组合输入期间用本地值显示，不更新父组件
  const [localValue, setLocalValue] = useState(value);
  const isComposingRef = useRef(false);

  // 非组合期间，同步父组件的值
  useEffect(() => {
    if (!isComposingRef.current) {
      setLocalValue(value);
    }
  }, [value]);

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
    setComposing(true);
  }, []);

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    isComposingRef.current = false;
    setComposing(false);
    const finalValue = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
    setLocalValue(finalValue);
    onChange(finalValue);
  }, [onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
    setLocalValue(newValue);
    if (!isComposingRef.current) {
      onChange(newValue);
    }
  }, [onChange]);

  const handleStepDown = useCallback(() => {
    const numVal = Number(localValue) || 0;
    const newVal = Math.max(min ?? -Infinity, numVal - step);
    const strVal = String(newVal);
    setLocalValue(strVal);
    onChange(strVal);
  }, [localValue, min, step, onChange]);

  const handleStepUp = useCallback(() => {
    const numVal = Number(localValue) || 0;
    const newVal = Math.min(max ?? Infinity, numVal + step);
    const strVal = String(newVal);
    setLocalValue(strVal);
    onChange(strVal);
  }, [localValue, max, step, onChange]);

  return (
    <div className={`form-group ${className || ''}`}>
      <label className="form-label">{label}</label>
      {type === 'select' ? (
        <div className="relative">
          <select
            value={localValue}
            onChange={handleChange}
            className="form-input w-full appearance-none"
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {isSelectOptionArray(options)
              ? options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
              : options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
          </select>
        </div>
      ) : type === 'textarea' ? (
        <textarea
          value={localValue}
          onChange={handleChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={placeholder}
          className="form-input w-full resize-none"
          rows={3}
        />
      ) : type === 'number' ? (
        <div className="flex items-stretch gap-0">
          <button
            type="button"
            onClick={handleStepDown}
            className="flex items-center justify-center w-9 rounded-l-lg bg-bg-card border border-r-0 border-border-subtle text-text-secondary hover:text-accent hover:border-accent/30 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <div className="relative flex-1">
            <input
              type="number"
              value={localValue}
              onChange={handleChange}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              placeholder={placeholder}
              className="form-input w-full text-center rounded-none border-x-0"
              min={min}
              max={max}
              step={step}
            />
            {unit && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                {unit}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleStepUp}
            className="flex items-center justify-center w-9 rounded-r-lg bg-bg-card border border-l-0 border-border-subtle text-text-secondary hover:text-accent hover:border-accent/30 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type={type}
            value={localValue}
            onChange={handleChange}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder={placeholder}
            className="form-input w-full"
          />
          {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
              {unit}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FormField;
