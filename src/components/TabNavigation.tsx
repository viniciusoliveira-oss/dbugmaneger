import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, BarChart3, Settings } from 'lucide-react';

export default function TabNavigation() {
  const location = useLocation();

  const tabs = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Ordens', icon: FileText, path: '/orders' },
    { label: 'Usuários', icon: Users, path: '/users' },
    { label: 'Relatórios', icon: BarChart3, path: '/reports' },
    { label: 'Mais', icon: Settings, path: '#' },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] border-t border-primary/20 backdrop-blur-xl z-40">
      <div className="max-w-[120rem] mx-auto px-4">
        <div className="flex items-center justify-center gap-2 py-4">
          {tabs.map((tab) => {
            const active = isActive(tab.path);
            return (
              <Link
                key={tab.label}
                to={tab.path}
                className={`flex flex-col items-center gap-1 px-6 py-3 rounded-2xl transition-all duration-300 relative group ${
                  active
                    ? 'bg-gradient-to-r from-primary/30 to-primary/10 border border-primary/50'
                    : 'hover:bg-primary/10 border border-transparent'
                }`}
              >
                <div className={`relative ${active ? 'text-primary' : 'text-foreground/60 group-hover:text-primary'} transition-colors`}>
                  <tab.icon className="w-5 h-5" />
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
                  )}
                </div>
                <span className={`font-heading text-xs uppercase tracking-widest transition-colors ${
                  active ? 'text-primary font-bold' : 'text-foreground/60 group-hover:text-primary'
                }`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Gradient accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </nav>
  );
}
