import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface Photo {
  id: string;
  base64Data: string;
  notes: string;
  takenDate: string;
}

interface PhotoUploaderProps {
  photos: Photo[];
  onAdd: (base64Data: string) => void;
  onRemove: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  category?: string;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const compressImage = (base64Data: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      // Scale down if dimensions are too large
      const MAX_DIMENSION = 1920;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Data);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.8;
      let result = canvas.toDataURL('image/jpeg', quality);

      // Reduce quality until under max size
      while (result.length > MAX_FILE_SIZE && quality > 0.1) {
        quality -= 0.1;
        result = canvas.toDataURL('image/jpeg', quality);
      }

      resolve(result);
    };
    img.onerror = () => resolve(base64Data);
    img.src = base64Data;
  });
};

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photos,
  onAdd,
  onRemove,
  onUpdateNotes,
  category,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      const compressed = await compressImage(base64Data);
      onAdd(compressed);
    };
    reader.readAsDataURL(file);

    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        className="photo-upload-zone flex flex-col items-center justify-center gap-2 cursor-pointer"
        onClick={handleClick}
      >
        <Upload className="w-8 h-8 text-text-muted" />
        <span className="text-sm text-text-muted">点击上传照片</span>
        {category && (
          <span className="text-xs text-text-muted opacity-60">{category}</span>
        )}
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group rounded-lg overflow-hidden bg-card">
              <img
                src={photo.base64Data}
                alt={photo.notes || '照片'}
                className="w-full h-32 object-cover"
              />
              <button
                onClick={() => onRemove(photo.id)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="p-2">
                <input
                  type="text"
                  value={photo.notes}
                  onChange={(e) => onUpdateNotes(photo.id, e.target.value)}
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
