"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { ShieldCheck, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { escrowService } from "@/services/escrowService";

export default function PublicPayPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const [escrow, setEscrow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (code) {
      escrowService.getPublicEscrow(code)
        .then(res => {
          if (res.status && res.data) {
            setEscrow(res.data);
          } else {
            setError('Payment link not found or has expired.');
          }
        })
        .catch(() => setError('Failed to load payment details.'))
        .finally(() => setLoading(false));
    }
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4FBF4] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-[#066B44] animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error || !escrow) {
    return (
      <div className="min-h-screen bg-[#F4FBF4] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-gray-900">Payment Not Found</h2>
          <p className="text-gray-500 font-medium">{error || 'This payment link is invalid or has expired.'}</p>
          <a href="https://ajobi-frontend.vercel.app" className="inline-block bg-[#066B44] text-white px-6 py-3 rounded-xl font-bold text-sm">
            Go to AjoBI
          </a>
        </div>
      </div>
    );
  }

  const isPaid = escrow.status !== 'awaiting_payment';

  return (
    <div className="min-h-screen bg-[#F4FBF4] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-sm space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-[#F1F6F3] rounded-2xl flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-[#066B44]" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Secure Payment</h1>
          <p className="text-sm text-gray-500 font-medium">Protected by AjoBI Escrow</p>
        </div>

        {/* Amount */}
        <div className="bg-[#F1F6F3] rounded-2xl p-6 text-center">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Amount to Pay</p>
          <p className="text-4xl font-black text-[#066B44]">
            ₦{parseFloat(escrow.amount).toLocaleString()}
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Description</p>
          <p className="text-gray-900 font-medium bg-[#F9FBFA] rounded-xl p-4 border border-[#F1F6F3]">
            {escrow.description}
          </p>
        </div>

        {/* Creator */}
        {escrow.creator_name && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 font-medium">Requested by</span>
            <span className="font-bold text-gray-900">{escrow.creator_name}</span>
          </div>
        )}

        {/* Status */}
        <div className={`rounded-2xl p-4 text-center ${isPaid ? 'bg-green-50 border border-green-100' : 'bg-amber-50 border border-amber-100'}`}>
          <p className={`text-sm font-bold ${isPaid ? 'text-green-700' : 'text-amber-700'}`}>
            {isPaid ? '✓ Payment already received' : 'Awaiting payment'}
          </p>
        </div>

        {/* Pay button */}
        {!isPaid && escrow.nomba_checkout_link && (
          <a href={escrow.nomba_checkout_link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#066B44] hover:bg-[#055737] text-white py-4 rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all"
          >
            Pay Now <ExternalLink className="w-5 h-5" />
          </a>
        )}

        {/* Footer */}
        <div className="text-center space-y-1">
          <p className="text-xs text-gray-400 font-medium">Secured by AjoBI × Nomba</p>
          <p className="text-xs text-gray-400">You do not need an AjoBI account to make this payment.</p>
        </div>
      </div>
    </div>
  );
}