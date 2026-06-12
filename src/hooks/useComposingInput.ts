import { useRef, useCallback } from 'react';
import { setComposing } from '@/store/useAppStore';

/**
 * 处理中文输入法（IME）组合事件的 hook。
 * 在组合输入期间（如拼音输入），阻止 onChange 更新状态，
 * 等 compositionend 后才提交最终值，避免中间拼音被保存。
 *
 * 双重防护：
 * 1. 组件层：onChange 在 composing 期间不触发回调
 * 2. Store 层：debouncedSave 在 composing 期间延迟保存
 */
export function useComposingInput() {
  const isComposingRef = useRef(false);

  const onCompositionStart = useCallback(() => {
    isComposingRef.current = true;
    setComposing(true);
  }, []);

  const onCompositionEnd = useCallback(() => {
    isComposingRef.current = false;
    setComposing(false);
  }, []);

  const isComposing = useCallback(() => isComposingRef.current, []);

  return { onCompositionStart, onCompositionEnd, isComposing };
}
