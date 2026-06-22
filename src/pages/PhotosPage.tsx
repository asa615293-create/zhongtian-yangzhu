import React, { useState, useCallback } from 'react';
import { Camera, Calendar } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { Photo } from '@/types';
import PhotoUploader from '@/components/common/PhotoUploader';
import ImageLightbox from '@/components/common/ImageLightbox';
import Card from '@/components/common/Card';

// API 基础地址
const API_BASE = import.meta.env.VITE_API_URL || '';

const PhotosPage: React.FC = () => {
  const rooms = useAppStore((s) => s.rooms);
  const photos = useAppStore((s) => s.photos);
  const addPhoto = useAppStore((s) => s.addPhoto);
  const removePhoto = useAppStore((s) => s.removePhoto);
  const updatePhoto = useAppStore((s) => s.updatePhoto);

  const [activeRoomId, setActiveRoomId] = useState(rooms[0]?.id || 'entrance');
  const [lightboxPhotoId, setLightboxPhotoId] = useState<string | null>(null);

  const currentRoom = rooms.find((r) => r.id === activeRoomId);
  const roomPhotos = (photos[activeRoomId] || []).map((p) => ({
    id: p.id,
    base64Data: p.base64Data,
    notes: p.notes,
    takenDate: p.takenDate,
  }));

  // 新上传：PhotoUploader 完成文件上传后，只添加元数据到 store
  const handleAdd = useCallback(
    (photoId: string, notes: string, takenDate: string) => {
      const newPhoto: Photo = {
        id: photoId,
        roomId: activeRoomId,
        category: '实景',
        takenDate,
        notes,
      };
      addPhoto(activeRoomId, newPhoto);
    },
    [activeRoomId, addPhoto]
  );

  const handleRemove = useCallback(
    (photoId: string) => {
      removePhoto(activeRoomId, photoId);
    },
    [activeRoomId, removePhoto]
  );

  const handleUpdateNotes = useCallback(
    (photoId: string, notes: string) => {
      updatePhoto(activeRoomId, photoId, { notes });
    },
    [activeRoomId, updatePhoto]
  );

  const handleLightboxOpen = useCallback((photoId: string) => {
    setLightboxPhotoId(photoId);
  }, []);

  const handleLightboxClose = useCallback(() => {
    setLightboxPhotoId(null);
  }, []);

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Camera className="w-6 h-6 text-accent" />
          <h1 className="section-title">实景照片</h1>
        </div>
        <p className="section-subtitle ml-9">按空间上传实景照片，点击照片查看大图</p>
      </div>

      <div className="gold-divider mb-6" />

      {/* Room Tabs */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max pb-1">
          {rooms.map((room) => (
            <button
              key={room.id}
              className={room.id === activeRoomId ? 'tab-active' : 'tab'}
              onClick={() => setActiveRoomId(room.id)}
            >
              {room.name}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Upload Area */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-text-primary">
            {currentRoom?.name || ''} 照片
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Calendar className="w-3.5 h-3.5" />
            <span>拍照日期自动记录</span>
          </div>
        </div>

        <PhotoUploader
          photos={roomPhotos}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onUpdateNotes={handleUpdateNotes}
          category={currentRoom?.name}
          onLightboxOpen={handleLightboxOpen}
        />
      </Card>

      {/* 大图灯箱 */}
      {lightboxPhotoId && (
        <ImageLightbox
          src={`${API_BASE}/api/photos/${lightboxPhotoId}`}
          alt="照片大图"
          onClose={handleLightboxClose}
        />
      )}
    </div>
  );
};

export default PhotosPage;
