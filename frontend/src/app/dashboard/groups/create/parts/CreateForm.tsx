"use client";

import { Info, Sliders, ShieldCheck, FileText, ChevronRight } from "lucide-react";
import { CreateGroupFormData } from "../model/useCreateGroup";

interface CreateFormProps {
  formData: CreateGroupFormData;
  updateField: <K extends keyof CreateGroupFormData>(field: K, value: CreateGroupFormData[K]) => void;
}

export default function CreateForm({ formData, updateField }: CreateFormProps) {
  return (
    <div className="space-y-8 lg:col-span-2 pb-12">
      
      {/* 1. Basic Information */}
      <div className="bg-white rounded-[24px] border border-[#E8EFE8] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#F1F6F3] text-[#066B44] rounded-xl flex items-center justify-center shadow-sm">
            <Info className="w-5 h-5" />
          </div>
          <h3 className="text-[16px] font-extrabold text-gray-900 tracking-tight uppercase tracking-wider opacity-90">Basic Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2.5">
            <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider">Group Name</label>
            <input 
              type="text" 
              placeholder="e.g. Lagos Traders Union"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#066B44] text-[14px] font-medium text-gray-800 transition-all outline-none shadow-inner"
            />
          </div>

          <div className="space-y-2.5">
            <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider">Contribution Amount (₦)</label>
            <input 
              type="number" 
              placeholder="50,000"
              value={formData.amount}
              onChange={(e) => updateField("amount", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#066B44] text-[14px] font-medium text-gray-800 transition-all outline-none shadow-inner"
            />
          </div>

          <div className="md:col-span-2 space-y-2.5">
            <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider">Contribution Frequency</label>
            <div className="bg-gray-50 p-1 rounded-xl flex gap-1 w-fit border border-gray-100 shadow-inner">
              {(['Weekly', 'Monthly'] as const).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => updateField("frequency", freq)}
                  className={`px-8 py-2.5 rounded-lg text-[12px] font-extrabold transition-all ${
                    formData.frequency === freq 
                      ? 'bg-white text-[#066B44] shadow-sm border border-gray-100' 
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Group Parameters */}
      <div className="bg-white rounded-[24px] border border-[#E8EFE8] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#F1F6F3] text-[#066B44] rounded-xl flex items-center justify-center shadow-sm">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="text-[16px] font-extrabold text-gray-900 tracking-tight uppercase tracking-wider opacity-90">Group Parameters</h3>
        </div>

        <div className="space-y-8">
          {/* Max Members Slider */}
          <div className="space-y-4">
            <div className="flex justify-between text-[12px] font-bold text-gray-700 uppercase tracking-wide">
              <span>Maximum Members</span>
              <span className="text-[#066B44] text-[15px] font-black">{formData.maxMembers}</span>
            </div>
            <input 
              type="range" 
              min={5} 
              max={20} 
              value={formData.maxMembers}
              onChange={(e) => updateField("maxMembers", parseInt(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#066B44] outline-none"
            />
            <div className="flex justify-between text-[10px] font-extrabold text-gray-400 uppercase">
              <span>5 Members</span>
              <span>20 Members</span>
            </div>
          </div>

          {/* Min AjoScore Slider */}
          <div className="space-y-4">
            <div className="flex justify-between text-[12px] font-bold text-gray-700 uppercase tracking-wide">
              <span>Minimum AjoScore Required</span>
              <span className="text-[#066B44] text-[15px] font-black">{formData.minScore}</span>
            </div>
            <input 
              type="range" 
              min={400} 
              max={1000} 
              step={10}
              value={formData.minScore}
              onChange={(e) => updateField("minScore", parseInt(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#066B44] outline-none"
            />
            <div className="flex justify-between text-[10px] font-extrabold text-gray-400 uppercase">
              <span>Entry Level (400)</span>
              <span>Elite (1000)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Rules & Rotation */}
      <div className="bg-white rounded-[24px] border border-[#E8EFE8] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#F1F6F3] text-[#066B44] rounded-xl flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-[16px] font-extrabold text-gray-900 tracking-tight uppercase tracking-wider opacity-90">Rules & Rotation</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rotation Order */}
          <div className="space-y-3">
            <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wide">Rotation Order</label>
            
            <div className="space-y-3">
              {(['Random Draw', 'Fixed Order'] as const).map((opt) => (
                <label 
                  key={opt}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.rotationOrder === opt 
                      ? 'border-[#066B44] bg-[#F9FCF9]' 
                      : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="rotationOrder"
                    checked={formData.rotationOrder === opt}
                    onChange={() => updateField("rotationOrder", opt)}
                    className="mt-0.5 accent-[#066B44] shrink-0"
                  />
                  <div>
                    <p className="text-[13px] font-extrabold text-gray-900">{opt}</p>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-0.5">
                      {opt === "Random Draw" ? "Automated fair shuffle every cycle" : "First-come, first-served order"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Grace Period */}
          <div className="space-y-3">
            <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wide">Grace Period</label>
            
            <div className="space-y-3">
              {(['24 Hours', '48 Hours'] as const).map((opt) => (
                <label 
                  key={opt}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.gracePeriod === opt 
                      ? 'border-[#066B44] bg-[#F9FCF9]' 
                      : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="gracePeriod"
                    checked={formData.gracePeriod === opt}
                    onChange={() => updateField("gracePeriod", opt)}
                    className="mt-0.5 accent-[#066B44] shrink-0"
                  />
                  <div>
                    <p className="text-[13px] font-extrabold text-gray-900">{opt}</p>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-0.5">
                      {opt === "24 Hours" ? "Strict timeline for promptness" : "Flexible buffer for unexpected delays"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Description */}
      <div className="bg-white rounded-[24px] border border-[#E8EFE8] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#F1F6F3] text-[#066B44] rounded-xl flex items-center justify-center shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-[16px] font-extrabold text-gray-900 tracking-tight uppercase tracking-wider opacity-90">Description (Optional)</h3>
        </div>

        <textarea 
          placeholder="Briefly explain the purpose of this group to attract the right members..."
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={4}
          className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#066B44] text-[14px] font-medium text-gray-800 transition-all outline-none shadow-inner resize-none"
        />
      </div>

    </div>
  );
}
