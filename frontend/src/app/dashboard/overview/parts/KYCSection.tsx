"use client";

import { useState } from 'react';
import { ShieldCheck, CreditCard, Loader2, CheckCircle2, AlertCircle, Building, Hash, User } from 'lucide-react';

interface KYCSectionProps {
  kycSuccess: boolean;
  kycLoading: boolean;
  onKYCSubmit: (data: any) => Promise<boolean>;
  virtualAccountLoading: boolean;
  virtualAccountData: any;
  onCreateVirtualAccount: () => void;
  error?: string | null;
}

export default function KYCSection({
  kycSuccess,
  kycLoading,
  onKYCSubmit,
  virtualAccountLoading,
  virtualAccountData,
  onCreateVirtualAccount,
  error
}: KYCSectionProps) {
  const [formData, setFormData] = useState({
    beneficiary_account: '',
    bvn: '',
    account_name: ''
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    const success = await onKYCSubmit(formData);
    if (!success) {
      setLocalError("Failed to update KYC. Please check your information and try again.");
    }
  };

  if (virtualAccountData) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-[#F1F6F3] shadow-sm space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#EEF8F3] rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-[#066B44]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Virtual Account Active</h2>
            <p className="text-sm text-gray-500 font-medium">Your personal bank account for instant funding.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#F1F6F3] p-5 rounded-2xl space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bank Name</p>
            <p className="text-lg font-bold text-gray-900">{virtualAccountData.bankName || 'Squad Bank'}</p>
          </div>
          <div className="bg-[#F1F6F3] p-5 rounded-2xl space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account Number</p>
            <p className="text-lg font-bold text-gray-900">{virtualAccountData.accountNumber || '0680513429'}</p>
          </div>
        </div>
        
        <div className="bg-[#F1F6F3] p-5 rounded-2xl space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account Name</p>
          <p className="text-lg font-bold text-gray-900">{virtualAccountData.accountName || 'AjoBI User'}</p>
        </div>
      </div>
    );
  }

  if (kycSuccess) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-[#F1F6F3] shadow-sm text-center space-y-6">
        <div className="w-16 h-16 bg-[#EEF8F3] rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8 text-[#066B44]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">KYC Verified Successfully</h2>
          <p className="text-gray-500 font-medium max-w-sm mx-auto">
            Your verification is complete. You can now generate your unique virtual account to start transacting.
          </p>
        </div>
        <button
          onClick={onCreateVirtualAccount}
          disabled={virtualAccountLoading}
          className="bg-[#066B44] text-white px-8 py-4 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 mx-auto transition-all hover:bg-[#055636] disabled:opacity-50"
        >
          {virtualAccountLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <CreditCard className="w-5 h-5" />
          )}
          Generate My Virtual Account
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-[#F1F6F3] shadow-sm space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#F1F6F3] rounded-2xl flex items-center justify-center">
          <User className="w-6 h-6 text-[#066B44]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Complete Your KYC</h2>
          <p className="text-sm text-gray-500 font-medium">Verify your identity to unlock all platform features.</p>
        </div>
      </div>

      {(error || localError) && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-[13px] font-medium">{error || localError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            Account Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              required
              className="w-full pl-11 pr-4 py-3.5 bg-[#F1F6F3] rounded-2xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#066B44]/10 transition-all"
              placeholder="e.g. John Doe"
              value={formData.account_name}
              onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            Beneficiary Account
          </label>
          <div className="relative">
            <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              required
              className="w-full pl-11 pr-4 py-3.5 bg-[#F1F6F3] rounded-2xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#066B44]/10 transition-all"
              placeholder="Your bank account number"
              value={formData.beneficiary_account}
              onChange={(e) => setFormData({ ...formData, beneficiary_account: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            Bank Verification Number (BVN)
          </label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              required
              maxLength={11}
              className="w-full pl-11 pr-4 py-3.5 bg-[#F1F6F3] rounded-2xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#066B44]/10 transition-all"
              placeholder="11-digit BVN"
              value={formData.bvn}
              onChange={(e) => setFormData({ ...formData, bvn: e.target.value })}
            />
          </div>
        </div>

        <div className="md:col-span-2 pt-2">
          <button
            type="submit"
            disabled={kycLoading}
            className="w-full bg-[#066B44] text-white py-4 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all hover:bg-[#055636] disabled:opacity-50"
          >
            {kycLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
            Update KYC Information
          </button>
        </div>
      </form>
    </div>
  );
}
