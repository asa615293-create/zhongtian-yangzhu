import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Check, Minus, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Card from '@/components/common/Card';

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
        <p className="section-subtitle ml-9">基础信息</p>
      </div>

      <div className="gold-divider mb-6" />

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {infoItems.map((item) => (
          <Card key={item.label}>
            <div className="space-y-2">
              <label className="form-label">{item.label}</label>
              <div className="text-lg text-text-primary">
                {item.isReact ? item.value : (item.value as string)}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Delivery Standard Link */}
      <div className="mt-8">
        <Card
          hover
          onClick={() => navigate('/archive/delivery')}
          className="flex items-center justify-between"
        >
          <div>
            <h3 className="text-text-primary font-medium">精装交付标准</h3>
            <p className="text-sm text-text-muted mt-1">逐空间记录精装交付配置</p>
          </div>
          <ArrowRight className="w-5 h-5 text-text-muted" />
        </Card>
      </div>
    </div>
  );
};

export default ArchivePage;
