"use client";

import { Loader2, ShieldCheck } from "lucide-react";

interface CreditStepProps {
  formData: any;
  updateForm: (key: string, value: any) => void;
  submitStep: () => void;
  prevStep: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export default function CreditStep({ formData, updateForm, submitStep, prevStep, isSubmitting, error }: CreditStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Credit History</h2>
        <p className="text-sm text-gray-500 mt-2">This helps us understand your repayment capacity.</p>
      </div>

      <div className="space-y-6 mb-8 min-h-[220px]">
        <div className="space-y-3">
          <label className="text-xs font-medium text-gray-700">Have you ever borrowed money?</label>
          <div className="grid grid-cols-2 gap-3">
            {["Yes", "No"].map((option) => (
              <button
                key={option}
                onClick={() => updateForm("borrowedMoney", option)}
                className={`text-center px-4 py-3.5 rounded-xl border text-sm font-bold transition-all ${
                  formData.borrowedMoney === option 
                    ? 'border-ajobi-green bg-[#EEF8F3] text-ajobi-green' 
                    : 'border-gray-200 hover:border-ajobi-green/50 text-gray-700 bg-white'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {formData.borrowedMoney === "Yes" && (
          <>
            <div className="space-y-3 animate-in fade-in duration-300">
              <label className="text-xs font-medium text-gray-700">If yes — did you pay it back fully?</label>
              <div className="grid grid-cols-3 gap-3">
                {["Yes", "No", "Partially"].map((option) => (
                  <button
                    key={option}
                    onClick={() => updateForm("paidBackFully", option)}
                    className={`text-center px-2 py-3.5 rounded-xl border text-[13px] font-medium transition-all ${
                      formData.paidBackFully === option 
                        ? 'border-ajobi-green bg-[#EEF8F3] text-ajobi-green' 
                        : 'border-gray-200 hover:border-ajobi-green/50 text-gray-700 bg-white'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 animate-in fade-in duration-300">
              <label className="text-xs font-medium text-gray-700">Did you pay on time?</label>
              <div className="grid grid-cols-3 gap-3">
                {["Yes", "No", "Sometimes"].map((option) => (
                  <button
                    key={option}
                    onClick={() => updateForm("paidOnTime", option)}
                    className={`text-center px-2 py-3.5 rounded-xl border text-[13px] font-medium transition-all ${
                      formData.paidOnTime === option 
                        ? 'border-ajobi-green bg-[#EEF8F3] text-ajobi-green' 
                        : 'border-gray-200 hover:border-ajobi-green/50 text-gray-700 bg-white'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100 flex items-center gap-2 mb-6">
          <ShieldCheck className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <button 
          onClick={prevStep}
          className="text-sm font-bold text-ajobi-green hover:underline px-4 py-2"
        >
          Back
        </button>
        <button 
          onClick={submitStep}
          disabled={!formData.borrowedMoney || (formData.borrowedMoney === "Yes" && (!formData.paidBackFully || !formData.paidOnTime)) || isSubmitting}
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
