import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Database,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ isSidebarCollapsed, setIsMobileOpen, pageTitle = 'Dashboard' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/students?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 lg:px-8 flex items-center justify-between">
      {/* Left Section: Mobile Menu Toggle & Page Title */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base font-semibold text-slate-900 tracking-tight capitalize truncate">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Middle Section: Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-6">
        <form onSubmit={handleSearchSubmit} className="w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7A1528] focus:border-[#7A1528] text-slate-800 placeholder:text-slate-400"
          />
        </form>
      </div>

      {/* Right Section: DB Status, Notifications & Admin Dropdown */}
      <div className="flex items-center space-x-3">
        {/* Database Status indicator */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span>MongoDB Live</span>
        </div>

        {/* Notifications Icon & Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#7A1528]"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg border border-slate-200 shadow-lg py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Notifications</span>
                <span className="text-[10px] text-slate-500 font-medium">System alerts</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                <div className="p-3 hover:bg-slate-50 transition-colors">
                  <span className="font-medium text-slate-800 block">Database Connected</span>
                  <p className="text-slate-500 mt-0.5 text-[11px]">
                    Student database and course catalog synchronized.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center space-x-2 p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#7A1528] text-white flex items-center justify-center font-semibold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                {user?.name || 'Admin'}
              </p>
              <p className="text-[10px] text-slate-500 capitalize">
                {user?.role || 'Administrator'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-50 text-xs">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="font-semibold text-slate-800 truncate">{user?.name}</p>
                <p className="text-slate-500 text-[11px] truncate">{user?.email}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>My Profile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Settings</span>
              </button>

              <div className="border-t border-slate-100 my-1"></div>

              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-rose-700 hover:bg-rose-50 transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
