"use client";

import Image from "next/image";
import { 
  User, 
  Camera, 
  ShieldCheck, 
  KeyRound, 
  Fingerprint, 
  Bell, 
  Check, 
  Languages 
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="w-full mx-auto pb-12 pt-4 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-[#066B44] mb-2 tracking-tight">
          Settings
        </h1>
        <p className="text-[14px] text-gray-600 font-medium">
          Manage your digital identity and account preferences.
        </p>
      </div>

      {/* Main Settings Card */}
      <div className="bg-[#FAFCFB] rounded-[24px] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#E8EFE8]">
        
        {/* SECTION 1: Profile Information */}
        <div className="mb-12">
          <div className="flex items-center gap-3 border-b border-[#DCE8E0] pb-3 mb-6">
            <User className="w-5 h-5 text-[#066B44]" strokeWidth={2.5} />
            <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
              Profile Information
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-8">
            {/* Avatar */}
            <div className="relative shrink-0 mx-auto sm:mx-0 w-[100px] h-[100px]">
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-[3px] border-[#066B44] shadow-sm relative">
                <Image 
                  src="https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?q=80&w=256&auto=format&fit=crop" 
                  alt="Profile Photo" 
                  fill 
                  className="object-cover" 
                />
              </div>
              <button className="absolute bottom-0 right-0 w-[30px] h-[30px] bg-[#066B44] rounded-full flex items-center justify-center border-2 border-[#FAFCFB] text-white shadow-sm hover:scale-105 transition-transform">
                <Camera className="w-[14px] h-[14px]" strokeWidth={2.5} />
              </button>
            </div>

            {/* Form Fields */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5 tracking-wide">
                  Full Name
                </label>
                <input 
                  type="text" 
                  defaultValue="Amara Okafor" 
                  className="w-full bg-[#F1F6F3] border-none rounded-xl px-4 py-3.5 text-[14px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5 tracking-wide">
                  Phone Number
                </label>
                <input 
                  type="text" 
                  defaultValue="+234 803 123 4567" 
                  className="w-full bg-[#F1F6F3] border-none rounded-xl px-4 py-3.5 text-[14px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none transition-all" 
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5 tracking-wide">
                  Email Address
                </label>
                <input 
                  type="email" 
                  defaultValue="amara.okafor@example.com" 
                  className="w-full bg-[#F1F6F3] border-none rounded-xl px-4 py-3.5 text-[14px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none transition-all" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Security & Access */}
        <div className="mb-12">
          <div className="flex items-center gap-3 border-b border-[#DCE8E0] pb-3 mb-6">
            <ShieldCheck className="w-5 h-5 text-[#066B44]" strokeWidth={2.5} />
            <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
              Security & Access
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-[#F1F6F3] rounded-2xl border border-transparent hover:border-[#DCE8E0] transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-gray-500">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-gray-900 tracking-tight mb-0.5">Transaction PIN</p>
                  <p className="text-[12px] text-gray-500">Used for verifying all transfers</p>
                </div>
              </div>
              <button className="text-[13px] font-medium text-[#066B44] hover:underline px-2">
                Change PIN
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F1F6F3] rounded-2xl border border-transparent hover:border-[#DCE8E0] transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-gray-500">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-gray-900 tracking-tight mb-0.5">Biometric Login</p>
                  <p className="text-[12px] text-gray-500">Unlock with Face ID or Fingerprint</p>
                </div>
              </div>
              {/* Toggle Switch ON */}
              <button className="w-[44px] h-[24px] bg-[#066B44] rounded-full relative cursor-pointer shadow-inner focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#066B44] transition-all">
                <span className="absolute left-[22px] top-[2px] w-[20px] h-[20px] bg-white rounded-full shadow-sm transition-all" />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: Notification Preferences */}
        <div className="mb-12">
          <div className="flex items-center gap-3 border-b border-[#DCE8E0] pb-3 mb-6">
            <Bell className="w-5 h-5 text-[#066B44]" strokeWidth={2.5} />
            <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-6 pl-2">
            <div className="flex items-center gap-4 cursor-pointer group">
              <div className="w-[22px] h-[22px] rounded-md bg-[#066B44] flex items-center justify-center text-white shrink-0 shadow-sm group-hover:bg-[#055737] transition-colors">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-900 tracking-tight mb-0.5">Push Notifications</p>
                <p className="text-[12px] text-gray-500">Account alerts and payment reminders</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 cursor-pointer group">
              <div className="w-[22px] h-[22px] rounded-md bg-[#066B44] flex items-center justify-center text-white shrink-0 shadow-sm group-hover:bg-[#055737] transition-colors">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-900 tracking-tight mb-0.5">SMS Alerts</p>
                <p className="text-[12px] text-gray-500">Security notifications and OTPs</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Regional Settings */}
        <div className="mb-10">
          <div className="flex items-center gap-3 border-b border-[#DCE8E0] pb-3 mb-6">
            <Languages className="w-5 h-5 text-[#066B44]" strokeWidth={2.5} />
            <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
              Regional Settings
            </h2>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1.5 tracking-wide">
              Preferred Language
            </label>
            <input 
              type="text" 
              defaultValue="English (UK)" 
              className="w-full bg-[#F1F6F3] border-none rounded-xl px-4 py-3.5 text-[14px] font-medium text-gray-900 focus:ring-2 focus:ring-[#066B44]/20 outline-none transition-all" 
              readOnly
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-5 pt-8">
          <button className="text-[14px] font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Discard
          </button>
          <button className="bg-[#066B44] hover:bg-[#055737] text-white px-7 py-3 rounded-lg text-[14px] font-bold transition-all shadow-[0_4px_14px_0_rgba(6,107,68,0.2)] hover:shadow-[0_6px_20px_rgba(6,107,68,0.15)] hover:-translate-y-0.5">
            Save Changes
          </button>
        </div>

      </div>

      {/* Footer Text */}
      <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 opacity-90">
        <ShieldCheck className="w-[14px] h-[14px]" />
        <p className="text-[12px] font-medium tracking-wide">
          Your data is encrypted and secure with AjoBI bank-grade security.
        </p>
      </div>

    </div>
  );
}
