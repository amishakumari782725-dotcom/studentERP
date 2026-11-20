import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { studentService } from '../../services/studentService';
import { departmentService } from '../../services/departmentService';
import { courseService } from '../../services/courseService';
import { useNotification } from '../../context/NotificationContext';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotification();

  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    gender: 'Male',
    dateOfBirth: '',
    bloodGroup: 'O+',
    department: '',
    course: '',
    academicYear: '',
    semester: 1,
    admissionDate: '',
    studentStatus: 'Active',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    },
    parentDetails: {
      fatherName: '',
      motherName: '',
      guardianContact: '',
      guardianEmail: '',
      relationship: 'Father',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, deptRes, courseRes] = await Promise.all([
          studentService.getStudentById(id),
          departmentService.getDepartments(),
          courseService.getCourses(),
        ]);

        if (deptRes?.data) setDepartments(deptRes.data);
        if (courseRes?.data) setCourses(courseRes.data);

        if (studentRes?.data) {
          const s = studentRes.data;
          setFormData({
            studentId: s.studentId || '',
            fullName: s.fullName || '',
            email: s.email || '',
            phoneNumber: s.phoneNumber || '',
            gender: s.gender || 'Male',
            dateOfBirth: s.dateOfBirth ? new Date(s.dateOfBirth).toISOString().split('T')[0] : '',
            bloodGroup: s.bloodGroup || 'O+',
            department: s.department?._id || s.department || '',
            course: s.course?._id || s.course || '',
            academicYear: s.academicYear || '',
            semester: s.semester || 1,
            admissionDate: s.admissionDate ? new Date(s.admissionDate).toISOString().split('T')[0] : '',
            studentStatus: s.studentStatus || 'Active',
            address: {
              street: s.address?.street || '',
              city: s.address?.city || '',
              state: s.address?.state || '',
              pincode: s.address?.pincode || '',
              country: s.address?.country || 'India',
            },
            parentDetails: {
              fatherName: s.parentDetails?.fatherName || '',
              motherName: s.parentDetails?.motherName || '',
              guardianContact: s.parentDetails?.guardianContact || '',
              guardianEmail: s.parentDetails?.guardianEmail || '',
              relationship: s.parentDetails?.relationship || 'Father',
            },
          });
        }
      } catch (err) {
        notifyError(err.response?.data?.message || 'Failed to load student record.');
        navigate('/students');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, notifyError]);

  useEffect(() => {
    if (formData.department) {
      const filtered = courses.filter((c) => {
        const deptId = c.department?._id || c.department;
        return deptId === formData.department;
      });
      setFilteredCourses(filtered.length > 0 ? filtered : courses);
    } else {
      setFilteredCourses(courses);
    }
  }, [formData.department, courses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      parentDetails: { ...prev.parentDetails, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.studentId.trim() || !formData.fullName.trim() || !formData.email.trim()) {
      notifyError('Please complete required fields (Student ID, Name, Email).');
      return;
    }

    setSubmitting(true);
    try {
      await studentService.updateStudent(id, formData);
      notifySuccess(`Student record for "${formData.fullName}" updated successfully.`);
      navigate('/students');
    } catch (err) {
      notifyError(err.response?.data?.message || 'Failed to update student profile.');
    } finally {
      setSubmitting(false);
    }
  };

  if (initialLoading) {
    return <LoadingSpinner text="Retrieving student profile details..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/students')}
        >
          Back
        </Button>
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Edit Student: {formData.fullName} ({formData.studentId})
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Modify and synchronize student academic records in MongoDB.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal Details */}
        <Card title="1. Personal & Demographic Details" headerClassName="bg-[#F8FAFC]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Student ID / Enrollment No. <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] font-mono uppercase bg-white text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Email Address <span className="text-rose-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] lowercase bg-white text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Phone Number <span className="text-rose-600">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Section 2: Academic Program */}
        <Card title="2. Academic Enrollment" headerClassName="bg-[#F8FAFC]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-[#334155] mb-1">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              >
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.departmentId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">Course</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              >
                {filteredCourses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.courseName} ({c.courseCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">Academic Year</label>
              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">Semester</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">Admission Date</label>
              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">Enrollment Status</label>
              <select
                name="studentStatus"
                value={formData.studentStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Graduated">Graduated</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Section 3: Address & Parents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card title="3. Residential Address" headerClassName="bg-[#F8FAFC]">
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[#334155] mb-1">Street</label>
                <input
                  type="text"
                  name="street"
                  value={formData.address.street}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#334155] mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#334155] mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card title="4. Parent & Guardian Information" headerClassName="bg-[#F8FAFC]">
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#334155] mb-1">Father's Name</label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.parentDetails.fatherName}
                    onChange={handleParentChange}
                    className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#334155] mb-1">Mother's Name</label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.parentDetails.motherName}
                    onChange={handleParentChange}
                    className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#334155] mb-1">Guardian Contact</label>
                <input
                  type="tel"
                  name="guardianContact"
                  value={formData.parentDetails.guardianContact}
                  onChange={handleParentChange}
                  className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/students')}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Save}
            loading={submitting}
          >
            Update Student Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;
