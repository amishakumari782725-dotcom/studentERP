import React, { useState } from 'react';
import {
  Save,
  Info,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { authService } from '../../services/authService';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      notifyError('Name and Email are required.');
      return;
    }

    if (password) {
      if (password.length < 6) {
        notifyError('New password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        notifyError('Passwords do not match.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = { name: name.trim(), email: email.trim().toLowerCase() };
      if (password) payload.password = password;

      const res = await authService.updateProfile(payload);
      if (res?.data) {
        updateUser(res.data);
        setPassword('');
        setConfirmPassword('');
        notifySuccess('Administrator profile updated successfully.');
      }
    } catch (err) {
      notifyError(err.response?.data?.message || 'Failed to update administrator profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#E2E8F0]">
        <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
          System Settings & Administrator Profile
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Configure administrator credentials, security preferences, and inspect architecture runtime diagnostics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Administrator Profile Update Card */}
        <Card
          title="Administrator Account"
          subtitle="Update login credentials and administrator identity"
          className="lg:col-span-2"
        >
          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#334155] mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] lowercase bg-white text-[#0F172A]"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#F8FAFC]">
              <h4 className="font-semibold text-[#0F172A] mb-2">Change Password</h4>
              <p className="text-[#64748B] text-[11px] mb-3">
                Leave blank if you do not want to alter the current password.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#334155] mb-1">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] font-mono bg-white text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#334155] mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3 py-2 rounded border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#7A1528] font-mono bg-white text-[#0F172A]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={Save}
                loading={submitting}
              >
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* System & Architecture Diagnostics */}
        <Card title="System Diagnostics" subtitle="Environment runtime & architecture specs">
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[#64748B] font-medium">Platform:</span>
                <Badge variant="maroon">StudentHub ERP v1.0.0 (Maroon Edition)</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B] font-medium">Architecture:</span>
                <span className="font-semibold text-[#0F172A]">MERN Stack (Vite)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B] font-medium">Theme Palette:</span>
                <span className="font-semibold text-[#7A1528]">Deep Maroon & Crimson</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B] font-medium">Database:</span>
                <div className="flex items-center space-x-1 text-emerald-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>MongoDB 7.0 (Mongoose)</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B] font-medium">Authentication:</span>
                <span className="font-semibold text-[#0F172A]">JWT + bcrypt (Salt 10)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B] font-medium">Charts Engine:</span>
                <span className="font-semibold text-[#0F172A]">Recharts 2.x</span>
              </div>
            </div>

            <div className="p-3 rounded border border-[#E2E8F0] bg-white space-y-2">
              <div className="flex items-center space-x-1.5 text-[#7A1528] font-semibold">
                <Info className="w-4 h-4" />
                <span>Maroon Academic Interface Active</span>
              </div>
              <p className="text-[#475569] text-[11px] leading-relaxed">
                Full CRUD operations are active across Students, Courses, and Departments collections. The responsive maroon theme adheres strictly to high-density university administrative standards.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
