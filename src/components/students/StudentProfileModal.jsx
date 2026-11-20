import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  BookOpen,
  Building2,
  Clock,
  HeartHandshake,
  Edit,
  GraduationCap,
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatters';

const StudentProfileModal = ({ isOpen, onClose, student }) => {
  const navigate = useNavigate();

  if (!student) return null;

  const handleEdit = () => {
    onClose();
    navigate(`/students/edit/${student._id}`);
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'graduated':
        return 'primary';
      case 'suspended':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Profile"
      subtitle={`Enrollment ID: ${student.studentId}`}
      maxWidth="max-w-3xl"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" icon={Edit} onClick={handleEdit}>
            Edit Details
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="flex items-center space-x-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-[#7A1528] text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-xs">
            {student.fullName ? student.fullName.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-900 truncate">
                {student.fullName}
              </h2>
              <Badge variant={getStatusVariant(student.studentStatus)}>
                {student.studentStatus || 'Active'}
              </Badge>
              <Badge variant="default">{student.studentId}</Badge>
            </div>
            <div className="flex items-center space-x-4 mt-1 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{student.email}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{student.phoneNumber}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Grid of Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Academic Information */}
          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-3">
            <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 pb-2 border-b border-slate-100">
              <GraduationCap className="w-4 h-4 text-[#7A1528]" />
              <span>Academic Enrollment</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Department:</span>
                <span className="font-medium text-slate-800 text-right">
                  {student.department?.name || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Course / Degree:</span>
                <span className="font-medium text-slate-800 text-right">
                  {student.course?.courseName || 'N/A'} ({student.course?.courseCode || 'N/A'})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Current Semester:</span>
                <span className="font-semibold text-slate-800">
                  Semester {student.semester}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Academic Year:</span>
                <span className="font-medium text-slate-800">{student.academicYear}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Admission Date:</span>
                <span className="font-medium text-slate-800">{formatDate(student.admissionDate)}</span>
              </div>
            </div>
          </div>

          {/* Personal Demographics */}
          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-3">
            <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-[#7A1528]" />
              <span>Personal Demographics</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Gender:</span>
                <span className="font-medium text-slate-800">{student.gender}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Date of Birth:</span>
                <span className="font-medium text-slate-800">{formatDate(student.dateOfBirth)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Blood Group:</span>
                <span className="font-medium text-slate-800">{student.bloodGroup || 'Not Specified'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Residential City:</span>
                <span className="font-medium text-slate-800">{student.address?.city || 'N/A'}, {student.address?.state || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Full Address:</span>
                <span className="font-medium text-slate-800 text-right truncate max-w-[160px]">
                  {student.address?.street ? `${student.address.street}, ` : ''}{student.address?.city}
                </span>
              </div>
            </div>
          </div>

          {/* Guardian & Family Contact */}
          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-3">
            <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 pb-2 border-b border-slate-100">
              <HeartHandshake className="w-4 h-4 text-[#7A1528]" />
              <span>Parent / Guardian</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Father's Name:</span>
                <span className="font-medium text-slate-800">{student.parentDetails?.fatherName || 'Not recorded'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Mother's Name:</span>
                <span className="font-medium text-slate-800">{student.parentDetails?.motherName || 'Not recorded'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Guardian Contact:</span>
                <span className="font-semibold text-slate-800">
                  {student.parentDetails?.guardianPhone || student.parentDetails?.fatherPhone || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Guardian Email:</span>
                <span className="font-medium text-slate-800">{student.parentDetails?.guardianEmail || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* System Audit Information */}
          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-3">
            <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 pb-2 border-b border-slate-100">
              <Clock className="w-4 h-4 text-[#7A1528]" />
              <span>Audit Records</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Database Record ID:</span>
                <span className="font-mono text-slate-600 text-[10px] truncate max-w-[150px]">{student._id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Created At:</span>
                <span className="text-slate-700">{formatDate(student.createdAt)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Last Updated:</span>
                <span className="text-slate-700">{formatDate(student.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StudentProfileModal;
