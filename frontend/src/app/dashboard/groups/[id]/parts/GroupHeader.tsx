"use client";

import { useState } from "react";
import { Users, ArrowLeft, Building, Ticket } from "lucide-react";
import Link from "next/link";

interface GroupHeaderProps {
  name: string;
  status: string;
  contribution: string;
  rotation: string;
  currentCycle: number;
  totalCycles: number;
  isJoining: boolean;
  isMember: boolean;
  inviteCode?: string;
  onJoin: (code?: string) => void;
  onPayment: () => void;
  isPaying: boolean;
  virtualAccount?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  } | null;
}

export default function GroupHeader({
  name,
  status,
  contribution,
  rotation,
  currentCycle,
  totalCycles,
  onJoin,
  isJoining,
  isMember,
  virtualAccount,
  onPayment,
  isPaying,
  inviteCode,
}: GroupHeaderProps) {
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [copied, setCopied] = useState(false);
  const progress = (currentCycle / totalCycles) * 100;

  const handleShare = () => {
    const link = `${window.location.origin}/join/${inviteCode || ''}`;
    const message = `Join my AjoBI savings group "${name}"! Contribute ${contribution} on a ${rotation} basis. Use invite code: ${inviteCode || 'N/A'} or click: ${link}`;
    if (navigator.share) {
      navigator.share({ title: `Join ${name}`, text: message, url: link });
    } else {
      navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <Link href="/dashboard/groups" className="inline-flex items-center gap-2 text-[13px] font-extrabold text-gray-400 hover:text-[#066B44] transition-colors mb-2 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} /> Back to Groups
      </Link>

      <div className="bg-white rounded-[24px] border border-[#E8EFE8] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
          
          <div className="flex items-center gap-4 flex-1">
            <div className="w-16 h-16 rounded-[20px] bg-[#F1F6F3] border border-[#DCE8E0] text-[#066B44] flex items-center justify-center shrink-0 shadow-inner">
              <Users className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                <h1 className="text-[22px] sm:text-[24px] font-black text-gray-900 tracking-tight leading-none">{name}</h1>
                <span className="px-3 py-0.5 bg-[#F1F6F3] border border-[#066B44]/10 text-[#066B44] text-[11px] font-extrabold uppercase tracking-widest rounded-full">
                  {status}
                </span>
              </div>
              <p className="text-[13px] font-bold text-gray-500 flex items-center gap-1.5">
                {contribution} <span className="text-gray-300">•</span> {rotation}
              </p>
              {inviteCode && (
                <p className="text-[11px] font-bold text-gray-400 mt-1">
                  Invite code: <span className="text-[#066B44] font-black">{inviteCode}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {!isMember ? (
              <div className="flex items-center gap-2">
                <div className="relative group">
                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#066B44] transition-colors" />
                  <input
                    type="text"
                    placeholder="Invite Code (Optional)"
                    value={inviteCodeInput}
                    onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                    className="pl-9 pr-4 py-2.5 rounded-xl border border-[#E8EFE8] text-[13px] font-bold outline-none focus:border-[#066B44] bg-[#FAFCFB] transition-all w-[180px]"
                  />
                </div>
                <button
                  onClick={() => onJoin(inviteCodeInput)}
                  disabled={isJoining}
                  className="px-6 py-2.5 rounded-xl bg-[#066B44] hover:bg-[#055737] text-white text-[13px] font-extrabold shadow-md shadow-[#066B44]/10 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                  {isJoining ? "Joining..." : "Join group"}
                </button>
              </div>
            ) : (
              <button
                onClick={handleShare}
                className="px-5 py-2.5 rounded-xl bg-white border border-[#E8EFE8] text-[13px] font-bold text-gray-700 hover:bg-[#F9FCF9] transition-colors"
              >
                {copied ? "✓ Copied!" : "Share Group"}
              </button>
            )}

            {isMember && (
              <button
                onClick={onPayment}
                disabled={isPaying}
                className="px-5 py-2.5 rounded-xl text-[13px] font-extrabold shadow-md transition-all bg-[#066B44] hover:bg-[#055737] text-white shadow-[#066B44]/10 disabled:opacity-70"
              >
                {isPaying ? "Processing..." : "Make Payment"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[#F1F6F3]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
            <div className="w-full h-3 bg-[#F1F6F3] rounded-full shadow-inner overflow-hidden relative flex-1">
              <div
                className="absolute left-0 top-0 h-full bg-[#066B44] rounded-full transition-all duration-500"
                style={{ width: `${Math.max(progress, 5)}%` }}
              />
            </div>
            <span className="text-[12px] font-extrabold text-gray-700 whitespace-nowrap tracking-wider uppercase opacity-80">
              Cycle {currentCycle} of {totalCycles}
            </span>
          </div>
        </div>

        {isMember && virtualAccount && (
          <div className="mt-6 pt-6 border-t border-[#F1F6F3]">
            <div className="bg-[#F8FBF8] rounded-2xl p-4 border border-[#E8EFE8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#DCE8E0] text-[#066B44] flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Group Payment Account</p>
                  <p className="text-[14px] font-black text-gray-900">{virtualAccount.bankName} • {virtualAccount.accountNumber}</p>
                </div>
              </div>
              <div className="flex flex-col sm:items-end">
                <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Account Name</p>
                <p className="text-[14px] font-bold text-[#066B44]">{virtualAccount.accountName}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}