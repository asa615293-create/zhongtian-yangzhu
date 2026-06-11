import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, ShoppingBag, Palette, Wallet, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const tabs = [
  { label: '概览', path: '/', icon: LayoutDashboard, end: true },
  { label: '档案', path: '/archive', icon: Building2, end: false },
  { label: '清单', path: '/furnishing', icon: ShoppingBag, end: true },
  { label: '方案', path: '/design', icon: Palette, end: true },
  { label: '预算', path: '/budget', icon: Wallet, end: true },
];

const archiveSubItems = [
  { label: '交付标准', path: '/archive/delivery' },
  { label: '实景照片', path: '/archive/photos' },
  { label: '尺寸测量', path: '/archive/measurements' },
  { label: '三大件', path: '/archive/systems' },
];

export default function MobileNav() {
  const location = useLocation();
  const isArchiveActive = location.pathname.startsWith('/archive');
  const [archiveExpanded, setArchiveExpanded] = useState(false);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-bg-secondary/95 backdrop-blur-md border-t border-border-subtle safe-bottom">
      {/* Archive sub-navigation expandable */}
      {archiveExpanded && isArchiveActive && (
        <div className="border-b border-border-subtle bg-bg-secondary/95 backdrop-blur-md">
          <div className="flex items-center justify-around px-2 py-2">
            <NavLink
              to="/archive"
              end
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive ? 'text-accent bg-accent-muted' : 'text-text-secondary hover:text-text-primary'
                }`
              }
            >
              基本信息
            </NavLink>
            {archiveSubItems.map((sub) => (
              <NavLink
                key={sub.path}
                to={sub.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive ? 'text-accent bg-accent-muted' : 'text-text-secondary hover:text-text-primary'
                  }`
                }
              >
                {sub.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = tab.path === '/'
            ? location.pathname === '/'
            : tab.path === '/archive'
            ? isArchiveActive
            : location.pathname === tab.path;

          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.end || tab.path === '/archive'}
              onClick={() => {
                if (tab.path === '/archive' && isArchiveActive) {
                  setArchiveExpanded(!archiveExpanded);
                } else if (tab.path === '/archive') {
                  setArchiveExpanded(true);
                } else {
                  setArchiveExpanded(false);
                }
              }}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 -webkit-tap-highlight-color-transparent ${
                isActive ? 'text-accent' : 'text-text-muted active:text-text-secondary'
              }`}
            >
              <div className="relative">
                <tab.icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                {tab.path === '/archive' && isArchiveActive && (
                  <ChevronUp
                    size={10}
                    className={`absolute -top-1 -right-1.5 text-accent transition-transform duration-200 ${archiveExpanded ? '' : 'rotate-180'}`}
                  />
                )}
              </div>
              <span className="text-[11px] font-medium">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
