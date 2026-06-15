import React from 'react';
import { Image } from 'lucide-react';
import type { FurnishingItem } from '@/types';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { statusLabels, priorityLabels } from '@/constants/furnishing';

interface ItemCardProps {
  item: FurnishingItem;
  onClick: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  const hasBudget = item.budgetMin !== null && item.budgetMax !== null;
  const hasImages = item.referenceImages && item.referenceImages.length > 0;
  const isCustomPricing = item.pricingMode === 'custom';

  // 全屋定制投影面积计算
  const projectedArea = (item.cabinetWidth && item.cabinetHeight)
    ? ((item.cabinetWidth / 1000) * (item.cabinetHeight / 1000))
    : 0;

  return (
    <Card hover onClick={onClick} className="fade-in">
      <div className="flex gap-3">
        {/* Thumbnail */}
        {hasImages && (
          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-bg-card">
            <img
              src={item.referenceImages[0].base64Data}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {!hasImages && (
          <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-bg-card flex items-center justify-center">
            <Image className="w-6 h-6 text-text-muted" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-text-primary truncate">{item.name}</h4>
          <p className="text-xs text-text-secondary mt-0.5">{item.category}</p>

          {/* Badges */}
          <div className="flex items-center gap-1.5 mt-2">
            <Badge variant={item.priority}>{priorityLabels[item.priority]}</Badge>
            <Badge variant={item.status}>{statusLabels[item.status]}</Badge>
            {isCustomPricing && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent/80">定制</span>
            )}
          </div>

          {/* Budget */}
          <div className="mt-2">
            {isCustomPricing && projectedArea > 0 && item.unitPrice ? (
              <span className="text-xs text-accent">
                {projectedArea.toFixed(1)}㎡ × ¥{item.unitPrice}/㎡ = ¥{Math.round(projectedArea * item.unitPrice).toLocaleString()}
              </span>
            ) : hasBudget ? (
              <span className="text-xs text-accent">
                ¥{item.budgetMin!.toLocaleString()} - ¥{item.budgetMax!.toLocaleString()}
              </span>
            ) : (
              <span className="text-xs text-text-muted">预算未设定</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ItemCard;
