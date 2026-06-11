import React, { useState, useMemo } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Package,
  Download,
  ArrowUpDown,
  ChevronRight,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useAppStore } from '@/store/useAppStore';
import type { FurnishingItem } from '@/types';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';

// ─── Chart Colors ───────────────────────────────────────────────────────────────
const CHART_COLORS = [
  '#C4A265', // accent - 香槟金
  '#5C4A3A', // brown - 深咖
  '#B5B0A8', // 浅灰米
  '#8B7355', // 暖棕
  '#A08060', // 琥珀
  '#6B5B4A', // 暗褐
  '#D4B275', // accent-hover
  '#7A6A5A', // 灰棕
  '#9C8C7C', // 暖灰
  '#4A3A2A', // 深棕
];

// ─── Helpers ────────────────────────────────────────────────────────────────────
const formatCurrency = (value: number): string => {
  if (value >= 10000) {
    return `¥${(value / 10000).toFixed(1)}万`;
  }
  return `¥${value.toLocaleString()}`;
};

const formatCurrencyFull = (value: number): string => {
  return `¥${value.toLocaleString()}`;
};

// ─── Custom Tooltip ─────────────────────────────────────────────────────────────
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: { name: string; value: number; fill: string };
  }>;
}

const CustomPieTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="bg-bg-secondary border border-border-subtle rounded-lg px-3 py-2 shadow-xl">
      <div className="flex items-center gap-2">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: data.payload.fill }}
        />
        <span className="text-sm text-text-primary">{data.name}</span>
      </div>
      <p className="text-sm text-accent font-medium mt-1">
        {formatCurrencyFull(data.value)}
      </p>
    </div>
  );
};

const CustomBarTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="bg-bg-secondary border border-border-subtle rounded-lg px-3 py-2 shadow-xl">
      <p className="text-sm text-text-primary">{data.name}</p>
      <p className="text-sm text-accent font-medium mt-1">
        {formatCurrencyFull(data.value)}
      </p>
    </div>
  );
};

// ─── Status Labels ──────────────────────────────────────────────────────────────
const statusLabels: Record<FurnishingItem['status'], string> = {
  pending: '待选',
  selected: '已选',
  purchased: '已购',
  installed: '已安装',
};

// ─── Sort Types ─────────────────────────────────────────────────────────────────
type SortField = 'name' | 'room' | 'category' | 'budgetMax' | 'actualAmount' | 'status';
type SortDir = 'asc' | 'desc';

