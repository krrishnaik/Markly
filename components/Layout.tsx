import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Link, useLocation } from 'react-router-dom';

declare const gsap: any;

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean }> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 mb-1 ${
      active
        ? 'bg-primary-50 text-primary-700 border border-primary-100/50'
        : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
    }`}
  >
    <span className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${active ? 'text-primary-600' : 'text-stone-400 group-hover:text-stone-500'}`}>
      {icon}
    </span>
    {label}
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple GSAP page transition
    if (contentRef.current && typeof gsap !== 'undefined') {
      gsap.fromTo(contentRef.current, 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [location.pathname]);

  if (!user) return <>{children}</>;

  const getNavLinks = () => {
    switch (user.role) {
      case UserRole.STUDENT:
        return [
          { to: '/dashboard', label: 'Dashboard', icon: '📊' },
          { to: '/attendance', label: 'My Attendance', icon: '📅' },
          { to: '/profile', label: 'Profile', icon: '👤' },
        ];
      case UserRole.LEAD:
        return [
          { to: '/dashboard', label: 'Club Dashboard', icon: '⚡' },
          { to: '/mark-attendance', label: 'Mark Attendance', icon: '📝' },
          { to: '/profile', label: 'Profile', icon: '👤' },
        ];
      case UserRole.FACULTY:
        return [
          { to: '/dashboard', label: 'Overview', icon: '🎓' },
          { to: '/conflicts', label: 'Lecture Conflicts', icon: '⚠️' },
          { to: '/profile', label: 'Faculty Profile', icon: '👤' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row font-sans text-stone-900">
      {/* Sidebar - Desktop */}
      <aside className="w-full md:w-72 bg-white border-r border-stone-200 flex-shrink-0 z-20 flex flex-col shadow-sm">
        <div className="h-20 flex items-center px-8 border-b border-stone-100">
          <div className="text-xl font-bold text-primary-700 flex items-center gap-3 tracking-tight">
            <span className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 shadow-sm border border-primary-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
            </span>
            Markly
          </div>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="px-4 mb-4 text-xs font-bold text-stone-400 uppercase tracking-widest">
            {user.role === 'LEAD' ? 'Committee Lead' : user.role} Workspace
          </div>
          <nav className="space-y-1">
            {getNavLinks().map((link) => (
                <NavLink 
                key={link.to} 
                to={link.to} 
                icon={link.icon} 
                label={link.label} 
                active={location.pathname === link.to}
                />
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-4 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-secondary-200 flex items-center justify-center text-sm font-bold text-secondary-700 border border-secondary-300">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-900 truncate">{user.name}</p>
              <p className="text-xs text-stone-500 truncate capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="mt-4 w-full flex items-center justify-center px-3 py-2 text-xs font-semibold text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors border border-transparent hover:border-rose-100"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-stone-200 h-16 flex items-center justify-between px-6 shadow-sm">
          <span className="font-bold text-primary-700 text-lg flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-primary-100 text-primary-700 flex items-center justify-center text-xs">M</span>
            Markly
          </span>
          <button onClick={logout} className="text-sm font-medium text-stone-500">Sign Out</button>
        </header>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto bg-stone-50 p-6 md:p-10 relative">
          
          <div ref={contentRef} className="relative z-10 max-w-6xl mx-auto space-y-8">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
};