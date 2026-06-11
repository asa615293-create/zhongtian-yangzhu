import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, ShoppingBag, Palette, Wallet } from 'lucide-react';

const tabs = [
  { label: '概览', path: '/', icon: LayoutDashboard, end: true },
  { label: '档案', path: '/archive', icon: Building2, end: false },
  { label: '清单', path: '/furnishing', icon: ShoppingBag, end: true },
  { label: '方案', path: '/design', icon: Palette, end: true },
  { label: '预算', path: '/budget', icon: Wallet, end: true },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-bg-secondary/95 backdrop-blur-lg border-t border-border-subtle safe-bottom">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const isActive = tab.path === '/'
            ? location.pathname === '/'
            : tab.path === '/archive'
            ? location.pathname.startsWith('/archive')
            : location.pathname === tab.path;

          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.end || tab.path === '/archive'}
              className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors duration-150 -webkit-tap-highlight-color-transparent ${
                isActive ? 'text-accent' : 'text-text-muted'
              }`}
            >
              <tab.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              <span className={`text-[10px] ${isActive ? 'font-medium' : ''}`}>{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