// ─── BudgetPage ─────────────────────────────────────────────────────────────────
const BudgetPage: React.FC = () => {
  const rooms = useAppStore((s) => s.rooms);
  const furnishingItems = useAppStore((s) => s.furnishingItems);

  const [sortField, setSortField] = useState<SortField>('budgetMax');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // ─── Summary Calculations ───────────────────────────────────────────────────
  const summary = useMemo(() => {
    const totalBudget = furnishingItems.reduce(
      (sum, item) => sum + (item.budgetMax || 0),
      0
    );
    const totalActual = furnishingItems.reduce(
      (sum, item) => {
        if (item.status === 'purchased' || item.status === 'installed') {
          return sum + (item.budgetMax || 0);
        }
        return sum;
      },
      0
    );
    const remaining = totalBudget - totalActual;
    return {
      totalBudget,
      totalActual,
      remaining,
      itemCount: furnishingItems.length,
    };
  }, [furnishingItems]);

  // ─── Category Data for Pie Chart ────────────────────────────────────────────
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    furnishingItems.forEach((item) => {
      const budget = item.budgetMax || 0;
      map.set(item.category, (map.get(item.category) || 0) + budget);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [furnishingItems]);

  // ─── Room Data for Bar Chart ────────────────────────────────────────────────
  const roomData = useMemo(() => {
    const map = new Map<string, number>();
    furnishingItems.forEach((item) => {
      const budget = item.budgetMax || 0;
      const roomName = rooms.find((r) => r.id === item.roomId)?.name || item.roomId;
      map.set(roomName, (map.get(roomName) || 0) + budget);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [furnishingItems, rooms]);

  // ─── Sorted Table Data ──────────────────────────────────────────────────────
  const sortedItems = useMemo(() => {
    const items = [...furnishingItems];
    return items.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = a.name.localeCompare(b.name, 'zh');
          break;
        case 'room': {
          const roomA = rooms.find((r) => r.id === a.roomId)?.name || '';
          const roomB = rooms.find((r) => r.id === b.roomId)?.name || '';
          cmp = roomA.localeCompare(roomB, 'zh');
          break;
        }
        case 'category':
          cmp = a.category.localeCompare(b.category, 'zh');
          break;
        case 'budgetMax':
          cmp = (a.budgetMax || 0) - (b.budgetMax || 0);
          break;
        case 'actualAmount':
          cmp = (a.status === 'purchased' || a.status === 'installed' ? a.budgetMax || 0 : 0) -
                (b.status === 'purchased' || b.status === 'installed' ? b.budgetMax || 0 : 0);
          break;
        case 'status': {
          const order: Record<FurnishingItem['status'], number> = {
            pending: 0,
            selected: 1,
            purchased: 2,
            installed: 3,
          };
          cmp = order[a.status] - order[b.status];
          break;
        }
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [furnishingItems, sortField, sortDir, rooms]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  // ─── CSV Export ─────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const headers = ['物品名称', '所属空间', '品类', '预算最低', '预算最高', '实际支出', '状态', '优先级'];
    const rows = furnishingItems.map((item) => {
      const roomName = rooms.find((r) => r.id === item.roomId)?.name || item.roomId;
      const actualAmount =
        item.status === 'purchased' || item.status === 'installed' ? item.budgetMax || 0 : 0;
      return [
        item.name,
        roomName,
        item.category,
        item.budgetMin || '',
        item.budgetMax || '',
        actualAmount,
        statusLabels[item.status],
        item.priority === 'must' ? '必选' : item.priority === 'recommended' ? '推荐' : '可选',
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => {
          const str = String(cell);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(',')
      ),
    ].join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `预算总览_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const SortHeader: React.FC<{ field: SortField; label: string }> = ({ field, label }) => (
    <th
      className="px-3 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider cursor-pointer hover:text-text-secondary transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown
          className={`w-3 h-3 ${sortField === field ? 'text-accent' : 'text-text-muted/50'}`}
        />
      </div>
    </th>
  );

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Wallet className="w-6 h-6 text-accent" />
          <h1 className="section-title">预算总览</h1>
          <button
            onClick={handleExportCSV}
            className="btn-secondary ml-auto flex items-center gap-1.5 text-sm"
          >
            <Download className="w-4 h-4" />
            导出预算表
          </button>
        </div>
        <p className="section-subtitle ml-9">软装预算分配与支出追踪</p>
      </div>

      <div className="gold-divider mb-6" />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent to-accent/20" />
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-accent" />
            <span className="text-xs text-text-muted uppercase tracking-wider">总预算</span>
          </div>
          <p className="text-xl font-display font-semibold text-text-primary">
            {formatCurrency(summary.totalBudget)}
          </p>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-success to-success/20" />
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-xs text-text-muted uppercase tracking-wider">已支出</span>
          </div>
          <p className="text-xl font-display font-semibold text-success">
            {formatCurrency(summary.totalActual)}
          </p>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-warning to-warning/20" />
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-warning" />
            <span className="text-xs text-text-muted uppercase tracking-wider">剩余</span>
          </div>
          <p className="text-xl font-display font-semibold text-warning">
            {formatCurrency(summary.remaining)}
          </p>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-brown to-brown/20" />
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-brown" />
            <span className="text-xs text-text-muted uppercase tracking-wider">物品数</span>
          </div>
          <p className="text-xl font-display font-semibold text-text-primary">
            {summary.itemCount}
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Category Pie Chart */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full bg-accent" />
            <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">
              品类预算分布
            </span>
          </div>
          {categoryData.length > 0 ? (
            <div className="relative">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-xs text-text-muted">总预算</p>
                  <p className="text-lg font-display font-semibold text-accent">
                    {formatCurrency(summary.totalBudget)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-text-muted text-sm">
              暂无数据
            </div>
          )}
          {/* Legend */}
          {categoryData.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                  />
                  <span className="text-xs text-text-muted">{entry.name}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Room Bar Chart */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full bg-brown" />
            <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">
              空间预算分布
            </span>
          </div>
          {roomData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={roomData}
                layout="vertical"
                margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: '#6E6E73', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                  tickFormatter={(v: number) => v >= 10000 ? `${(v / 10000).toFixed(0)}万` : `${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={60}
                  tick={{ fill: '#A8A8AD', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                  {roomData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-text-muted text-sm">
              暂无数据
            </div>
          )}
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">
              预算明细
            </span>
            <span className="text-xs text-text-muted">{furnishingItems.length} 项</span>
          </div>
        </div>

        {sortedItems.length > 0 ? (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-border-subtle">
                  <SortHeader field="name" label="物品名称" />
                  <SortHeader field="room" label="所属空间" />
                  <SortHeader field="category" label="品类" />
                  <SortHeader field="budgetMax" label="预算区间" />
                  <SortHeader field="actualAmount" label="实际支出" />
                  <SortHeader field="status" label="状态" />
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((item) => {
                  const roomName =
                    rooms.find((r) => r.id === item.roomId)?.name || item.roomId;
                  const actualAmount =
                    item.status === 'purchased' || item.status === 'installed'
                      ? item.budgetMax || 0
                      : 0;
                  const budgetRange =
                    item.budgetMin && item.budgetMax
                      ? `${formatCurrencyFull(item.budgetMin)} - ${formatCurrencyFull(item.budgetMax)}`
                      : item.budgetMax
                      ? formatCurrencyFull(item.budgetMax)
                      : '未设定';

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-border-subtle/50 hover:bg-bg-card/50 transition-colors cursor-pointer"
                    >
                      <td className="px-3 py-3">
                        <span className="text-sm text-text-primary font-medium">
                          {item.name}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-sm text-text-secondary">{roomName}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-xs text-text-muted bg-bg-card px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-sm text-text-secondary">{budgetRange}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`text-sm font-medium ${
                            actualAmount > 0 ? 'text-success' : 'text-text-muted'
                          }`}
                        >
                          {actualAmount > 0 ? formatCurrencyFull(actualAmount) : '-'}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <Badge variant={item.status}>
                          {statusLabels[item.status]}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <Package className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <p className="text-text-muted text-sm">暂无软装物品数据</p>
            <p className="text-text-muted/60 text-xs mt-1">添加软装物品后，预算明细将自动生成</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BudgetPage;
