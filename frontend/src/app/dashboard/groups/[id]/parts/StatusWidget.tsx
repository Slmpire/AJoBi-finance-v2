"use client";

import { CheckCircle, CreditCard, Settings2 } from "lucide-react";

interface StatusWidgetProps {
  paymentStatus: string;
  paymentMethod: string;
  methodActive: boolean;
  methodDetails: string;
}

export default function StatusWidget({
  paymentStatus,
  paymentMethod,
  methodActive,
  methodDetails
}: StatusWidgetProps) {
  return (
    <div className="bg-white rounded-[24px] border border-[#E8EFE8] p-6 shadow-sm">
      <h3 className="text-[12px] font-extrabold text-gray-400 uppercase tracking-widest mb-5">Your Status</h3>
      
      <div className="space-y-5">
        <div>
          <p className="text-[11px] font-bold text-gray-500 uppercase">Current Cycle Payment</p>
          <div className="flex items-center gap-2 text-[22px] font-black text-[#066B44] tracking-tight mt-1">
            <CheckCircle className="w-6 h-6 fill-[#066B44] text-white" strokeWidth={2.5} />
            {paymentStatus}
          </div>
        </div>

        {/* Card Wrapper */}
        <div className="bg-[#F4FCF7] rounded-2xl border border-[#E8EFE8] p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[13px] font-black text-gray-800 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#066B44]" /> {paymentMethod}
            </h4>
            {methodActive && (
              <span className="px-2 py-0.5 bg-[#066B44] text-white text-[9px] font-black uppercase rounded tracking-wider">
                Active
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
            {methodDetails}
          </p>
        </div>

        {/* Buttons Row */}
        <div className="space-y-2.5 pt-2">
          <button className="w-full bg-[#F1F6F3] hover:bg-[#066B44]/10 text-[#066B44] text-[13px] font-extrabold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 border border-[#066B44]/10">
            <CreditCard className="w-4 h-4" /> Manual Pay
          </button>
          <button className="w-full bg-white border border-[#E8EFE8] text-gray-700 hover:bg-gray-50 text-[13px] font-extrabold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
            <Settings2 className="w-4 h-4 text-gray-500" /> Change Payment Method
          </button>
        </div>
      </div>
    </div>
  );
}
