"use client";

import { useEffect, useState } from "react";
import { scoreService } from "@/services/scoreService";
import { Loader2, ShieldCheck, TrendingUp, Lock } from "lucide-react";

export default function ScorePage() {
  const [score, setScore] = useState<any>(null);
  const [eligibility, setEligibility] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      scoreService.getAjoScore(),
      scoreService.getEligibility(),
    ]).then(([scoreRes, eligRes]) => {
      if (scoreRes.status) setScore(scoreRes.data);
      if (eligRes.status) setEligibility(eligRes.data);
    }).catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#066B44] animate-spin" />
      </div>
    );
  }

  const tierColor = score?.tier_color || '#9CA3AF';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-[32px] font-black text-gray-900 tracking-tight">AjoScore & Eligibility</h1>
        <p className="text-gray-500 font-medium mt-1">Your financial identity built from real behaviour.</p>
      </div>

      {/* Score Card */}
      <div className="bg-white rounded-[32px] p-8 border border-[#F1F6F3] shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-40 h-40 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F6F3" strokeWidth="12" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke={tierColor} strokeWidth="12"
                strokeDasharray={`${(score?.score || 0) * 2.51} 251`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-gray-900">{score?.score || 0}</span>
              <span className="text-xs font-bold text-gray-400 uppercase">/100</span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: tierColor }}>
                {score?.tier || 'Starter'} Tier
              </span>
              <h2 className="text-2xl font-black text-gray-900 mt-1">
                {score?.points_to_next_tier > 0
                  ? `${score.points_to_next_tier} points to ${score.next_tier}`
                  : 'Maximum tier reached'}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {score?.breakdown && Object.entries(score.breakdown).map(([key, val]: any) => (
                <div key={key} className="bg-[#F9FBFA] rounded-xl p-3 border border-[#F1F6F3]">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{val.label}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#066B44] rounded-full" style={{ width: `${(val.score / val.weight) * 100}%` }} />
                    </div>
                    <span className="text-xs font-black text-gray-700">{val.score}/{val.weight}</span>
                  </div>
                </div>
              ))}
            </div>

            {score?.improvement_tips?.length > 0 && (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">How to improve</p>
                {score.improvement_tips.map((tip: string, i: number) => (
                  <p key={i} className="text-sm text-amber-800 font-medium">• {tip}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Eligibility Card */}
      {eligibility && (
        <div className="bg-white rounded-[32px] p-8 border border-[#F1F6F3] shadow-sm space-y-6">
          <h3 className="text-xl font-black text-gray-900">Feature Eligibility</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Escrow Transactions', eligible: eligibility.escrow_eligible },
              { label: 'Savings Instalments', eligible: eligibility.instalment_eligible },
              { label: 'Micro-Credit', eligible: eligibility.loan_eligible },
              { label: 'Insurance', eligible: eligibility.insurance_eligible },
            ].map((item, i) => (
              <div key={i} className={`p-4 rounded-2xl border flex items-center gap-3 ${item.eligible ? 'bg-[#F1F6F3] border-[#DCE8E0]' : 'bg-gray-50 border-gray-100'}`}>
                {item.eligible ? (
                  <ShieldCheck className="w-5 h-5 text-[#066B44] shrink-0" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-400 shrink-0" />
                )}
                <div>
                  <p className="text-sm font-bold text-gray-900">{item.label}</p>
                  <p className={`text-xs font-medium ${item.eligible ? 'text-[#066B44]' : 'text-gray-400'}`}>
                    {item.eligible ? 'Available' : 'Locked'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {eligibility.loan_eligibility_message && (
            <div className="bg-[#F9FBFA] rounded-2xl p-5 border border-[#F1F6F3] flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-[#066B44] shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 font-medium">{eligibility.loan_eligibility_message}</p>
            </div>
          )}

          {/* Loan conditions breakdown */}
          {eligibility.loan_conditions && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Micro-Credit Requirements</p>
              {Object.entries(eligibility.loan_conditions).map(([key, cond]: any) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cond.passed ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                    {cond.passed ? '✓ Met' : '✗ Not met'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}