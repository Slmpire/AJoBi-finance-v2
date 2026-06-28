"use client";

import { Star, TrendingUp } from "lucide-react";

interface ScoreCardProps {
  score: number;
  tier: string;
  diff: number;
}

export default function ScoreCard({ score, tier, diff }: ScoreCardProps) {
  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col md:flex-row gap-8 items-center border border-[#E8EFE8]">
      <div className="w-full md:w-5/12 shrink-0">
        <div className="bg-[#006C49] rounded-[20px] p-6 flex flex-col items-center justify-center text-white relative overflow-hidden shadow-sm">
          <div className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest mb-4 uppercase">
            Your Ajoscore Result
          </div>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-6xl font-extrabold tracking-tighter">{score}</span>
            <span className="text-xl text-white/80 font-medium">/ 100</span>
          </div>
          <div className="bg-[#FFF8E6] text-[#B8860B] px-4 py-1.5 rounded-full text-[12px] font-extrabold flex items-center gap-1.5 shadow-sm">
            <Star className="w-4 h-4 fill-current" /> {tier} Tier
          </div>
        </div>
        <div className="mt-4 text-center text-[13px] font-bold text-[#006C49] flex items-center justify-center gap-1">
          <TrendingUp className="w-4 h-4" strokeWidth={2.5} /> +{diff} pts since last week
        </div>
      </div>
      <div className="w-full md:w-7/12 md:pr-4">
        <h2 className="text-[22px] font-black text-gray-900 mb-3 tracking-tight">
          Your Financial Credibility
        </h2>
        <p className="text-[14px] text-gray-600 mb-6 leading-relaxed font-medium">
          Your savings consistency is strong. Add transaction history to grow faster. A higher score unlocks lower interest rates on loans and premium Ajo group invitations.
        </p>
        {/* <div className="flex flex-wrap gap-4">
          <button className="bg-[#066B44] hover:bg-[#055737] text-white px-6 py-3 rounded-xl text-[13px] font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
            Boost My Score
          </button>
          <button className="border border-[#E8EFE8] text-gray-700 hover:bg-[#F9FCF9] px-6 py-3 rounded-xl text-[13px] font-bold transition-colors">
            View Report
          </button>
        </div> */}
      </div>
    </div>
  );
}
