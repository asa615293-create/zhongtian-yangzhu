import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, ShoppingBag, Palette, Wallet, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

const archiveSubItems = [
  { label: '精装交付标准', path: '/archive/delivery' },
  { label: '实景照片', path: '/archive/photos' },
  { label: '尺寸测量', path: '/archive/measurements' },
  { label: '三大件与智能', path: '/archive/systems' },
];

export default function Sidebar() {
  const location = useLocation();
  const isArchiveActive = location.pathname.startsWith('/archive');
  const property = useAppStore((s) => s.property);
  const [archiveExpanded, setArchiveExpanded] = useState(isArchiveActive);
  useEffect(() => {
    if (isArchiveActive) setArchiveExpanded(true);
  }, [isArchiveActive]);

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 h-screen fixed left-0 top-0 bg-bg-secondary border-r border-border-subtle z-30">
      {/* Logo */}
      <div className="px-6 py-6">
        <h1 className="font-display text-2xl text-accent">央著</h1>
        <p className="text-xs text-text-muted tracking-widest mt-1">软装方案</p>
      </div>

      <div className="gold-divider mx-4" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? 'nav-item-active' : 'nav-item')}
        >
          <LayoutDashboard size={18} />
          <span>概览</span>
        </NavLink>

        {/* 房屋档案 with sub-items */}
        <div>
          <div
            className={`${isArchiveActive ? 'nav-item-active' : 'nav-item'}`}
            onClick={() => setArchiveExpanded(!archiveExpanded)}
          >
            <Building2 size={18} />
            <span className="flex-1">房屋档案</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${archiveExpanded ? 'rotate-180' : ''}`}
            />
          </div>

          {archiveExpanded && (
            <div className="ml-6 mt-1 space-y-0.5">
              {archiveSubItems.map((sub) => (
                <NavLink
                  key={sub.path}
                  to={sub.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'text-accent bg-accent-muted'
                        : 'text-text-muted hover:text-text-secondary hover:bg-bg-card'
                    }`
                  }
                >
                  <span>{sub.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <NavLink
          to="/furnishing"
          className={({ isActive }) => (isActive ? 'nav-item-active' : 'nav-item')}
        >
          <ShoppingBag size={18} />
          <span>软装清单</span>
        </NavLink>

        <NavLink
          to="/design"
          className={({ isActive }) => (isActive ? 'nav-item-active' : 'nav-item')}
        >
          <Palette size={18} />
          <span>设计方案</span>
        </NavLink>

        <NavLink
          to="/budget"
          className={({ isActive }) => (isActive ? 'nav-item-active' : 'nav-item')}
        >
          <Wallet size={18} />
          <span>预算总览</span>
        </NavLink>
      </nav>

      <div className="gold-divider mx-4" />

      {/* Property info */}
      <div className="px-4 py-4">
        <p className="text-xs text-text-muted">{property.name} | {property.area}㎡ | {property.floor}</p>
      </div>
    </aside>
  );
}
