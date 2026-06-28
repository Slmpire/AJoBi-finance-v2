"use client";

import { Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { MatchedGroup } from "../model/useGroups";

interface AutoMatchProps {
  matchAmount: string;
  setMatchAmount: (v: string) => void;
  matchFrequency: 'Monthly' | 'Weekly';
  setMatchFrequency: (v: 'Monthly' | 'Weekly') => void;
  isMatching: boolean;
  showMatches: boolean;
  onFindMatch: () => void;
  matchedGroups: MatchedGroup[];
}

export default function AutoMatch({
  matchAmount,
  setMatchAmount,
  matchFrequency,
  setMatchFrequency,
  isMatching,
  showMatches,
  onFindMatch,
  matchedGroups
}: AutoMatchProps) {
  return (
    <div className="bg-[#F4FCF7] rounded-[32px] p-8 sm:p-10 border border-[#E8EFE8] relative overflow-hidden">
      
      {/* Background Decorative Blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#066B44]/5 blur-[80px] rounded-full -mr-20 -mt-20" />
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#066B44]/10 text-[#066B44] text-[11px] font-extrabold uppercase tracking-wider rounded-full mb-4 border border-[#066B44]/10 shadow-sm">
          <Sparkles className="w-3 h-3 fill-current" /> AI-Powered Matching
        </span>
        <h3 className="text-[24px] sm:text-[28px] font-black text-gray-900 tracking-tight mb-2">
          Find Your Perfect Ajo
        </h3>
        <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
          Our AI analyzes your credit score, contribution history, and goals to match you with highly compatible, verified savings circles.
        </p>
      </div>

      {/* Matching Card Selector */}
      <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,107,68,0.05)] max-w-[640px] mx-auto border border-[#E8EFE8] relative z-10 mb-10">
        <div className="space-y-6">
          <div>
            <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-3">
              How much do you want to contribute?
            </label>
            <div className="relative flex items-baseline border-b-2 border-[#E8EFE8] focus-within:border-[#066B44] transition-colors pb-3 group">
              <span className="text-[20px] font-black text-gray-400 mr-2">₦</span>
              <input 
                type="text" 
                value={matchAmount}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  if (val === "") {
                    setMatchAmount("");
                    return;
                  }
                  const formatted = Number(val).toLocaleString();
                  setMatchAmount(formatted);
                }}
                className="text-[28px] font-black text-gray-900 outline-none w-full bg-transparent"
                placeholder="50,000"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
            <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider">Frequency</label>
            <div className="bg-gray-100 p-1 rounded-xl flex gap-1 shadow-inner">
              {(['Monthly', 'Weekly'] as const).map((freq) => (
                <button
                  key={freq}
                  onClick={() => setMatchFrequency(freq)}
                  className={`px-6 py-2.5 rounded-lg text-[12px] font-extrabold transition-all ${
                    matchFrequency === freq 
                      ? 'bg-white text-[#066B44] shadow-sm' 
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={onFindMatch}
            disabled={isMatching}
            className="w-full bg-[#066B44] hover:bg-[#055737] disabled:opacity-80 text-white py-4 rounded-xl text-[15px] font-black shadow-[0_4px_20px_rgba(6,107,68,0.3)] transition-all flex items-center justify-center gap-2.5"
          >
            {isMatching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-5 h-5 fill-current" />
                Find My Group
              </>
            )}
          </button>
        </div>
      </div>

      {/* Matched Results Block */}
      {(showMatches || !isMatching) && (
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 transition-opacity duration-500 ${showMatches ? 'opacity-100' : 'opacity-60 pointer-events-none select-none'}`}>
          {matchedGroups.map((group) => (
            <div key={group.id} className="bg-white rounded-[20px] border border-[#E8EFE8] p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2.5 py-1 bg-[#F1F6F3] text-[#066B44] text-[10px] font-black rounded-md uppercase tracking-wider border border-[#DCE8E0]">
                    {group.matchRate}% Match
                  </span>
                  <Sparkles className="w-4 h-4 text-[#066B44]/40 transition-colors group-hover:text-[#066B44]" />
                </div>

                <h4 className="text-[15px] font-black text-gray-900 mb-1 group-hover:text-[#066B44] transition-colors">{group.name}</h4>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-5">{group.description}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4 text-[12px] font-bold pt-4 border-t border-[#F1F6F3]">
                  <span className="text-[#066B44]">{group.amount}</span>
                  <span className="text-gray-500">{group.members}</span>
                </div>

                <Link 
                  href={`/dashboard/groups/${group.id}`}
                  className="w-full bg-[#F1F6F3] hover:bg-[#066B44] text-[#066B44] hover:text-white py-2.5 rounded-xl text-[12px] font-extrabold transition-colors flex items-center justify-center"
                >
                  Review Members
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
