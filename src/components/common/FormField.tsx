import React, { useRef, useCallback } from 'react';

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
}) => {
  const isComposingRef = useRef(false);

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    isComposingRef.current = false;
    onChange((e.target as HTMLInputElement | HTMLTextAreaElement).value);
  }, [onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (isComposingRef.current) return;
    onChange((e.target as HTMLInputElement | HTMLTextAreaElement).value);
  }, [onChange]);

  return (
    <div className={`form-group ${className || ''}`}>
      <label className="form-label">{label}</label>
      {type === 'select' ? (
        <div className="relative">
          <select
            value={value}
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
          value={value}
          onChange={handleChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={placeholder}
          className="form-input w-full resize-none"
          rows={3}
        />
      ) : (
        <div className="relative">
          <input
            type={type}
            value={value}
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
