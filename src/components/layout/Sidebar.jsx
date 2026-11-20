import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BookOpen,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isStudentsRoute = location.pathname.startsWith('/students');
  const [isStudentsDropdownOpen, setIsStudentsDropdownOpen] = useState(isStudentsRoute);
  const [floatingMenuOpen, setFloatingMenuOpen] = useState(false);
  const floatingRef = useRef(null);

  // Auto-expand dropdown when navigating to students routes
  useEffect(() => {
    if (isStudentsRoute) {
      setIsStudentsDropdownOpen(true);
    }
  }, [location.pathname, isStudentsRoute]);

  // Handle outside click for collapsed floating menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (floatingRef.current && !floatingRef.current.contains(e.target)) {
        setFloatingMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Departments', path: '/departments', icon: Building2 },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const content = (
    <div className="h-full flex flex-col justify-between bg-white text-slate-700 select-none border-r border-slate-200">
      {/* Top Header */}
      <div>
        {isCollapsed ? (
          // Collapsed Header: Centered Logo + Quick Expand Action
          <div className="h-16 flex items-center justify-center border-b border-slate-200 px-2">
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="w-10 h-10 rounded-lg bg-[#7A1528] text-white flex items-center justify-center shadow-xs hover:bg-[#631020] transition-colors relative group"
              title="Expand Sidebar"
            >
              <GraduationCap className="w-5 h-5" />
              {/* Tooltip */}
              <span className="absolute left-full ml-3 px-2 py-1 bg-slate-900 text-white text-[11px] font-medium rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                Expand Sidebar
              </span>
            </button>
          </div>
        ) : (
          // Expanded Header: Full Brand + Collapse Button
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-8 h-8 rounded-md bg-[#7A1528] flex items-center justify-center flex-shrink-0 text-white shadow-xs">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="font-bold text-sm tracking-tight text-slate-900 block">
                  StudentHub
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">
                  University ERP
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation List */}
        <div className={`py-4 space-y-1.5 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {!isCollapsed && (
            <div className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Main Menu
            </div>
          )}

          {/* 1. Dashboard */}
          {isCollapsed ? (
            <div className="relative group flex justify-center">
              <NavLink
                to="/dashboard"
                onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-[#7A1528] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
              </NavLink>
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                Dashboard
              </span>
            </div>
          ) : (
            <NavLink
              to="/dashboard"
              onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#7A1528] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
              <span>Dashboard</span>
            </NavLink>
          )}

          {/* 2. Students (Dropdown) */}
          <div className="relative" ref={floatingRef}>
            {isCollapsed ? (
              // Collapsed View for Students: Icon button with popover flyout
              <div className="flex justify-center group">
                <button
                  type="button"
                  onClick={() => setFloatingMenuOpen(!floatingMenuOpen)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isStudentsRoute
                      ? 'bg-[#7A1528] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title="Students Menu"
                >
                  <Users className="w-4 h-4" />
                </button>

                {/* Floating Popover on Click or Hover */}
                {floatingMenuOpen ? (
                  <div className="absolute left-full top-0 ml-3 w-48 bg-white border border-slate-200 shadow-xl rounded-lg py-1.5 z-50">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                      Students Menu
                    </div>
                    <NavLink
                      to="/students"
                      end
                      onClick={() => {
                        setFloatingMenuOpen(false);
                        setIsMobileOpen && setIsMobileOpen(false);
                      }}
                      className={({ isActive }) =>
                        `flex items-center space-x-2.5 px-3 py-2 text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-[#7A1528] text-white'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>All Students</span>
                    </NavLink>
                    <NavLink
                      to="/students/add"
                      onClick={() => {
                        setFloatingMenuOpen(false);
                        setIsMobileOpen && setIsMobileOpen(false);
                      }}
                      className={({ isActive }) =>
                        `flex items-center space-x-2.5 px-3 py-2 text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-[#7A1528] text-white'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Add Student</span>
                    </NavLink>
                  </div>
                ) : (
                  <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    Students (Click for options)
                  </span>
                )}
              </div>
            ) : (
              // Expanded View for Students (Accordion Dropdown)
              <div>
                <button
                  type="button"
                  onClick={() => setIsStudentsDropdownOpen(!isStudentsDropdownOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isStudentsRoute
                      ? 'text-[#7A1528] bg-rose-50/60 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span>Students</span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      isStudentsDropdownOpen ? 'transform rotate-180 text-slate-600' : ''
                    }`}
                  />
                </button>

                {/* Submenu Links */}
                {isStudentsDropdownOpen && (
                  <div className="mt-1 pl-4 pr-1 space-y-1 border-l-2 border-slate-100 ml-4">
                    <NavLink
                      to="/students"
                      end
                      onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-2.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-[#7A1528] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                      <span>All Students</span>
                    </NavLink>

                    <NavLink
                      to="/students/add"
                      onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-2.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-[#7A1528] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      <UserPlus className="w-3.5 h-3.5 opacity-80" />
                      <span>Add Student</span>
                    </NavLink>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Other Navigation Items */}
          {navItems.slice(1).map((item) => {
            const Icon = item.icon;
            return isCollapsed ? (
              <div key={item.name} className="relative group flex justify-center">
                <NavLink
                  to={item.path}
                  onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-[#7A1528] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                </NavLink>
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {item.name}
                </span>
              </div>
            ) : (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#7A1528] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Footer Profile & Logout */}
      <div className={`border-t border-slate-200 ${isCollapsed ? 'py-3 px-2 space-y-2' : 'p-3 space-y-2'}`}>
        {isCollapsed ? (
          // Collapsed Footer: Centered Avatar + Centered Logout Button with Tooltips
          <div className="flex flex-col items-center space-y-2">
            <div className="relative group">
              <div className="w-9 h-9 rounded-full bg-[#7A1528] text-white flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                {user?.name || 'Administrator'}
              </span>
            </div>

            <div className="relative group">
              <button
                type="button"
                onClick={handleLogout}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                Sign Out
              </span>
            </div>
          </div>
        ) : (
          // Expanded Footer: Detailed Profile Card + Full Logout Button
          <>
            <div className="px-2.5 py-2 rounded-md bg-slate-50 border border-slate-200/80 flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-[#7A1528] text-white flex items-center justify-center font-semibold text-xs flex-shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800 truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-slate-500 capitalize">{user?.role || 'Superadmin'}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span>Sign Out</span>
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside
        className={`hidden lg:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-200 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {content}
      </aside>

      {/* Mobile drawer backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </aside>
    </>
  );
};

export default Sidebar;
