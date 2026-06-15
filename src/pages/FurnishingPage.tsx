import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingBag, Plus, Package } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { FurnishingItem } from '@/types';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import EmptyState from '@/components/common/EmptyState';
import ItemCard from '@/components/furnishing/ItemCard';
import ItemDetail from '@/components/furnishing/ItemDetail';
import AddItemForm from '@/components/furnishing/AddItemForm';
import { statusLabels } from '@/constants/furnishing';

const FurnishingPage: React.FC = () => {
  const { roomId: routeRoomId } = useParams<{ roomId: string }>();
  const rooms = useAppStore((s) => s.rooms);
  const furnishingItems = useAppStore((s) => s.furnishingItems);

  const [activeRoomId, setActiveRoomId] = useState(routeRoomId || rooms[0]?.id || 'entrance');
  const [selectedItem, setSelectedItem] = useState<FurnishingItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Auto-select room from route param
  React.useEffect(() => {
    if (routeRoomId && routeRoomId !== activeRoomId) {
      setActiveRoomId(routeRoomId);
    }
  }, [routeRoomId]);

  const roomItems = useMemo(
    () => furnishingItems.filter((item) => item.roomId === activeRoomId),
    [furnishingItems, activeRoomId]
  );

  const statusBreakdown = useMemo(() => {
    const breakdown: Record<FurnishingItem['status'], number> = {
      pending: 0,
      selected: 0,
      purchased: 0,
      installed: 0,
    };
    roomItems.forEach((item) => {
      breakdown[item.status]++;
    });
    return breakdown;
  }, [roomItems]);

  // Keep selectedItem in sync with store updates
  React.useEffect(() => {
    if (selectedItem) {
      const updated = furnishingItems.find((i) => i.id === selectedItem.id);
      if (updated) {
        setSelectedItem(updated);
      } else {
        setSelectedItem(null);
      }
    }
  }, [furnishingItems, selectedItem]);

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <ShoppingBag className="w-6 h-6 text-accent" />
          <h1 className="section-title">软装清单</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary ml-auto flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            添加物品
          </button>
        </div>
        <p className="section-subtitle ml-9">按空间管理需置办物品</p>
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

      {/* Summary Bar */}
      {roomItems.length > 0 && (
        <Card className="mb-6">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-accent" />
              <span className="text-sm text-text-secondary">
                共 <span className="text-text-primary font-medium">{roomItems.length}</span> 件物品
              </span>
            </div>
            <div className="h-4 w-px bg-border-subtle" />
            {Object.entries(statusBreakdown).map(([status, count]) => {
              if (count === 0) return null;
              return (
                <div key={status} className="flex items-center gap-1.5">
                  <Badge variant={status as FurnishingItem['status']}>
                    {statusLabels[status as FurnishingItem['status']]}
                  </Badge>
                  <span className="text-sm text-text-secondary">{count}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Item Grid */}
      {roomItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roomItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ShoppingBag className="w-12 h-12 text-text-muted" />}
          title="暂无软装物品"
          description='点击上方"添加物品"按钮，开始为该空间规划软装清单'
          action={
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              添加物品
            </button>
          }
        />
      )}

      {/* Item Detail Panel */}
      {selectedItem && (
        <ItemDetail
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* Add Item Form Modal */}
      {showAddForm && (
        <AddItemForm
          roomId={activeRoomId}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default FurnishingPage;
