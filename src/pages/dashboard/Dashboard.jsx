import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  BookOpen,
  Building2,
  TrendingUp,
  RefreshCw,
  PlusCircle,
  Eye,
  ArrowUpRight,
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
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StudentProfileModal from '../../components/students/StudentProfileModal';
import { dashboardService } from '../../services/dashboardService';
import { useNotification } from '../../context/NotificationContext';
import { formatDate } from '../../utils/formatters';

const CHART_COLORS = ['#7A1528', '#475569', '#64748B', '#94A3B8', '#CBD5E1', '#E2E8F0'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { notifyError } = useNotification();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalCourses: 0,
    totalDepartments: 0,
    activeRatio: 0,
  });
  const [distribution, setDistribution] = useState({
    byDepartment: [],
    byCourse: [],
    byGender: [],
    byStatus: [],
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, distRes, recentRes, actRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getDistribution(),
        dashboardService.getRecentStudents(5),
        dashboardService.getRecentActivities(6),
      ]);

      if (statsRes.success) {
        setStats(statsRes.data);
      }
      if (distRes.success) {
        setDistribution(distRes.data);
      }
      if (recentRes.success) {
        setRecentStudents(recentRes.data);
      }
      if (actRes.success) {
        setRecentActivities(actRes.data);
      }
    } catch (err) {
      notifyError('Failed to load live dashboard statistics. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard analytics..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Institutional Dashboard</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time enrollment metrics, department capacity, and academic activities.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={loadDashboardData}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => navigate('/students/add')}
          >
            Add Student
          </Button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Students</p>
            <div className="flex items-baseline space-x-2 mt-1.5">
              <span className="text-2xl font-bold text-slate-900">{stats.totalStudents}</span>
              <span className="text-xs font-medium text-emerald-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Total registered enrollments</p>
          </div>
          <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Active Students */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Students</p>
            <div className="flex items-baseline space-x-2 mt-1.5">
              <span className="text-2xl font-bold text-slate-900">{stats.activeStudents}</span>
              <span className="text-xs font-medium text-slate-500">
                {stats.activeRatio}% active rate
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Attending academic terms</p>
          </div>
          <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Total Courses */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Courses</p>
            <div className="flex items-baseline space-x-2 mt-1.5">
              <span className="text-2xl font-bold text-slate-900">{stats.totalCourses}</span>
              <span className="text-xs font-medium text-slate-500">Program offerings</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Degrees and certificates</p>
          </div>
          <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        {/* Total Departments */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Departments</p>
            <div className="flex items-baseline space-x-2 mt-1.5">
              <span className="text-2xl font-bold text-slate-900">{stats.totalDepartments}</span>
              <span className="text-xs font-medium text-slate-500">Active faculties</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Academic faculties</p>
          </div>
          <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Visual Analytics / Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution (Bar Chart) */}
        <Card
          title="Students by Department"
          subtitle="Real-time enrollment distribution across departments"
          action={
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowUpRight}
              onClick={() => navigate('/departments')}
            >
              View All
            </Button>
          }
        >
          <div className="h-64 w-full pt-2">
            {distribution.byDepartment.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No department enrollment data recorded
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distribution.byDepartment} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '6px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      fontSize: '12px',
                    }}
                    cursor={{ fill: '#F8FAFC' }}
                  />
                  <Bar dataKey="count" name="Students" fill="#7A1528" radius={[4, 4, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Course Distribution (Pie / Donut Chart) */}
        <Card
          title="Course Distribution"
          subtitle="Active academic degree enrollments"
          action={
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowUpRight}
              onClick={() => navigate('/courses')}
            >
              View All
            </Button>
          }
        >
          <div className="h-64 w-full flex items-center justify-center">
            {distribution.byCourse.length === 0 ? (
              <div className="text-slate-400 text-xs">No course enrollment data recorded</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribution.byCourse}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="name"
                  >
                    {distribution.byCourse.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '6px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Tables & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Added Students (2 Columns) */}
        <div className="lg:col-span-2">
          <Card
            title="Recently Enrolled Students"
            subtitle="Latest student admissions recorded in the database"
            action={
              <Button
                variant="outline"
                size="sm"
                icon={ArrowUpRight}
                onClick={() => navigate('/students')}
              >
                View Directory
              </Button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-medium">
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Course</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentStudents.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-slate-400">
                        No students enrolled yet.
                      </td>
                    </tr>
                  ) : (
                    recentStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                              {student.fullName ? student.fullName.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div className="truncate max-w-[130px]">
                              <span className="font-medium text-slate-900 block truncate">
                                {student.fullName}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono block">
                                {student.studentId}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 truncate max-w-[110px]">
                          {student.department?.name || 'N/A'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 truncate max-w-[110px]">
                          {student.course?.courseCode || 'N/A'}
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge
                            variant={student.studentStatus === 'Active' ? 'success' : 'warning'}
                            size="sm"
                          >
                            {student.studentStatus}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedStudent(student)}
                            className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                            title="View Student"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Institutional Activity Log (1 Column) */}
        <div>
          <Card
            title="Recent Activity"
            subtitle="System events and database modifications"
          >
            <div className="space-y-3.5 pt-1">
              {recentActivities.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No activity log entries recorded
                </div>
              ) : (
                recentActivities.map((act) => (
                  <div key={act._id} className="flex items-start space-x-2.5 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#7A1528] mt-1.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800 line-clamp-2">{act.description}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {formatDate(act.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Student Profile Quick View Modal */}
      {selectedStudent && (
        <StudentProfileModal
          isOpen={Boolean(selectedStudent)}
          onClose={() => setSelectedStudent(null)}
          student={selectedStudent}
        />
      )}
    </div>
  );
};

export default Dashboard;
