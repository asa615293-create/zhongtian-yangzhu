import { useRef, useCallback } from 'react';
import { setComposing } from '@/store/useAppStore';

/**
 * 处理中文输入法（IME）组合事件的 hook。
 * 只设置 store 层的 composing 标记，延迟保存到服务器。
 * 不阻断 onChange，避免受控组件无法更新显示值。
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
