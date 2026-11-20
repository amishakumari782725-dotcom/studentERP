import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  RotateCcw,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { studentService } from '../../services/studentService';
import { departmentService } from '../../services/departmentService';
import { courseService } from '../../services/courseService';
import { useNotification } from '../../context/NotificationContext';

const AddStudent = () => {
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotification();

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Form State
  const initialFormState = {
    studentId: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    gender: 'Male',
    dateOfBirth: '',
    bloodGroup: 'O+',
    department: '',
    course: '',
    academicYear: '2024-2027',
    semester: 1,
    admissionDate: new Date().toISOString().split('T')[0],
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
  };

  const [formData, setFormData] = useState(initialFormState);

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
        notifyError('Failed to load academic departments and courses.');
      }
    };
    fetchMetadata();
  }, [notifyError]);

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

    if (!formData.studentId.trim()) {
      notifyError('Student ID / Enrollment Number is required.');
      return;
    }
    if (!formData.fullName.trim()) {
      notifyError('Student Full Name is required.');
      return;
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      notifyError('A valid email address is required.');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      notifyError('Contact phone number is required.');
      return;
    }
    if (!formData.department) {
      notifyError('Please select an Academic Department.');
      return;
    }
    if (!formData.course) {
      notifyError('Please select a Degree Course.');
      return;
    }
    if (!formData.dateOfBirth) {
      notifyError('Date of birth is required.');
      return;
    }
    if (!formData.address.city.trim() || !formData.address.state.trim()) {
      notifyError('City and State are required for student address.');
      return;
    }

    setLoading(true);
    try {
      await studentService.createStudent(formData);
      notifySuccess(`Student "${formData.fullName}" enrolled successfully.`);
      navigate('/students');
    } catch (err) {
      notifyError(err.response?.data?.message || 'Failed to register student record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
              Student Registration & Enrollment
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Fill in all mandatory details to register a new student record into MongoDB.
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={RotateCcw}
          onClick={() => setFormData(initialFormState)}
        >
          Reset Form
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <Card
          title="1. Personal & Demographic Details"
          subtitle="Identity, demographics, and primary contact information"
          headerClassName="bg-[#F8FAFC]"
        >
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
                placeholder="e.g. STU2025001"
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
                placeholder="Student full legal name"
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
                placeholder="student@studenthub.edu"
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
                placeholder="+91 98765 43210"
                required
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Gender <span className="text-rose-600">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Date of Birth <span className="text-rose-600">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
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

        {/* Section 2: Academic Details */}
        <Card
          title="2. Academic Enrollment & Program"
          subtitle="Department assignment, degree curriculum, and semester tracking"
          headerClassName="bg-[#F8FAFC]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Department <span className="text-rose-600">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              >
                <option value="">Select Academic Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.departmentId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Course / Degree <span className="text-rose-600">*</span>
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              >
                <option value="">Select Degree Program</option>
                {filteredCourses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.courseName} ({c.courseCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Academic Year <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="e.g. 2024-2027"
                required
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Current Semester <span className="text-rose-600">*</span>
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
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
              <label className="block font-medium text-[#334155] mb-1">
                Admission Date <span className="text-rose-600">*</span>
              </label>
              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Enrollment Status <span className="text-rose-600">*</span>
              </label>
              <select
                name="studentStatus"
                value={formData.studentStatus}
                onChange={handleChange}
                required
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

        {/* Section 3: Residential Address */}
        <Card
          title="3. Residential Address"
          subtitle="Permanent residence and postal contact details"
          headerClassName="bg-[#F8FAFC]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-medium text-[#334155] mb-1">Street Address</label>
              <input
                type="text"
                name="street"
                value={formData.address.street}
                onChange={handleAddressChange}
                placeholder="House / Flat No., Street, Locality"
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">
                City <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.address.city}
                onChange={handleAddressChange}
                placeholder="City"
                required
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">
                State <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.address.state}
                onChange={handleAddressChange}
                placeholder="State / Province"
                required
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">Postal / PIN Code</label>
              <input
                type="text"
                name="pincode"
                value={formData.address.pincode}
                onChange={handleAddressChange}
                placeholder="e.g. 110001"
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.address.country}
                onChange={handleAddressChange}
                placeholder="Country"
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              />
            </div>
          </div>
        </Card>

        {/* Section 4: Parent / Guardian Details */}
        <Card
          title="4. Parents & Guardian Information"
          subtitle="Parental contact, emergency information, and relationship"
          headerClassName="bg-[#F8FAFC]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-[#334155] mb-1">Father's Name</label>
              <input
                type="text"
                name="fatherName"
                value={formData.parentDetails.fatherName}
                onChange={handleParentChange}
                placeholder="Father full name"
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
                placeholder="Mother full name"
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Guardian Emergency Contact
              </label>
              <input
                type="tel"
                name="guardianContact"
                value={formData.parentDetails.guardianContact}
                onChange={handleParentChange}
                placeholder="+91 98765 00000"
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">Guardian Email</label>
              <input
                type="email"
                name="guardianEmail"
                value={formData.parentDetails.guardianEmail}
                onChange={handleParentChange}
                placeholder="guardian@example.com"
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] lowercase bg-white text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">Relationship</label>
              <select
                name="relationship"
                value={formData.parentDetails.relationship}
                onChange={handleParentChange}
                className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Legal Guardian</option>
                <option value="Relative">Relative</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/students')}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Save}
            loading={loading}
          >
            Enroll Student & Save Record
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
