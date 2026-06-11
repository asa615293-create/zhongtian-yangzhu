import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, ShoppingBag, Palette, Wallet } from 'lucide-react';

const tabs = [
  { label: '概览', path: '/', icon: LayoutDashboard, end: true },
  { label: '档案', path: '/archive', icon: Building2, end: false },
  { label: '清单', path: '/furnishing', icon: ShoppingBag, end: true },
  { label: '方案', path: '/design', icon: Palette, end: true },
  { label: '预算', path: '/budget', icon: Wallet, end: true },
];

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-bg-secondary border-t border-border-subtle">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.end || tab.path === '/archive'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                isActive ? 'text-accent' : 'text-text-muted hover:text-text-secondary'
              }`
            }
          >
            <tab.icon size={20} />
            <span className="text-[10px]">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
