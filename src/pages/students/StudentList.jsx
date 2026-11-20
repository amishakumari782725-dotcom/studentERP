import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  UserPlus,
  Download,
  RefreshCw,
  Search,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StudentTable from '../../components/students/StudentTable';
import StudentProfileModal from '../../components/students/StudentProfileModal';
import { studentService } from '../../services/studentService';
import { departmentService } from '../../services/departmentService';
import { courseService } from '../../services/courseService';
import { useNotification } from '../../context/NotificationContext';
import { downloadCsv } from '../../utils/exportCsv';

const StudentList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { notifySuccess, notifyError } = useNotification();

  // State
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [department, setDepartment] = useState('All');
  const [course, setCourse] = useState('All');
  const [status, setStatus] = useState('All');
  const [semester, setSemester] = useState('All');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Options
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  // Modals
  const [profileModalStudent, setProfileModalStudent] = useState(null);
  const [deleteTargetStudent, setDeleteTargetStudent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Load dropdown lists
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [deptRes, courseRes] = await Promise.all([
          departmentService.getDepartments(),
          courseService.getCourses(),
        ]);
        if (deptRes?.data) setDepartments(deptRes.data);
        if (courseRes?.data) setCourses(courseRes.data);
      } catch (err) {
        console.error('Failed to load filter metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch Students
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        sortBy,
        sortOrder,
      };

      if (search.trim()) params.search = search.trim();
      if (department !== 'All') params.department = department;
      if (course !== 'All') params.course = course;
      if (status !== 'All') params.status = status;
      if (semester !== 'All') params.semester = semester;

      const response = await studentService.getStudents(params);
      if (response?.data) {
        setStudents(response.data);
        setTotalStudents(response.total || 0);
        setTotalPages(response.pages || 1);
      }
    } catch (err) {
      notifyError(err.response?.data?.message || 'Failed to fetch student directory');
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, sortOrder, search, department, course, status, semester, notifyError]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSort = (field) => {
    if (sortBy !== field) {
      setSortBy(field);
      setSortOrder('asc');
    } else {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    }
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setDepartment('All');
    setCourse('All');
    setStatus('All');
    setSemester('All');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
    setSearchParams({});
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetStudent) return;
    setIsDeleting(true);
    try {
      await studentService.deleteStudent(deleteTargetStudent._id);
      notifySuccess(`Student record for ${deleteTargetStudent.fullName} deleted successfully.`);
      setDeleteTargetStudent(null);
      fetchStudents();
    } catch (err) {
      notifyError(err.response?.data?.message || 'Failed to delete student');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const response = await studentService.getExportData();
      if (response?.data && response.data.length) {
        downloadCsv(response.data, `StudentHub_Directory_${new Date().toISOString().split('T')[0]}.csv`);
        notifySuccess('Student records exported to CSV successfully.');
      } else {
        notifyError('No student records available to export.');
      }
    } catch (err) {
      notifyError(err.response?.data?.message || 'Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Action Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Student Directory</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage academic enrollments, student records, and status across all departments.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={handleExportCsv}
            loading={isExporting}
          >
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={UserPlus}
            onClick={() => navigate('/students/add')}
          >
            Enroll Student
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card bodyClassName="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, ID, phone..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-[#F8FAFC] focus:bg-white text-[#0F172A]"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Course Filter */}
          <div>
            <select
              value={course}
              onChange={(e) => {
                setCourse(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
            >
              <option value="All">All Courses</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.courseName} ({c.courseCode})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Semester Filter */}
          <div>
            <select
              value={semester}
              onChange={(e) => {
                setSemester(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
            >
              <option value="All">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Filter Action */}
        <div className="flex items-center justify-between pt-1 border-t border-[#F8FAFC] text-xs">
          <span className="text-[#64748B]">
            Total records found: <strong className="text-[#0F172A]">{totalStudents}</strong>
          </span>

          <button
            type="button"
            onClick={handleResetFilters}
            className="text-[#7A1528] hover:text-[#7A1528] font-medium flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset All Filters</span>
          </button>
        </div>
      </Card>

      {/* Main Table */}
      {loading ? (
        <LoadingSpinner text="Loading student database records..." />
      ) : (
        <>
          <StudentTable
            students={students}
            onViewProfile={(student) => setProfileModalStudent(student)}
            onEdit={(student) => navigate(`/students/edit/${student._id}`)}
            onDelete={(student) => setDeleteTargetStudent(student)}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalStudents}
            pageSize={10}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}

      {/* Student Profile Modal */}
      <StudentProfileModal
        isOpen={!!profileModalStudent}
        onClose={() => setProfileModalStudent(null)}
        student={profileModalStudent}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetStudent}
        onClose={() => setDeleteTargetStudent(null)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Student Deletion"
        message={`Are you sure you want to permanently delete the student record for "${deleteTargetStudent?.fullName}" (${deleteTargetStudent?.studentId})? This action cannot be undone.`}
        confirmText="Permanently Delete"
        loading={isDeleting}
      />
    </div>
  );
};

export default StudentList;
