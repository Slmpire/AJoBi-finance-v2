"use client";

import { CheckCircle, CreditCard, Settings2, Clock } from "lucide-react";

interface StatusWidgetProps {
  paymentStatus: string;
  paymentMethod: string;
  methodActive: boolean;
  methodDetails: string;
  onPayment?: () => void;
  isPaying?: boolean;
}

export default function StatusWidget({
  paymentStatus,
  paymentMethod,
  methodActive,
  methodDetails,
  onPayment,
  isPaying,
}: StatusWidgetProps) {
  const isPaid = paymentStatus === 'Paid';

  return (
    <div className="bg-white rounded-[24px] border border-[#E8EFE8] p-6 shadow-sm">
      <h3 className="text-[12px] font-extrabold text-gray-400 uppercase tracking-widest mb-5">Your Status</h3>

      <div className="space-y-5">
        <div>
          <p className="text-[11px] font-bold text-gray-500 uppercase">Current Cycle Payment</p>
          <div className={`flex items-center gap-2 text-[22px] font-black tracking-tight mt-1 ${isPaid ? 'text-[#066B44]' : 'text-amber-500'}`}>
            {isPaid
              ? <CheckCircle className="w-6 h-6 fill-[#066B44] text-white" strokeWidth={2.5} />
              : <Clock className="w-6 h-6" strokeWidth={2.5} />
            }
            {paymentStatus}
          </div>
        </div>

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
          <p className="text-[11px] text-gray-600 font-medium leading-relaxed">{methodDetails}</p>
        </div>

        {!isPaid && (
          <div className="space-y-2.5 pt-2">
            <button
              onClick={onPayment}
              disabled={isPaying}
              className="w-full bg-[#066B44] hover:bg-[#055737] text-white text-[13px] font-extrabold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <CreditCard className="w-4 h-4" />
              {isPaying ? 'Processing...' : 'Pay Now'}
            </button>
            <button
              onClick={() => alert('Contact your group admin to arrange alternative payment.')}
              className="w-full bg-white border border-[#E8EFE8] text-gray-700 hover:bg-gray-50 text-[13px] font-extrabold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Settings2 className="w-4 h-4 text-gray-500" /> Contact Admin
            </button>
          </div>
        )}

        {isPaid && (
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-sm font-bold text-green-700">✓ Payment confirmed for this cycle</p>
          </div>
        )}
      </div>
    </div>
  );
}