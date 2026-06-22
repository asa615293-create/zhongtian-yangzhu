import React, { useRef, useState } from 'react';
import { Upload, X, ZoomIn } from 'lucide-react';
import { useComposingInput } from '@/hooks/useComposingInput';
import { compressImage, generateThumbnail } from '@/utils/image';

// API 基础地址
const API_BASE = import.meta.env.VITE_API_URL || '';

interface Photo {
  id: string;
  base64Data?: string;
  notes: string;
  takenDate: string;
}

interface PhotoUploaderProps {
  photos: Photo[];
  onAdd: (id: string, notes: string, takenDate: string) => void;
  onRemove: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  category?: string;
  onLightboxOpen?: (photoId: string) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photos,
  onAdd,
  onRemove,
  onUpdateNotes,
  category,
  onLightboxOpen,
}) => {
  const { onCompositionStart, onCompositionEnd } = useComposingInput();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64Data = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.readAsDataURL(file);
        });

        // 生成原图和缩略图
        const [imageData, thumbnailData] = await Promise.all([
          compressImage(base64Data),
          generateThumbnail(base64Data),
        ]);

        const photoId = `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const takenDate = new Date().toISOString().split('T')[0];

        // 上传到服务器
        const res = await fetch(`${API_BASE}/api/photos/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId: category,
            id: photoId,
            notes: '',
            takenDate,
            imageData,
            thumbnailData,
          }),
        });

        if (res.ok) {
          // 通知父组件添加照片元数据（不含 base64）
          onAdd(photoId, '', takenDate);
        } else {
          console.error('照片上传失败');
        }
      }
    } catch (err) {
      console.error('照片上传出错:', err);
    } finally {
      setUploading(false);
    }
    e.target.value = '';
  };

  const handleRemove = async (photoId: string) => {
    try {
      await fetch(`${API_BASE}/api/photos/${photoId}`, { method: 'DELETE' });
    } catch {
      // 即使删除文件失败，也继续从 store 中移除
    }
    onRemove(photoId);
  };

  // 获取缩略图 URL
  const getThumbnailUrl = (photoId: string) => {
    return `${API_BASE}/api/photos/${photoId}/thumbnail`;
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        className="photo-upload-zone flex flex-col items-center justify-center gap-2 cursor-pointer"
        onClick={handleClick}
      >
        <Upload className="w-8 h-8 text-text-muted" />
        <span className="text-sm text-text-muted">
          {uploading ? '上传中...' : '点击上传照片'}
        </span>
        {category && (
          <span className="text-xs text-text-muted opacity-60">{category}</span>
        )}
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group rounded-lg overflow-hidden bg-card">
              <img
                src={getThumbnailUrl(photo.id)}
                alt={photo.notes || '照片'}
                className="w-full h-32 object-cover cursor-pointer"
                loading="lazy"
                onClick={() => onLightboxOpen?.(photo.id)}
                onError={(e) => {
                  // 如果缩略图加载失败，尝试用 base64Data 兼容
                  const img = e.currentTarget;
                  if (photo.base64Data && !img.dataset.fallback) {
                    img.src = photo.base64Data;
                    img.dataset.fallback = 'true';
                  }
                }}
              />
              {/* 点击查看大图提示 */}
              <button
                onClick={() => onLightboxOpen?.(photo.id)}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 p-1 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleRemove(photo.id)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="p-2">
                <input
                  type="text"
                  value={photo.notes}
                  onChange={(e) => onUpdateNotes(photo.id, e.target.value)}
                  onCompositionStart={onCompositionStart}
                  onCompositionEnd={onCompositionEnd}
                  placeholder="添加备注..."
                  className="w-full bg-transparent text-xs text-text-secondary placeholder:text-text-muted border-b border-border-subtle focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;
