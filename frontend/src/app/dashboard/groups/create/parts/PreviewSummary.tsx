"use client";

import { ArrowRight, ShieldCheck, Loader2 } from "lucide-react";

interface PreviewSummaryProps {
  targetPayout: number;
  cycleDuration: string;
  formattedContribution: string;
  minScore: number;
  gracePeriod: string;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export default function PreviewSummary({
  targetPayout,
  cycleDuration,
  formattedContribution,
  minScore,
  gracePeriod,
  isSubmitting,
  onSubmit
}: PreviewSummaryProps) {
  return (
    <div className="space-y-6 lg:col-span-1">
      <div className="sticky top-24 space-y-6">
        
        {/* Main Preview Box */}
        <div className="bg-[#066B44] text-white rounded-[24px] p-6 sm:p-8 shadow-[0_20px_40px_rgba(6,107,68,0.15)] border border-[#055737]">
          <h3 className="text-[18px] font-extrabold mb-6 uppercase tracking-widest border-b border-white/10 pb-4">Preview Summary</h3>
          
          <div className="space-y-5 mb-8">
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-bold opacity-80">Target Payout</span>
              <span className="font-black text-[16px]">₦{targetPayout.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-bold opacity-80">Cycle Duration</span>
              <span className="font-black">{cycleDuration}</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-bold opacity-80">Contribution</span>
              <span className="font-black">{formattedContribution}</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-bold opacity-80">Min. AjoScore</span>
              <span className="font-black">{minScore}+</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-bold opacity-80">Grace Period</span>
              <span className="font-black">{gracePeriod}</span>
            </div>
          </div>

          <button 
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full bg-white cursor-pointer text-[#066B44] hover:bg-gray-50 disabled:opacity-90 py-4 rounded-xl text-[14px] font-black flex items-center justify-center gap-2 shadow-md transition-all duration-200 group hover:shadow-lg"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Create Group
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
              </>
            )}
          </button>

          <p className="text-[10px] text-white/60 font-medium text-center mt-4 leading-relaxed">
            By creating this group, you agree to our Smart Contract Ajo Terms.
          </p>
        </div>

        {/* Trust Guarantee Block */}
        <div className="bg-[#F4FCF7] rounded-[24px] p-5 border border-[#E8EFE8] flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-white border border-[#DCE8E0] flex items-center justify-center text-[#066B44] shrink-0 shadow-sm">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[12px] font-extrabold text-gray-800 uppercase tracking-wide mb-1">AjoBI Trust Guarantee</h4>
            <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
              As the group creator, your AjoScore will be staked to ensure initial group credibility. All contributions are held in secure escrow.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
