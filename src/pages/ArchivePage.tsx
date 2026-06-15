import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Check, Minus, ArrowRight, ClipboardList, Camera, Ruler, Wind, Edit3, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Card from '@/components/common/Card';

const subPages = [
  { label: '精装交付标准', description: '逐空间记录精装交付配置', path: '/archive/delivery', icon: ClipboardList },
  { label: '实景照片', description: '按空间上传实景照片', path: '/archive/photos', icon: Camera },
  { label: '尺寸测量', description: '记录各空间精确尺寸', path: '/archive/measurements', icon: Ruler },
  { label: '三大件与智能', description: '空调/新风/地暖/智能系统', path: '/archive/systems', icon: Wind },
];

const ArchivePage: React.FC = () => {
  const property = useAppStore((s) => s.property);
  const updateProperty = useAppStore((s) => s.updateProperty);
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(property);

  const startEdit = () => {
    setEditData(property);
    setEditing(true);
  };

  const saveEdit = () => {
    updateProperty(editData);
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditData(property);
    setEditing(false);
  };

  const renderBoolean = (value: boolean) => {
    return value ? <Check className="w-5 h-5 text-accent" /> : <Minus className="w-5 h-5 text-text-muted" />;
  };

  const infoItems = [
    { label: '楼盘名称', key: 'name' as const, type: 'text' },
    { label: '位置', key: 'location' as const, type: 'text' },
    { label: '户型', key: 'unitType' as const, type: 'text' },
    { label: '合同面积', key: 'area' as const, type: 'number', suffix: '㎡' },
    { label: '楼层', key: 'floor' as const, type: 'text' },
    { label: '总房款', key: 'totalPrice' as const, type: 'number', prefix: '¥' },
    { label: '定金', key: 'deposit' as const, type: 'number', prefix: '¥' },
    { label: '缴纳日期', key: 'depositDate' as const, type: 'date' },
    { label: '交房日期', key: 'deliveryDate' as const, type: 'date' },
    { label: '交付标准', key: 'deliveryStandard' as const, type: 'text' },
  ];

  const booleanItems = [
    { label: '一梯一户', key: 'privateElevator' as const },
    { label: '270°环幕', key: 'panoramicWindow' as const },
  ];

  return (
    <div className="fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Building2 className="w-6 h-6 text-accent" />
          <h1 className="section-title">房屋档案</h1>
          <div className="ml-auto">
            {editing ? (
              <div className="flex items-center gap-2">
                <button onClick={saveEdit} className="btn-primary flex items-center gap-1.5 text-xs py-1.5">
                  <Check className="w-3.5 h-3.5" /> 保存
                </button>
                <button onClick={cancelEdit} className="btn-ghost flex items-center gap-1.5 text-xs py-1.5">
                  <X className="w-3.5 h-3.5" /> 取消
                </button>
              </div>
            ) : (
              <button onClick={startEdit} className="btn-ghost flex items-center gap-1.5 text-xs py-1.5">
                <Edit3 className="w-3.5 h-3.5" /> 编辑
              </button>
            )}
          </div>
        </div>
        <p className="section-subtitle ml-9">基础信息与详细档案</p>
      </div>

      <div className="gold-divider mb-6" />

      <div className="grid grid-cols-2 gap-3 mb-8">
        {subPages.map((sub) => {
          const Icon = sub.icon;
          return (
            <Card key={sub.path} hover onClick={() => navigate(sub.path)} className="flex flex-col items-center text-center py-5 px-3">
              <div className="w-10 h-10 rounded-lg bg-accent-muted flex items-center justify-center mb-2.5">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-sm font-medium text-text-primary mb-1">{sub.label}</h3>
              <p className="text-[11px] text-text-muted leading-tight">{sub.description}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {infoItems.map((item) => (
          <Card key={item.key}>
            <div className="space-y-1.5">
              <label className="form-label">{item.label}</label>
              {editing ? (
                <div className="relative">
                  {item.prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">{item.prefix}</span>}
                  <input
                    type={item.type}
                    value={editData[item.key]}
                    onChange={(e) => setEditData({ ...editData, [item.key]: item.type === 'number' ? Number(e.target.value) : e.target.value })}
                    className={`form-input w-full text-base ${item.prefix ? 'pl-7' : ''}`}
                  />
                  {item.suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">{item.suffix}</span>}
                </div>
              ) : (
                <div className="text-base text-text-primary">
                  {item.prefix}{item.key === 'area' ? `${property[item.key]} ㎡` : item.key === 'totalPrice' || item.key === 'deposit' ? property[item.key].toLocaleString('zh-CN') : property[item.key]}
                </div>
              )}
            </div>
          </Card>
        ))}
        {booleanItems.map((item) => (
          <Card key={item.key}>
            <div className="space-y-1.5">
              <label className="form-label">{item.label}</label>
              {editing ? (
                <button
                  onClick={() => setEditData({ ...editData, [item.key]: !editData[item.key] })}
                  className={`p-2 rounded-lg border transition-colors ${editData[item.key] ? 'bg-accent-muted border-accent/30 text-accent' : 'bg-bg-card border-border-subtle text-text-muted'}`}
                >
                  {editData[item.key] ? '是' : '否'}
                </button>
              ) : (
                <div className="text-base text-text-primary">{renderBoolean(property[item.key])}</div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ArchivePage;
