import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useComposingInput } from '@/hooks/useComposingInput';
import { compressImage } from '@/utils/image';

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

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photos,
  onAdd,
  onRemove,
  onUpdateNotes,
  category,
}) => {
  const { onCompositionStart, onCompositionEnd, isComposing } = useComposingInput();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        const compressed = await compressImage(base64Data);
        onAdd(compressed);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
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
