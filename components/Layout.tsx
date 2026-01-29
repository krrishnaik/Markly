import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Link, useLocation } from 'react-router-dom';

declare const gsap: any;

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, active, collapsed }) => (
  <Link
    to={to}
    className={`group flex items-center ${collapsed ? 'justify-center px-2' : 'px-4'} py-3 text-sm font-medium rounded-lg transition-all duration-200 mb-1.5 relative ${
      active
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
    title={collapsed ? label : undefined}
  >
    <span className={`${collapsed ? '' : 'mr-3'} h-5 w-5 flex-shrink-0 transition-colors ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
      {icon}
    </span>
    {!collapsed && <span>{label}</span>}
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Simple GSAP page transition
    if (contentRef.current && typeof gsap !== 'undefined') {
      gsap.fromTo(contentRef.current, 
        { opacity: 0, y: 10 }, 
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
    <div className="min-h-screen bg-bg-DEFAULT flex flex-col md:flex-row font-sans text-slate-800">
      {/* Sidebar - Desktop (Kept Dark for Contrast) */}
      <aside 
        className={`${collapsed ? 'w-20' : 'w-72'} hidden md:flex bg-bg-sidebar border-r border-slate-800 flex-shrink-0 z-20 flex-col shadow-xl transition-all duration-300`}
      >
        <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'px-6 justify-between'} border-b border-slate-800`}>
          <div className="flex items-center gap-3 overflow-hidden">
             {!collapsed ? (
                 <>
                    <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-glow">M</span>
                    <span className="font-bold text-slate-100 text-lg tracking-tight whitespace-nowrap">Markly</span>
                 </>
             ) : (
                <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-glow">M</span>
             )}
          </div>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-500 hover:text-slate-300 p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            {collapsed ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
            )}
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          {!collapsed && (
            <div className="px-4 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {user.role === 'LEAD' ? 'Committee Lead' : user.role} Workspace
            </div>
          )}
          <nav className="space-y-1">
            {getNavLinks().map((link) => (
                <NavLink 
                key={link.to} 
                to={link.to} 
                icon={link.icon} 
                label={link.label} 
                active={location.pathname === link.to}
                collapsed={collapsed}
                />
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'px-2'}`}>
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300 border border-slate-600">
              {user.name.charAt(0)}
            </div>
            {!collapsed && (
                <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate capitalize">{user.role.toLowerCase()}</p>
                </div>
            )}
          </div>
          {!collapsed && (
              <button 
                onClick={logout}
                className="mt-4 w-full flex items-center justify-center px-3 py-2 text-xs font-semibold text-slate-400 hover:text-status-error hover:bg-slate-800 rounded-md transition-colors border border-transparent hover:border-slate-700/50"
              >
                Sign Out
              </button>
          )}
          {collapsed && (
              <button onClick={logout} className="mt-4 w-full flex justify-center text-slate-500 hover:text-status-error" title="Sign Out">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-bg-DEFAULT">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shadow-sm">
          <span className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <span className="w-7 h-7 rounded bg-primary-600 text-white flex items-center justify-center text-xs">M</span>
            Markly
          </span>
          <button onClick={logout} className="text-sm font-medium text-slate-500 hover:text-slate-800">Sign Out</button>
        </header>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-6 md:p-10 relative custom-scrollbar">
          
          <div ref={contentRef} className="relative z-10 max-w-6xl mx-auto space-y-8">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
};