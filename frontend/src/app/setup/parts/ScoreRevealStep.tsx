"use client";

import { Star, TrendingUp, Wallet, Gauge, Users, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { SetupFinalResponse } from "@/services/setupService";

interface ScoreRevealStepProps {
  scoreData: SetupFinalResponse['data'] | null;
}

export default function ScoreRevealStep({ scoreData }: ScoreRevealStepProps) {
  const score = scoreData?.ajo_score || 0;
  const tier = scoreData?.score_tier || "Bronze";
  const explanation = scoreData?.explanation || "Keep using AjoBI to build your score.";
  const tips = scoreData?.improvement_tips || [];
  return (
    <div className="animate-in fade-in zoom-in-95 duration-700 w-full mx-auto pb-10">
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-stretch">
        {/* Main Score Card */}
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-t-4 border-ajobi-green overflow-hidden flex-1 flex flex-col items-center p-8 relative min-h-[360px]">
           <div className="absolute top-8">
             <span className="px-4 py-1.5 bg-[#E6F5F0] text-ajobi-green text-xs font-bold tracking-widest rounded-full uppercase">
               Ajoscore Revealed
             </span>
           </div>
           
           <div className="mt-14 w-full bg-[#0A734D] p-8 flex flex-col items-center justify-center text-white relative overflow-hidden shadow-sm">
             <span className="px-4 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider mb-5">
               Your Ajoscore Result
             </span>
             <div className="flex items-baseline gap-2 mb-5">
               <span className="text-6xl sm:text-7xl font-bold tracking-tighter">{score}</span>
               <span className="text-xl sm:text-2xl text-white/70 font-medium">/ 900</span>
             </div>
             <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#EAEFFF] text-[#4F46E5] rounded-full text-xs font-bold shadow-sm">
               <Star className="w-3.5 h-3.5 fill-[#4F46E5]" /> {tier} Tier
             </div>
           </div>

           <div className="mt-8 text-center px-4 w-full">
             <h2 className="text-[22px] font-bold text-gray-900 mb-3 tracking-tight">Great Start!</h2>
             <p className="text-[13px] text-gray-500 leading-relaxed max-w-sm mx-auto">
               {explanation}
             </p>
           </div>
        </div>

        {/* Right Small Card */}
        <div className="md:w-[320px] bg-[#0A734D] h-max rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 text-white flex flex-col justify-center">
          <div className="mb-6">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-[22px] font-bold mb-3 tracking-tight">How to Improve</h3>
          <div className="space-y-4 mb-6">
            {tips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00BA75] shrink-0 mt-0.5" />
                <p className="text-[13px] text-white/80 leading-snug">{tip}</p>
              </div>
            ))}
            {tips.length === 0 && (
              <p className="text-[13px] text-white/80">Keep up your good financial habits.</p>
            )}
          </div>
        </div>
      </div>

      {/* Unlocks Card */}
      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10 mb-10">
        <div className="flex items-center gap-3 mb-8">
           <Sparkles className="w-6 h-6 text-[#0A734D]" />
           <h3 className="text-xl font-bold text-gray-900">What this unlocks</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12">
          <div className="flex gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF8F3] flex items-center justify-center shrink-0">
              <Wallet className="w-6 h-6 text-[#0A734D]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1.5">Access to Grow-Capital</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed">Immediate eligibility for our micro-business loan program with low interest rates.</p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF8F3] flex items-center justify-center shrink-0">
              <Gauge className="w-6 h-6 text-[#0A734D]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1.5">Higher Credit Limits</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed">Your transaction limit has been increased to ₦500,000 per month.</p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF8F3] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-[#0A734D]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1.5">Elite Ajo Groups</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed">Exclusive invitation to high-contribution savings circles with vetted partners.</p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF8F3] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#0A734D]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1.5">Trust Verification</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed">A verified score badge displayed on your profile for peer-to-peer lending.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-6 px-4">
        <Link href="/dashboard" className="w-full sm:w-[280px] bg-[#0A734D] hover:bg-[#085a3c] text-white px-8 py-4 rounded-xl text-[15px] font-bold transition-all text-center shadow-[0_4px_14px_0_rgba(10,115,77,0.39)] hover:shadow-[0_6px_20px_rgba(10,115,77,0.23)] hover:-translate-y-0.5">
          Continue to Dashboard
        </Link>
        <button className="text-[14px] font-bold text-[#0A734D] hover:underline transition-all">
          How can I improve my score?
        </button>
        <button className="text-[14px] font-medium text-gray-500 hover:text-[#0A734D] transition-colors sm:ml-auto">
          Share my Score
        </button>
      </div>
    </div>
  );
}
