import React, { useRef, useState } from 'react';
import { Upload, X, ZoomIn } from 'lucide-react';
import { useComposingInput } from '@/hooks/useComposingInput';
import { compressImage, generateThumbnail } from '@/utils/image';
import type { Photo } from '@/types';

interface PhotoUploaderProps {
  photos: Pick<Photo, 'id' | 'base64Data' | 'notes' | 'takenDate'>[];
  onAdd: (photo: Pick<Photo, 'id' | 'base64Data' | 'notes' | 'takenDate'>) => void;
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

        // 压缩原图
        const compressedData = await compressImage(base64Data);

        const photoId = `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const takenDate = new Date().toISOString().split('T')[0];

        // 直接创建包含 base64Data 的照片数据
        const photoData = {
          id: photoId,
          base64Data: compressedData,
          notes: '',
          takenDate,
        };

        onAdd(photoData);
      }
    } catch (err) {
      console.error('照片上传出错:', err);
    } finally {
      setUploading(false);
    }
    e.target.value = '';
  };

  // 生成缩略图用于列表展示
  const [thumbnailCache, setThumbnailCache] = React.useState<Record<string, string>>({});

  // 为照片生成缩略图
  const getThumbnail = (photo: Photo): string | null => {
    if (thumbnailCache[photo.id]) return thumbnailCache[photo.id];
    if (!photo.base64Data) return null;

    // 异步生成缩略图
    generateThumbnail(photo.base64Data).then((thumb) => {
      setThumbnailCache((prev) => ({ ...prev, [photo.id]: thumb }));
    });
    return null;
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
          {photos.map((photo) => {
            const thumb = thumbnailCache[photo.id] || photo.base64Data;
            return (
              <div key={photo.id} className="relative group rounded-lg overflow-hidden bg-card">
                {thumb ? (
                  <img
                    src={thumb}
                    alt={photo.notes || '照片'}
                    className="w-full h-32 object-cover cursor-pointer"
                    loading="lazy"
                    onClick={() => onLightboxOpen?.(photo.id)}
                  />
                ) : (
                  <div
                    className="w-full h-32 flex items-center justify-center bg-gray-100 cursor-pointer"
                    onClick={() => onLightboxOpen?.(photo.id)}
                  >
                    <span className="text-xs text-text-muted">加载中...</span>
                  </div>
                )}
                {/* 点击查看大图提示 */}
                <button
                  onClick={() => onLightboxOpen?.(photo.id)}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 p-1 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onRemove(photo.id)}
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;
