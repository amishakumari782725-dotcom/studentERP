import React, { useState, useEffect } from 'react';
import {
  Download,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { dashboardService } from '../../services/dashboardService';
import { studentService } from '../../services/studentService';
import { useNotification } from '../../context/NotificationContext';
import { downloadCsv } from '../../utils/exportCsv';

const MAROON_COLORS = ['#7A1528', '#7A1528', '#BE123C', '#E11D48', '#FB7185', '#7A1528', '#E2E8F0'];

const Reports = () => {
  const { notifySuccess, notifyError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    inactiveStudents: 0,
    graduatedStudents: 0,
    totalCourses: 0,
    totalDepartments: 0,
    activeRatio: 0,
  });

  const [distribution, setDistribution] = useState({
    byDepartment: [],
    byCourse: [],
    byGender: [],
    byStatus: [],
    bySemester: [],
  });

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      const [statsRes, distRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getDistribution(),
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (distRes?.data) setDistribution(distRes.data);
    } catch (err) {
      notifyError('Failed to compile institutional analytics reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const res = await studentService.getExportData();
      if (res?.data && res.data.length) {
        downloadCsv(res.data, `Institutional_Report_${new Date().toISOString().split('T')[0]}.csv`);
        notifySuccess('Complete student census exported to CSV.');
      }
    } catch (err) {
      notifyError('Failed to generate CSV export.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Compiling academic reports and data models..." size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Institutional Reports & Analytics
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Audit-ready academic enrollment reports, gender diversity, and curriculum capacity.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Download}
          onClick={handleExportCsv}
          loading={exporting}
        >
          Export Full Census (CSV)
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-card">
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
            Census Count
          </span>
          <span className="text-2xl font-bold text-[#0F172A] mt-1 block">
            {stats.totalStudents}
          </span>
          <span className="text-xs text-[#64748B] mt-1 block">Active students across all departments</span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-card">
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
            Retention & Active Ratio
          </span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">
            {stats.activeRatio}%
          </span>
          <span className="text-xs text-[#64748B] mt-1 block">{stats.activeStudents} active students</span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-card">
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
            Academic Disciplines
          </span>
          <span className="text-2xl font-bold text-[#7A1528] mt-1 block">
            {stats.totalDepartments}
          </span>
          <span className="text-xs text-[#64748B] mt-1 block">Active faculty departments</span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-card">
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
            Registered Programs
          </span>
          <span className="text-2xl font-bold text-[#BE123C] mt-1 block">
            {stats.totalCourses}
          </span>
          <span className="text-xs text-[#64748B] mt-1 block">Degree curricula offered</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Semester Progression Chart */}
        <Card
          title="Students by Semester Level"
          subtitle="Progression across curriculum semester tiers"
        >
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={distribution.bySemester || []}
                margin={{ top: 10, right: 20, left: -10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f8f4f5" vertical={false} />
                <XAxis dataKey="semester" tick={{ fontSize: 11, fill: '#6e5d61' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6e5d61' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#3b020d',
                    borderColor: '#4c0519',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                  formatter={(val) => [`${val} Students`, 'Enrollment']}
                />
                <Bar dataKey="students" fill="#7A1528" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Gender Demographics Chart */}
        <Card
          title="Gender Demographics"
          subtitle="Diversity and enrollment composition"
        >
          <div className="h-72 w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution.byGender || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={4}
                >
                  {(distribution.byGender || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={MAROON_COLORS[index % MAROON_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#3b020d',
                    borderColor: '#4c0519',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                  formatter={(val, name) => [`${val} Students`, `${name}`]}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Department-wise Breakdown Detailed Table */}
      <Card
        title="Departmental Census Breakdown"
        subtitle="Capacity, active ratios, and faculty distribution"
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Department Code</th>
                <th className="py-3 px-4">Department Name</th>
                <th className="py-3 px-4">Total Students</th>
                <th className="py-3 px-4">Active Students</th>
                <th className="py-3 px-4">Distribution Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]/60">
              {distribution.byDepartment.map((dept) => {
                const percentage = stats.totalStudents > 0
                  ? Math.round((dept.students / stats.totalStudents) * 100)
                  : 0;

                return (
                  <tr key={dept._id} className="hover:bg-[#F8FAFC]/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-[#0F172A]">
                      {dept.code}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#0F172A]">
                      {dept.name}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#0F172A]">
                      {dept.students}
                    </td>
                    <td className="py-3 px-4 text-emerald-700 font-medium">
                      {dept.activeStudents || 0}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-28 bg-[#E2E8F0] rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#7A1528] h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-[#7A1528]">{percentage}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
