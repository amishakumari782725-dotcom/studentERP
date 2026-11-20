import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Users,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { courseService } from '../../services/courseService';
import { departmentService } from '../../services/departmentService';
import { useNotification } from '../../context/NotificationContext';

const CourseList = () => {
  const { notifySuccess, notifyError } = useNotification();

  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const initialForm = {
    courseCode: '',
    courseName: '',
    department: '',
    duration: '3 Years / 6 Semesters',
    totalSemesters: 6,
    courseDescription: '',
    courseStatus: 'Active',
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchCoursesAndDepts = async () => {
    setLoading(true);
    try {
      const [coursesRes, deptRes] = await Promise.all([
        courseService.getCourses({
          search: search.trim() || undefined,
          department: selectedDept !== 'All' ? selectedDept : undefined,
          status: selectedStatus !== 'All' ? selectedStatus : undefined,
        }),
        departmentService.getDepartments(),
      ]);

      if (coursesRes?.data) setCourses(coursesRes.data);
      if (deptRes?.data) setDepartments(deptRes.data);
    } catch (err) {
      notifyError('Failed to fetch curriculum course list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndDepts();
  }, [search, selectedDept, selectedStatus]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setActiveCourseId(null);
    setFormData({
      ...initialForm,
      department: departments[0]?._id || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setModalMode('edit');
    setActiveCourseId(course._id);
    setFormData({
      courseCode: course.courseCode,
      courseName: course.courseName,
      department: course.department?._id || course.department || '',
      duration: course.duration,
      totalSemesters: course.totalSemesters || 6,
      courseDescription: course.courseDescription || '',
      courseStatus: course.courseStatus || 'Active',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.courseCode.trim() || !formData.courseName.trim() || !formData.department) {
      notifyError('Course Code, Course Name, and Department are required.');
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        await courseService.createCourse(formData);
        notifySuccess(`Course "${formData.courseName}" created successfully.`);
      } else {
        await courseService.updateCourse(activeCourseId, formData);
        notifySuccess(`Course "${formData.courseName}" updated successfully.`);
      }
      setIsModalOpen(false);
      fetchCoursesAndDepts();
    } catch (err) {
      notifyError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await courseService.deleteCourse(deleteTarget._id);
      notifySuccess(`Course "${deleteTarget.courseName}" deleted.`);
      setDeleteTarget(null);
      fetchCoursesAndDepts();
    } catch (err) {
      notifyError(err.response?.data?.message || 'Failed to delete course.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Courses & Curriculum</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage academic degree programs, syllabus structures, and student capacities.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
          Add Degree Course
        </Button>
      </div>

      {/* Filter Card */}
      <Card bodyClassName="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search course code or name..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-[#F8FAFC] focus:bg-white text-[#0F172A]"
            />
          </div>

          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
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

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <LoadingSpinner text="Loading courses catalog..." />
      ) : !courses.length ? (
        <div className="text-center py-12 px-4 bg-white border border-[#E2E8F0] rounded-lg">
          <p className="text-sm font-semibold text-[#334155]">No courses found</p>
          <p className="text-xs text-[#64748B] mt-1">Try adjusting your search criteria or create a course.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg border border-[#E2E8F0] shadow-card">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Course Code</th>
                <th className="py-3.5 px-4">Course Name</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Duration & Sems</th>
                <th className="py-3.5 px-4">Enrolled Students</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]/60">
              {courses.map((course) => (
                <tr key={course._id} className="hover:bg-[#F8FAFC]/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-[#0F172A]">
                    <span className="bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0] text-[#7A1528]">
                      {course.courseCode}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#0F172A] block">{course.courseName}</span>
                    {course.courseDescription && (
                      <span className="text-[11px] text-[#64748B] truncate max-w-xs block">
                        {course.courseDescription}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[#334155]">
                    {course.department?.name || 'Unassigned'}
                  </td>
                  <td className="py-3 px-4 text-[#64748B]">
                    <span>{course.duration}</span>
                    <span className="text-[10px] text-[#94A3B8] block font-medium">
                      {course.totalSemesters} Total Semesters
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center space-x-1 font-semibold text-[#7A1528] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0] text-[11px]">
                      <Users className="w-3 h-3 text-[#7A1528]" />
                      <span>{course.studentCount || 0} Students</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={course.courseStatus === 'Active' ? 'success' : 'default'}>
                      {course.courseStatus}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(course)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#334155] hover:bg-[#F8FAFC] rounded transition-colors"
                        title="Edit Course"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(course)}
                        className="p-1.5 text-[#94A3B8] hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Add New Degree Course' : 'Edit Degree Course'}
        subtitle="Configure curriculum codes, departments, and course length"
        maxWidth="max-w-lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmit} loading={submitting}>
              {modalMode === 'create' ? 'Save Course' : 'Update Course'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-[#334155] mb-1">
              Course Code <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={formData.courseCode}
              onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
              placeholder="e.g. BCA-101 or BTECH-CS"
              required
              className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] font-mono uppercase bg-white text-[#0F172A]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#334155] mb-1">
              Course / Degree Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              placeholder="e.g. Bachelor of Computer Applications"
              required
              className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#334155] mb-1">
              Academic Department <span className="text-rose-600">*</span>
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
              className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} ({d.departmentId})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Duration <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 3 Years"
                required
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#334155] mb-1">Total Semesters</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.totalSemesters}
                onChange={(e) => setFormData({ ...formData, totalSemesters: e.target.value })}
                required
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#334155] mb-1">Course Status</label>
            <select
              value={formData.courseStatus}
              onChange={(e) => setFormData({ ...formData, courseStatus: e.target.value })}
              className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#334155] mb-1">Course Description</label>
            <textarea
              rows="3"
              value={formData.courseDescription}
              onChange={(e) => setFormData({ ...formData, courseDescription: e.target.value })}
              placeholder="Summary of course goals and eligibility"
              className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
            ></textarea>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Confirm Course Deletion"
        message={`Are you sure you want to delete course "${deleteTarget?.courseName}" (${deleteTarget?.courseCode})? Note: Deletion will be rejected if students are actively enrolled.`}
        confirmText="Delete Course"
        loading={deleting}
      />
    </div>
  );
};

export default CourseList;
