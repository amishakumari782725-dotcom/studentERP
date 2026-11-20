import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const getPageTitle = (pathname) => {
  if (pathname === '/dashboard') return 'Administrative Dashboard';
  if (pathname === '/students') return 'Student Directory';
  if (pathname === '/students/add') return 'Enroll New Student';
  if (pathname.startsWith('/students/edit/')) return 'Edit Student Profile';
  if (pathname === '/courses') return 'Curriculum & Courses';
  if (pathname === '/departments') return 'Academic Departments';
  if (pathname === '/reports') return 'Analytics & Reports';
  if (pathname === '/settings') return 'ERP Settings & Profile';
  return 'StudentHub';
};

const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const title = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-60'
        }`}
      >
        <Topbar
          isSidebarCollapsed={isSidebarCollapsed}
          setIsMobileOpen={setIsMobileOpen}
          pageTitle={title}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        <footer className="py-4 px-6 border-t border-slate-200 text-center text-xs text-slate-500 bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>StudentHub ERP © 2026. Academic Student Management System.</span>
            <span>BCA Final Year Demonstration Project | React, Node.js & MongoDB</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
