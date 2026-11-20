import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  BookOpen,
  Users,
  Mail,
  Phone,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { departmentService } from '../../services/departmentService';
import { useNotification } from '../../context/NotificationContext';

const DepartmentList = () => {
  const { notifySuccess, notifyError } = useNotification();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [activeDeptId, setActiveDeptId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const initialForm = {
    departmentId: '',
    name: '',
    headOfDepartment: '',
    email: '',
    phone: '',
    description: '',
    status: 'Active',
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await departmentService.getDepartments({
        search: search.trim() || undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
      });
      if (res?.data) setDepartments(res.data);
    } catch (err) {
      notifyError('Failed to load academic departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [search, statusFilter]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setActiveDeptId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setModalMode('edit');
    setActiveDeptId(dept._id);
    setFormData({
      departmentId: dept.departmentId,
      name: dept.name,
      headOfDepartment: dept.headOfDepartment,
      email: dept.email || '',
      phone: dept.phone || '',
      description: dept.description || '',
      status: dept.status || 'Active',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.departmentId.trim() || !formData.name.trim() || !formData.headOfDepartment.trim()) {
      notifyError('Department ID, Department Name, and Head of Department are required.');
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        await departmentService.createDepartment(formData);
        notifySuccess(`Department "${formData.name}" established successfully.`);
      } else {
        await departmentService.updateDepartment(activeDeptId, formData);
        notifySuccess(`Department "${formData.name}" updated successfully.`);
      }
      setIsModalOpen(false);
      fetchDepartments();
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
      await departmentService.deleteDepartment(deleteTarget._id);
      notifySuccess(`Department "${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
      fetchDepartments();
    } catch (err) {
      notifyError(err.response?.data?.message || 'Failed to delete department.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Academic Departments</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Oversee university faculties, departmental heads, and affiliated degree curricula.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
          Add Department
        </Button>
      </div>

      {/* Filter Card */}
      <Card bodyClassName="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search department ID or name..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-[#F8FAFC] focus:bg-white text-[#0F172A]"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
        <LoadingSpinner text="Loading academic departments..." />
      ) : !departments.length ? (
        <div className="text-center py-12 px-4 bg-white border border-[#E2E8F0] rounded-lg">
          <p className="text-sm font-semibold text-[#334155]">No departments found</p>
          <p className="text-xs text-[#64748B] mt-1">Try clearing filters or add a new department.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg border border-[#E2E8F0] shadow-card">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Department ID</th>
                <th className="py-3.5 px-4">Department Name</th>
                <th className="py-3.5 px-4">Head of Department</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Associated Courses</th>
                <th className="py-3.5 px-4">Enrolled Students</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]/60">
              {departments.map((dept) => (
                <tr key={dept._id} className="hover:bg-[#F8FAFC]/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-[#0F172A]">
                    <span className="bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0] text-[#7A1528]">
                      {dept.departmentId}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#0F172A] block">{dept.name}</span>
                    {dept.description && (
                      <span className="text-[11px] text-[#64748B] truncate max-w-xs block">
                        {dept.description}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[#0F172A] font-medium">
                    {dept.headOfDepartment}
                  </td>
                  <td className="py-3 px-4 text-[#64748B]">
                    {dept.email && (
                      <div className="flex items-center space-x-1 text-[11px]">
                        <Mail className="w-3 h-3 text-[#7A1528]" />
                        <span>{dept.email}</span>
                      </div>
                    )}
                    {dept.phone && (
                      <div className="flex items-center space-x-1 text-[11px] text-[#64748B]">
                        <Phone className="w-3 h-3 text-[#7A1528]" />
                        <span>{dept.phone}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center space-x-1 font-semibold text-[#334155] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0] text-[11px]">
                      <BookOpen className="w-3 h-3 text-[#94A3B8]" />
                      <span>{dept.courseCount || 0} Courses</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center space-x-1 font-semibold text-[#7A1528] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0] text-[11px]">
                      <Users className="w-3 h-3 text-[#7A1528]" />
                      <span>{dept.studentCount || 0} Students</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={dept.status === 'Active' ? 'success' : 'default'}>
                      {dept.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(dept)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#334155] hover:bg-[#F8FAFC] rounded transition-colors"
                        title="Edit Department"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(dept)}
                        className="p-1.5 text-[#94A3B8] hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                        title="Delete Department"
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Establish Academic Department' : 'Edit Academic Department'}
        subtitle="Department identity, leadership, and contact communications"
        maxWidth="max-w-lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmit} loading={submitting}>
              {modalMode === 'create' ? 'Create Department' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-[#334155] mb-1">
              Department ID <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              placeholder="e.g. DEP-BCA or DEP-CS"
              required
              className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] font-mono uppercase bg-white text-[#0F172A]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#334155] mb-1">
              Department Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Department of Computer Applications"
              required
              className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#334155] mb-1">
              Head of Department (HOD) <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={formData.headOfDepartment}
              onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
              placeholder="Prof. / Dr. Full Name"
              required
              className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#334155] mb-1">Department Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="dept@studenthub.edu"
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] lowercase bg-white text-[#0F172A]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#334155] mb-1">Contact Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 00000"
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#334155] mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#334155] mb-1">Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Overview of academic research and degree specializations"
              className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
            ></textarea>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Confirm Department Deletion"
        message={`Are you sure you want to delete "${deleteTarget?.name}" (${deleteTarget?.departmentId})? The operation will be blocked if courses or students are tied to this department.`}
        confirmText="Delete Department"
        loading={deleting}
      />
    </div>
  );
};

export default DepartmentList;
