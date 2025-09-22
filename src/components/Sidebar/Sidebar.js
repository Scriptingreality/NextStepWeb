import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  HomeIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  BriefcaseIcon,
  ClockIcon,
  BookOpenIcon,
  BellIcon,
  CpuChipIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

// A compact, dark left sidebar inspired by the provided screenshot
const Sidebar = ({ collapsedDefault = false }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(collapsedDefault);

  useEffect(() => {
    const stored = localStorage.getItem('sidebar_collapsed');
    if (stored !== null) setCollapsed(stored === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', String(collapsed));
  }, [collapsed]);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: t('dashboard') || 'Dashboard', Icon: HomeIcon },
    { path: '/quiz', label: t('quiz') || 'Quiz', Icon: AcademicCapIcon },
    { path: '/colleges', label: t('colleges') || 'Colleges', Icon: BuildingLibraryIcon },
    { path: '/careers', label: t('careers') || 'Careers', Icon: BriefcaseIcon },
    { path: '/timeline', label: t('timeline') || 'Timeline', Icon: ClockIcon },
    { path: '/resources', label: t('resources') || 'Resources', Icon: BookOpenIcon },
    { path: '/notifications', label: t('notifications') || 'Notifications', Icon: BellIcon },
    { path: '/simulator', label: t('simulator') || 'Simulator', Icon: CpuChipIcon },
    { path: '/analytics', label: t('analytics') || 'Analytics', Icon: ChartBarIcon },
    { path: '/parent-portal', label: t('parent_portal') || 'Parent Portal', Icon: UserGroupIcon },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 bg-white/90 backdrop-blur-sm border-r border-purple-100 transition-all duration-300 hidden md:flex flex-col shadow-sm ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      aria-label="Sidebar"
    >
      {/* Brand / Toggle */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-purple-100">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CA</span>
            </div>
            <span className="font-semibold text-sm text-gray-700">Career Advisor</span>
          </div>
        )}
        <button
          className="p-2 rounded-md hover:bg-purple-50 text-gray-500 hover:text-purple-600"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-1 px-2">
          {navItems.map(({ path, label, Icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                  isActive(path)
                    ? 'bg-purple-100 text-purple-700 shadow-inner'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                }`}
                title={collapsed ? label : undefined}
              >
                <Icon className={`w-5 h-5 ${isActive(path) ? 'text-purple-600' : 'text-gray-400 group-hover:text-purple-600'}`} />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-purple-100 text-xs text-gray-400">
        {!collapsed ? (
          <p className="truncate">v1.0 • Guided by AI</p>
        ) : (
          <span className="block text-center">v1</span>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
