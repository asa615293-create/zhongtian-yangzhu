import { useLocation, NavLink } from 'react-router-dom';
import { Save, Download, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';

const routeLabels: Record<string, string> = {
  '/': '概览',
  '/archive': '房屋档案',
  '/archive/delivery': '精装交付标准',
  '/archive/photos': '实景照片',
  '/archive/measurements': '尺寸测量',
  '/archive/systems': '三大件与智能',
  '/furnishing': '软装清单',
  '/design': '设计方案',
  '/budget': '预算总览',
};

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const exportData = useAppStore((s) => s.exportData);
  const [saveNotice, setSaveNotice] = useState(false);

  const currentLabel = routeLabels[location.pathname] || '概览';

  // Build breadcrumb segments
  const segments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs: { label: string; path: string }[] = [{ label: '概览', path: '/' }];
  let accumulated = '';
  for (const seg of segments) {
    accumulated += '/' + seg;
    const label = routeLabels[accumulated] || seg;
    breadcrumbs.push({ label, path: accumulated });
  }

  const canGoBack = location.pathname !== '/';

  const handleSave = () => {
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 2000);
  };

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `央著软装方案_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="sticky top-0 z-20 bg-bg-secondary/80 backdrop-blur-md border-b border-border-subtle">
      {/* Desktop breadcrumb layout */}
      <div className="hidden lg:flex items-center justify-between h-12 px-6">
        <div className="flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.path} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-text-muted">/</span>}
              {i < breadcrumbs.length - 1 ? (
                <NavLink to={crumb.path} className="text-text-muted hover:text-text-secondary transition-colors">
                  {crumb.label}
                </NavLink>
              ) : (
                <span className="text-text-primary font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {saveNotice && (
            <span className="text-xs text-accent animate-pulse mr-2">已保存</span>
          )}
          <button
            onClick={handleSave}
            className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs"
          >
            <Save size={14} />
            <span>保存</span>
          </button>
          <button
            onClick={handleExport}
            className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs"
          >
            <Download size={14} />
            <span>导出</span>
          </button>
        </div>
      </div>

      {/* Mobile layout - simplified */}
      <div className="flex lg:hidden items-center justify-between h-12 px-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {canGoBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors flex-shrink-0"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <h1 className="text-sm font-medium text-text-primary truncate">{currentLabel}</h1>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {saveNotice && (
            <span className="text-xs text-accent animate-pulse mr-1">已保存</span>
          )}
          <button
            onClick={handleExport}
            className="p-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
            title="导出数据"
          >
            <Download size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
