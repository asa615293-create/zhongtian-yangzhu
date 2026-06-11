import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShoppingBag, Palette, Wallet, ClipboardList, Camera, Plus, Eye } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

import Card from '@/components/common/Card';

const Dashboard: React.FC = () => {
  const property = useAppStore((s) => s.property);
  const rooms = useAppStore((s) => s.rooms);
  const deliverySpecs = useAppStore((s) => s.deliverySpecs);
  const furnishingItems = useAppStore((s) => s.furnishingItems);
  const designSchemes = useAppStore((s) => s.designSchemes);
  const budgetTarget = useAppStore((s) => s.budgetTarget);

  // 计算已填写交付标准的房间数
  const roomsWithSpecs = rooms.filter((room) => {
    const specs = deliverySpecs[room.id];
    return specs && specs.length > 0 && specs.some((spec) => spec.value || spec.brand || spec.model);
  }).length;

  // 计算已支出
  const totalActual = furnishingItems.reduce((sum, item) => {
    if (item.status === 'purchased' || item.status === 'installed') {
      return sum + (item.actualPrice ?? item.budgetMax ?? 0);
    }
    return sum;
  }, 0);

  const formatBudget = (value: number) => {
    if (value >= 10000) {
      return `¥${(value / 10000).toFixed(1)}万`;
    }
    return `¥${value.toLocaleString('zh-CN')}`;
  };

  // 软装进度
  const installedCount = furnishingItems.filter((i) => i.status === 'installed').length;
  const purchasedCount = furnishingItems.filter((i) => i.status === 'purchased').length;
  const furnishingProgress = furnishingItems.length > 0
    ? Math.round(((installedCount + purchasedCount) / furnishingItems.length) * 100)
    : 0;

  const progressCards = [
    {
      icon: Building2,
      label: '房屋档案',
      value: `${roomsWithSpecs}/${rooms.length}`,
      sublabel: '已记录',
      link: '/archive',
    },
    {
      icon: ShoppingBag,
      label: '软装清单',
      value: `${furnishingProgress}%`,
      sublabel: `${installedCount + purchasedCount}/${furnishingItems.length} 已落实`,
      link: '/furnishing',
    },
    {
      icon: Palette,
      label: '设计方案',
      value: `${designSchemes.length}`,
      sublabel: '个方案',
      link: '/design',
    },
    {
      icon: Wallet,
      label: '预算管理',
      value: totalActual > 0 ? `${formatBudget(totalActual)}` : formatBudget(budgetTarget),
      sublabel: totalActual > 0 ? '已支出' : '总预算',
      link: '/budget',
    },
  ];

  const quickActions = [
    {
      icon: ClipboardList,
      label: '记录精装标准',
      link: '/archive/delivery',
    },
    {
      icon: Camera,
      label: '上传实景照片',
      link: '/archive/photos',
    },
    {
      icon: Plus,
      label: '添加软装物品',
      link: '/furnishing',
    },
    {
      icon: Eye,
      label: '查看设计方案',
      link: '/design',
    },
  ];

  return (
    <div className="fade-in space-y-10">
      {/* Hero Section */}
      <div className="text-center py-8 md:py-12">
        <h1 className="font-display text-4xl md:text-5xl text-accent tracking-wide mb-3">
          中天·央著
        </h1>
        <p className="text-lg text-text-secondary tracking-widest mb-6">
          软装需求设计书
        </p>
        <div className="gold-divider max-w-xs mx-auto mb-8" />
        <div className="flex items-center justify-center gap-2 md:gap-3 text-sm text-text-secondary flex-wrap">
          <span>{property.area}㎡</span>
          <span className="text-text-muted">·</span>
          <span>{property.floor}</span>
          <span className="text-text-muted">·</span>
          <span>{property.unitType.replace(/^[^\s]+\s/, '')}</span>
          <span className="text-text-muted">·</span>
          <span>2026.12交付</span>
        </div>
      </div>

      {/* Progress Overview Section */}
      <section>
        <h2 className="section-title mb-4">项目概览</h2>
        <div className="gold-divider mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {progressCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.label} to={card.link}>
                <Card hover className="border-t-2 border-accent/30 h-full">
                  <div className="flex flex-col items-center text-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-lg bg-accent-muted flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-semibold text-text-primary">
                        {card.value}
                      </div>
                      <div className="text-xs text-text-muted mt-1">{card.sublabel}</div>
                    </div>
                    <div className="text-sm text-text-secondary">{card.label}</div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick Actions Section */}
      <section>
        <h2 className="section-title mb-4">快捷操作</h2>
        <div className="gold-divider mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} to={action.link}>
                <button className="btn-secondary w-full flex items-center justify-center gap-2 py-3">
                  <Icon className="w-4 h-4 text-accent" />
                  <span className="text-sm">{action.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
