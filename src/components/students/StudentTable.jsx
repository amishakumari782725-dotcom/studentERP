import React from 'react';
import { Eye, Edit, Trash2, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import Badge from '../common/Badge';

const StudentTable = ({
  students = [],
  onViewProfile,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
}) => {
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

  const renderSortIndicator = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400 ml-1 inline" />;
    }
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-3 h-3 text-[#7A1528] ml-1 inline" />
    ) : (
      <ChevronDown className="w-3 h-3 text-[#7A1528] ml-1 inline" />
    );
  };

  if (!students.length) {
    return (
      <div className="text-center py-12 px-4 bg-white border border-slate-200 rounded-lg">
        <p className="text-sm font-semibold text-slate-800">No student records found</p>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No students match the current search or filter criteria. Try clearing filters or enrolling a new student.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-xs">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
            <th
              className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => onSort('studentId')}
            >
              <div className="flex items-center">
                <span>Student ID</span>
                {renderSortIndicator('studentId')}
              </div>
            </th>
            <th
              className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => onSort('fullName')}
            >
              <div className="flex items-center">
                <span>Student Name</span>
                {renderSortIndicator('fullName')}
              </div>
            </th>
            <th className="py-3 px-4">Department</th>
            <th className="py-3 px-4">Course</th>
            <th
              className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => onSort('semester')}
            >
              <div className="flex items-center">
                <span>Semester</span>
                {renderSortIndicator('semester')}
              </div>
            </th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.map((student) => (
            <tr
              key={student._id}
              className="hover:bg-slate-50/80 transition-colors group"
            >
              {/* ID */}
              <td className="py-3 px-4 font-semibold text-slate-800">
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-700 border border-slate-200">
                  {student.studentId}
                </span>
              </td>

              {/* Name & Contact */}
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-semibold text-xs flex-shrink-0">
                    {student.fullName ? student.fullName.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div>
                    <span className="font-medium text-slate-900 block">
                      {student.fullName}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {student.email}
                    </span>
                  </div>
                </div>
              </td>

              {/* Department */}
              <td className="py-3 px-4 text-slate-700">
                <span className="font-medium">
                  {student.department?.name || 'Unassigned'}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {student.department?.departmentId}
                </span>
              </td>

              {/* Course */}
              <td className="py-3 px-4 text-slate-700">
                <span className="font-medium">
                  {student.course?.courseName || 'Unassigned'}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {student.course?.courseCode}
                </span>
              </td>

              {/* Semester */}
              <td className="py-3 px-4">
                <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                  Sem {student.semester}
                </span>
              </td>

              {/* Status */}
              <td className="py-3 px-4">
                <Badge variant={getStatusVariant(student.studentStatus)}>
                  {student.studentStatus || 'Active'}
                </Badge>
              </td>

              {/* Actions */}
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end space-x-1">
                  <button
                    type="button"
                    onClick={() => onViewProfile(student)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                    title="View Detailed Profile"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(student)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                    title="Edit Student"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(student)}
                    className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="Delete Student"
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
  );
};

export default StudentTable;
