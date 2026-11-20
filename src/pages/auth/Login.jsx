import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      notifyError('Please enter both email address and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      notifySuccess('Administrator session authenticated.');
      navigate('/dashboard');
    } catch (err) {
      notifyError(err.response?.data?.message || err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutofillDemo = () => {
    setEmail('admin@studenthub.edu');
    setPassword('AdminPassword123');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#7A1528] selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo & Title */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-lg bg-[#7A1528] flex items-center justify-center text-white shadow-md border border-[#7A1528]">
            <GraduationCap className="w-7 h-7 text-rose-200" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-[#0F172A]">
          Student<span className="text-[#7A1528]">Hub</span> ERP
        </h2>
        <p className="mt-1 text-center text-xs text-[#64748B] font-medium">
          University Administrative Management Portal
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 border border-[#E2E8F0] rounded-xl shadow-card space-y-6">
          {/* Quick Demo Credentials Autofill Banner */}
          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-[#7A1528]">
              <Sparkles className="w-4 h-4 text-[#7A1528] flex-shrink-0" />
              <span className="font-medium">Project Demo Credentials</span>
            </div>
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="text-xs font-semibold text-[#7A1528] hover:text-[#7A1528] bg-white px-2.5 py-1 rounded border border-[#E2E8F0] shadow-xs hover:bg-[#F1F5F9] transition-colors"
            >
              Autofill Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Email Field */}
            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Administrator Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@studenthub.edu"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-md border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#7A1528] focus:border-[#7A1528] bg-[#F8FAFC] focus:bg-white text-[#0F172A]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded-md border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#7A1528] focus:border-[#7A1528] bg-[#F8FAFC] focus:bg-white font-mono text-[#0F172A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#7A1528]"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={ArrowRight}
              loading={loading}
              className="w-full mt-2"
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Initial Setup Register Link */}
          <div className="pt-4 border-t border-[#F8FAFC] flex items-center justify-between text-xs text-[#64748B]">
            <span>First time setup?</span>
            <Link
              to="/register"
              className="font-semibold text-[#7A1528] hover:text-[#7A1528] transition-colors"
            >
              Register Administrator
            </Link>
          </div>
        </div>

        {/* Security Footer Notice */}
        <div className="mt-6 text-center text-xs text-[#94A3B8] flex items-center justify-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-[#7A1528]" />
          <span>Encrypted with bcrypt & JSON Web Tokens (JWT)</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
