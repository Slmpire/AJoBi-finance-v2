"use client";

import { Users, ShieldCheck, ShoppingCart } from "lucide-react";
import Link from "next/link";

interface ActiveOverviewProps {
  groups: {
    id?: string;
    name: string;
    nextDate: string;
    status: string;
    amount: string;
  }[];
  escrows: {
    id?: string;
    title: string;
    status: string;
    amount: string;
  }[];
  instalments: {
    id?: string;
    item: string;
    progress: number;
    paid: string;
    total: string;
  }[];
}

export default function ActiveOverview({ groups, escrows, instalments }: ActiveOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

      {/* Active Ajo Groups */}
      <Link
        href={groups[0]?.id ? `/dashboard/groups/${groups[0].id}` : '/dashboard/groups'}
        className="bg-white p-6 rounded-[24px] border border-[#E8EFE8] shadow-sm hover:shadow-md hover:border-[#066B44]/30 transition-all duration-200 cursor-pointer block"
      >
        <div className="flex justify-between items-center mb-5">
          <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Active Ajo Groups</span>
          <Users className="w-5 h-5 text-[#066B44]" />
        </div>
        {groups.length ? (
          <>
            <h4 className="font-bold text-[16px] text-gray-900 leading-tight mb-1">{groups[0].name}</h4>
            <p className="text-[12px] text-gray-500 font-medium mb-5">Next: {groups[0].nextDate}</p>
            <div className="flex justify-between items-end">
              <span className="bg-[#F1F6F3] text-[#066B44] text-[11px] px-3 py-1 rounded-md font-bold border border-[#E8EFE8]">
                {groups[0].status}
              </span>
              <span className="font-extrabold text-[15px] text-gray-900">{groups[0].amount}</span>
            </div>
          </>
        ) : (
          <div className="py-4 text-[13px] text-gray-500">No active groups found</div>
        )}
      </Link>

      {/* Active Escrows */}
      <div className="bg-white p-6 rounded-[24px] border border-[#E8EFE8] shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-center mb-5">
          <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Active Escrows</span>
          <ShieldCheck className="w-5 h-5 text-[#066B44]" />
        </div>
        {escrows.length ? (
          <>
            <h4 className="font-bold text-[16px] text-gray-900 leading-tight mb-1">{escrows[0].title}</h4>
            <p className="text-[12px] text-gray-500 font-medium mb-5">Status: {escrows[0].status}</p>
            <div className="flex justify-between items-end">
              <span className="font-extrabold text-[16px] text-[#066B44]">{escrows[0].amount}</span>
              <Link
                href={escrows[0]?.id ? `/dashboard/escrow/${escrows[0].id}` : '/dashboard/escrow'}
                className="text-[12px] font-extrabold text-[#066B44] hover:underline transition-all"
              >
                View Details
              </Link>
            </div>
          </>
        ) : (
          <div className="py-4 text-[13px] text-gray-500">No active escrows found</div>
        )}
      </div>

      {/* Active Instalments */}
      <div className="bg-white p-6 rounded-[24px] border border-[#E8EFE8] shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-5">
            <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Active Instalments</span>
            <ShoppingCart className="w-5 h-5 text-[#066B44]" />
          </div>
          {instalments.length ? (
            <>
              <h4 className="font-bold text-[16px] text-gray-900 leading-tight mb-1">{instalments[0].item}</h4>
              <p className="text-[12px] text-gray-500 font-medium mb-5">{instalments[0].progress}% Complete</p>
            </>
          ) : (
            <div className="py-4 text-[13px] text-gray-500">No active instalments</div>
          )}
        </div>

        {instalments.length > 0 && (
          <div className="mt-1">
            <div className="w-full h-2 bg-[#F1F6F3] rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-[#066B44] rounded-full transition-all duration-500"
                style={{ width: `${instalments[0].progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[12px] font-bold mt-2">
              <span className="text-gray-900">{instalments[0].paid}</span>
              <span className="text-gray-400 font-medium">/ {instalments[0].total}</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}