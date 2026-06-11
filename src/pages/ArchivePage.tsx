import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Check, Minus, ArrowRight, ClipboardList, Camera, Ruler, Wind } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Card from '@/components/common/Card';

const subPages = [
  {
    label: '精装交付标准',
    description: '逐空间记录精装交付配置',
    path: '/archive/delivery',
    icon: ClipboardList,
  },
  {
    label: '实景照片',
    description: '按空间上传实景照片',
    path: '/archive/photos',
    icon: Camera,
  },
  {
    label: '尺寸测量',
    description: '记录各空间精确尺寸',
    path: '/archive/measurements',
    icon: Ruler,
  },
  {
    label: '三大件与智能',
    description: '空调/新风/地暖/智能系统',
    path: '/archive/systems',
    icon: Wind,
  },
];

const ArchivePage: React.FC = () => {
  const property = useAppStore((s) => s.property);
  const navigate = useNavigate();

  const formatPrice = (value: number) => {
    return value.toLocaleString('zh-CN') + ' 元';
  };

  const formatArea = (value: number) => {
    return `${value} ㎡`;
  };

  const renderBoolean = (value: boolean) => {
    return value ? (
      <Check className="w-5 h-5 text-accent" />
    ) : (
      <Minus className="w-5 h-5 text-text-muted" />
    );
  };

  const infoItems = [
    { label: '楼盘名称', value: property.name },
    { label: '位置', value: property.location },
    { label: '户型', value: property.unitType },
    { label: '合同面积', value: formatArea(property.area) },
    { label: '楼层', value: property.floor },
    { label: '总房款', value: formatPrice(property.totalPrice) },
    { label: '定金', value: formatPrice(property.deposit) },
    { label: '缴纳日期', value: property.depositDate },
    { label: '交房日期', value: property.deliveryDate },
    { label: '交付标准', value: property.deliveryStandard },
    { label: '一梯一户', value: renderBoolean(property.privateElevator), isReact: true },
    { label: '270°环幕', value: renderBoolean(property.panoramicWindow), isReact: true },
  ];

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Building2 className="w-6 h-6 text-accent" />
          <h1 className="section-title">房屋档案</h1>
        </div>
        <p className="section-subtitle ml-9">基础信息与详细档案</p>
      </div>

      <div className="gold-divider mb-6" />

      {/* Sub-page Navigation Cards - mobile-first */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {subPages.map((sub) => {
          const Icon = sub.icon;
          return (
            <Card
              key={sub.path}
              hover
              onClick={() => navigate(sub.path)}
              className="flex flex-col items-center text-center py-5 px-3"
            >
              <div className="w-10 h-10 rounded-lg bg-accent-muted flex items-center justify-center mb-2.5">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-sm font-medium text-text-primary mb-1">{sub.label}</h3>
              <p className="text-[11px] text-text-muted leading-tight">{sub.description}</p>
            </Card>
          );
        })}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {infoItems.map((item) => (
          <Card key={item.label}>
            <div className="space-y-1.5">
              <label className="form-label">{item.label}</label>
              <div className="text-base text-text-primary">
                {item.isReact ? item.value : (item.value as string)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ArchivePage;
