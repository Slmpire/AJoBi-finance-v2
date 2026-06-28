"use client";

import { ChevronDown, Loader2, ShieldCheck } from "lucide-react";

interface WorkStepProps {
  formData: any;
  updateForm: (key: string, value: any) => void;
  submitStep: () => void;
  prevStep: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export default function WorkStep({ formData, updateForm, submitStep, prevStep, isSubmitting, error }: WorkStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Work Details</h2>
        <p className="text-sm text-gray-500 mt-2">Tell us more about your business operations.</p>
      </div>
      
      <div className="space-y-6 mb-8">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">How long have you been doing this?</label>
          <div className="relative">
            <select 
              value={formData.workDuration}
              onChange={(e) => updateForm("workDuration", e.target.value)}
              className="w-full appearance-none px-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-ajobi-green bg-white"
            >
              <option value="" disabled>Select duration</option>
              <option value="Less than 1 year">Less than 1 year</option>
              <option value="1-3 years">1-3 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="More than 5 years">More than 5 years</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">State</label>
            <div className="relative">
              <select 
                value={formData.state}
                onChange={(e) => updateForm("state", e.target.value)}
                className="w-full appearance-none px-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-ajobi-green bg-white"
              >
                <option value="" disabled>Select State</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Kano">Kano</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">LGA</label>
            <div className="relative">
              <select 
                value={formData.lga}
                onChange={(e) => updateForm("lga", e.target.value)}
                className="w-full appearance-none px-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-ajobi-green bg-white"
              >
                <option value="" disabled>Select LGA</option>
                <option value="Ikeja">Ikeja</option>
                <option value="Surulere">Surulere</option>
                <option value="Yaba">Yaba</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-medium text-gray-700">Estimated weekly income range</label>
          <div className="grid grid-cols-2 gap-3">
            {["Below ₦5k", "₦5k-₦20k", "₦20k-₦50k", "₦50k-₦100k"].map((option) => (
              <button
                key={option}
                onClick={() => updateForm("incomeRange", option)}
                className={`text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all ${
                  formData.incomeRange === option 
                    ? 'border-ajobi-green bg-[#EEF8F3] text-ajobi-green' 
                    : 'border-gray-200 hover:border-ajobi-green/50 text-gray-700 bg-white'
                }`}
              >
                {option}
              </button>
            ))}
            <button
              onClick={() => updateForm("incomeRange", "Above ₦100k")}
              className={`col-span-2 text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all ${
                formData.incomeRange === "Above ₦100k"
                  ? 'border-ajobi-green bg-[#EEF8F3] text-ajobi-green' 
                  : 'border-gray-200 hover:border-ajobi-green/50 text-gray-700 bg-white'
              }`}
            >
              Above ₦100k
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100 flex items-center gap-2 mb-6">
          <ShieldCheck className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="flex justify-between items-center pt-4">
        <button 
          onClick={prevStep}
          className="text-sm font-bold text-ajobi-green hover:underline px-4 py-2"
        >
          Back
        </button>
        <button 
          onClick={submitStep}
          disabled={!formData.workDuration || !formData.state || !formData.lga || !formData.incomeRange || isSubmitting}
          className="w-[60%] sm:w-[50%] flex justify-center items-center bg-ajobi-green hover:bg-ajobi-green-dark text-white py-3.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving...
            </>
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </div>
  );
}
