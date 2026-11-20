import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      notifyError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      notifyError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      notifyError('Password confirmation does not match.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });
      notifySuccess('Administrator account created successfully.');
      navigate('/dashboard');
    } catch (err) {
      notifyError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#7A1528] selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-lg bg-[#7A1528] flex items-center justify-center text-white shadow-md border border-[#7A1528]">
            <GraduationCap className="w-7 h-7 text-rose-200" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-[#0F172A]">
          Administrator Registration
        </h2>
        <p className="mt-1 text-center text-xs text-[#64748B] font-medium">
          Create an administrator account for StudentHub ERP
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 border border-[#E2E8F0] rounded-xl shadow-card space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Full Legal Name <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Sharma"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-md border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#7A1528] focus:border-[#7A1528] bg-[#F8FAFC] focus:bg-white text-[#0F172A]"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">
                University Email Address <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@studenthub.edu"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-md border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#7A1528] focus:border-[#7A1528] bg-[#F8FAFC] focus:bg-white lowercase text-[#0F172A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#334155] mb-1">
                  Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-md border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#7A1528] focus:border-[#7A1528] bg-[#F8FAFC] focus:bg-white font-mono text-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#334155] mb-1">
                  Confirm Password <span className="text-rose-600">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  required
                  className="w-full px-3 py-2.5 rounded-md border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#7A1528] focus:border-[#7A1528] bg-[#F8FAFC] focus:bg-white font-mono text-[#0F172A]"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#334155] mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#7A1528] bg-white text-[#0F172A]"
              >
                <option value="admin">Administrator</option>
                <option value="superadmin">Super Administrator</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={ArrowRight}
              loading={loading}
              className="w-full mt-2"
            >
              Complete Registration & Enter
            </Button>
          </form>

          <div className="pt-4 border-t border-[#F8FAFC] flex items-center justify-between text-xs text-[#64748B]">
            <span>Already have an account?</span>
            <Link
              to="/login"
              className="font-semibold text-[#7A1528] hover:text-[#7A1528] transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-[#94A3B8] flex items-center justify-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-[#7A1528]" />
          <span>Role-Based Access Control Protected</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
