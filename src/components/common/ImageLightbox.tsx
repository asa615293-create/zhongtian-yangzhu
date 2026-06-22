import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface ImageLightboxProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ src, alt, onClose }) => {
  // ESC 关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    // 阻止背景滚动
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // 触摸关闭支持
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // 记录起始位置
    const touch = e.touches[0];
    (e.currentTarget as HTMLElement).dataset.touchStartY = String(touch.clientY);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const startY = Number((e.currentTarget as HTMLElement).dataset.touchStartY);
    const endY = e.changedTouches[0].clientY;
    // 下滑超过 100px 关闭
    if (endY - startY > 100) onClose();
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 fade-in"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {/* 图片 */}
      <img
        src={src}
        alt={alt || '照片'}
        className="max-w-[95vw] max-h-[90vh] object-contain select-none"
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />
    </div>
  );
};

export default ImageLightbox;
