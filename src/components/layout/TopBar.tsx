import { useLocation, useNavigate } from 'react-router-dom';
import { Save, Download, ChevronLeft, Upload, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { isSaveError } from '@/store/useAppStore';
import { useState, useRef, useEffect } from 'react';

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
  const importData = useAppStore((s) => s.importData);
  const [saveNotice, setSaveNotice] = useState(false);
  const [showSaveError, setShowSaveError] = useState(false);
  const importInputRefDesktop = useRef<HTMLInputElement>(null);
  const importInputRefMobile = useRef<HTMLInputElement>(null);

  // 定期检查保存错误状态
  useEffect(() => {
    const interval = setInterval(() => {
      setShowSaveError(isSaveError());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentLabel = routeLabels[location.pathname] || '概览';
  const canGoBack = location.pathname !== '/';

  const segments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs: { label: string; path: string }[] = [{ label: '概览', path: '/' }];
  let accumulated = '';
  for (const seg of segments) {
    accumulated += '/' + seg;
    const label = routeLabels[accumulated] || seg;
    breadcrumbs.push({ label, path: accumulated });
  }

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

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      if (json) {
        importData(json);
        setSaveNotice(true);
        setTimeout(() => setSaveNotice(false), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-20 bg-bg-secondary/80 backdrop-blur-md border-b border-border-subtle">
      <div className="hidden lg:flex items-center justify-between h-12 px-6">
        <div className="flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.path} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-text-muted">/</span>}
              {i < breadcrumbs.length - 1 ? (
                <span onClick={() => navigate(crumb.path)} className="text-text-muted hover:text-text-secondary transition-colors cursor-pointer">
                  {crumb.label}
                </span>
              ) : (
                <span className="text-text-primary font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {showSaveError && (
            <span className="flex items-center gap-1 text-xs text-red-400 mr-2">
              <AlertTriangle size={12} />
              保存失败
            </span>
          )}
          {saveNotice && !showSaveError && (
            <span className="text-xs text-accent animate-pulse mr-2">已保存</span>
          )}
          <input ref={importInputRefDesktop} type="file" accept=".json" onChange={handleImport} className="hidden" />
          <button onClick={() => importInputRefDesktop.current?.click()} className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs">
            <Upload size={14} />
            <span>导入</span>
          </button>
          <button onClick={handleExport} className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs">
            <Download size={14} />
            <span>导出</span>
          </button>
        </div>
      </div>

      <div className="flex lg:hidden items-center h-12 px-2">
        {canGoBack ? (
          <button onClick={() => navigate(-1)} className="p-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors -webkit-tap-highlight-color-transparent">
            <ChevronLeft size={22} />
          </button>
        ) : (
          <div className="w-10" />
        )}
        <h1 className="flex-1 text-center text-sm font-medium text-text-primary truncate px-2">
          {currentLabel}
        </h1>
        <div className="flex items-center gap-1">
          <input ref={importInputRefMobile} type="file" accept=".json" onChange={handleImport} className="hidden" />
          <button onClick={() => importInputRefMobile.current?.click()} className="p-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors">
            <Upload size={18} />
          </button>
          <button onClick={handleExport} className="p-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors">
            <Download size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
