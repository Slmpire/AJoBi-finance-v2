"use client";

import { useState, useEffect } from "react";
import {
  User,
  Camera,
  ShieldCheck,
  KeyRound,
  Bell,
  Check,
  Languages,
  Loader2,
} from "lucide-react";
import { userService } from "@/services/userService";
import { settingsService } from "@/services/settingsService";

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    language: 'english',
  });

  const [notifData, setNotifData] = useState({
    email_notifications: true,
    sms_notifications: true,
    push_notifications: false,
    contribution_reminders: true,
    payout_alerts: true,
    escrow_updates: true,
  });

  useEffect(() => {
    Promise.all([
      userService.getProfile(),
      settingsService.getNotifications(),
    ]).then(([profileRes, notifRes]) => {
      if (profileRes.status && profileRes.data) {
        const d = profileRes.data;
        setProfile(d);
        setFormData({
          full_name: d.full_name || '',
          phone: d.phone || '',
          email: d.email || '',
          language: d.language || 'english',
        });
      }
      if (notifRes.status && notifRes.data) {
        setNotifData(notifRes.data);
      }
    }).catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const [profileRes, notifRes] = await Promise.all([
        userService.updateProfile({
          full_name: formData.full_name,
          phone: formData.phone,
          language: formData.language,
        }),
        settingsService.updateNotifications(notifData),
      ]);

      if (profileRes.status) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(profileRes.message || 'Failed to save changes');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#066B44] animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pb-12 pt-4 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-[#066B44] mb-2 tracking-tight">Settings</h1>
        <p className="text-[14px] text-gray-600 font-medium">
          Manage your digital identity and account preferences.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl font-medium text-sm border border-red-100">
          {error}
        </div>
      )}

      {saved && (
        <div className="mb-6 p-4 bg-green-50 text-[#066B44] rounded-xl font-bold text-sm border border-green-100 flex items-center gap-2">
          <Check className="w-4 h-4" /> Changes saved successfully
        </div>
      )}

      <div className="bg-[#FAFCFB] rounded-[24px] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#E8EFE8]">

        {/* Profile Information */}
        <div className="mb-12">
          <div className="flex items-center gap-3 border-b border-[#DCE8E0] pb-3 mb-6">
            <User className="w-5 h-5 text-[#066B44]" strokeWidth={2.5} />
            <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">Profile Information</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-8">
            <div className="relative shrink-0 mx-auto sm:mx-0 w-[100px] h-[100px]">
              <div className="w-[100px] h-[100px] rounded-full bg-[#066B44] flex items-center justify-center border-[3px] border-[#066B44] shadow-sm">
                <span className="text-white font-black text-3xl">
                  {formData.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 w-[30px] h-[30px] bg-[#066B44] rounded-full flex items-center justify-center border-2 border-[#FAFCFB] text-white shadow-sm hover:scale-105 transition-transform">
                <Camera className="w-[14px] h-[14px]" strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5 tracking-wide">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))}
                  className="w-full bg-[#F1F6F3] border-none rounded-xl px-4 py-3.5 text-[14px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5 tracking-wide">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                  className="w-full bg-[#F1F6F3] border-none rounded-xl px-4 py-3.5 text-[14px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5 tracking-wide">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-[#F1F6F3] border-none rounded-xl px-4 py-3.5 text-[14px] font-medium text-gray-400 outline-none cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1 font-medium">Email cannot be changed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="mb-12">
          <div className="flex items-center gap-3 border-b border-[#DCE8E0] pb-3 mb-6">
            <ShieldCheck className="w-5 h-5 text-[#066B44]" strokeWidth={2.5} />
            <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">Security & Access</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-[#F1F6F3] rounded-2xl">
              <div className="flex items-center gap-4">
                <KeyRound className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-[14px] font-bold text-gray-900">BVN Status</p>
                  <p className="text-[12px] text-gray-500">
                    {profile?.bvn ? `Verified ••••${profile.bvn.slice(-4)}` : 'Not submitted yet'}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${profile?.bvn ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                {profile?.bvn ? 'Verified' : 'Pending'}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F1F6F3] rounded-2xl">
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-[14px] font-bold text-gray-900">Bank Account</p>
                  <p className="text-[12px] text-gray-500">
                    {profile?.beneficiary_account
                      ? `${profile.account_name} — ••••${profile.beneficiary_account.slice(-4)}`
                      : 'No account linked yet'}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${profile?.beneficiary_account ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                {profile?.beneficiary_account ? 'Linked' : 'Not linked'}
              </span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-12">
          <div className="flex items-center gap-3 border-b border-[#DCE8E0] pb-3 mb-6">
            <Bell className="w-5 h-5 text-[#066B44]" strokeWidth={2.5} />
            <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">Notification Preferences</h2>
          </div>

          <div className="space-y-4 pl-2">
            {[
              { key: 'email_notifications', label: 'Email Notifications', desc: 'Receive updates via email' },
              { key: 'sms_notifications', label: 'SMS Alerts', desc: 'Security notifications and payment alerts' },
              { key: 'contribution_reminders', label: 'Contribution Reminders', desc: 'Reminded before your Ajo payment is due' },
              { key: 'payout_alerts', label: 'Payout Alerts', desc: 'Notified when you receive a payout' },
              { key: 'escrow_updates', label: 'Escrow Updates', desc: 'Updates on your escrow transactions' },
            ].map(item => (
              <div
                key={item.key}
                className="flex items-center gap-4 cursor-pointer group"
                onClick={() => setNotifData(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
              >
                <div className={`w-[22px] h-[22px] rounded-md flex items-center justify-center text-white shrink-0 shadow-sm transition-colors ${notifData[item.key as keyof typeof notifData] ? 'bg-[#066B44]' : 'bg-gray-200'}`}>
                  {notifData[item.key as keyof typeof notifData] && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                </div>
                <div>
                  <p className="text-[14px] font-bold text-gray-900">{item.label}</p>
                  <p className="text-[12px] text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="mb-10">
          <div className="flex items-center gap-3 border-b border-[#DCE8E0] pb-3 mb-6">
            <Languages className="w-5 h-5 text-[#066B44]" strokeWidth={2.5} />
            <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">Regional Settings</h2>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1.5 tracking-wide">Preferred Language</label>
            <select
              value={formData.language}
              onChange={e => setFormData(p => ({ ...p, language: e.target.value }))}
              className="w-full bg-[#F1F6F3] border-none rounded-xl px-4 py-3.5 text-[14px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none"
            >
              <option value="english">English</option>
              <option value="yoruba">Yoruba</option>
              <option value="igbo">Igbo</option>
              <option value="hausa">Hausa</option>
              <option value="pidgin">Pidgin</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-5 pt-8">
          <button
            onClick={() => window.location.reload()}
            className="text-[14px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#066B44] hover:bg-[#055737] text-white px-7 py-3 rounded-lg text-[14px] font-bold transition-all shadow-[0_4px_14px_0_rgba(6,107,68,0.2)] disabled:opacity-70 flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 opacity-90">
        <ShieldCheck className="w-[14px] h-[14px]" />
        <p className="text-[12px] font-medium tracking-wide">
          Your data is encrypted and secure with AjoBI bank-grade security.
        </p>
      </div>
    </div>
  );
}