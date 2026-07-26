"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { ShieldCheck, Loader2, AlertCircle, ExternalLink, Lock, Eye, EyeOff } from "lucide-react";
import { escrowService } from "@/services/escrowService";
import { apiClient } from "@/services/apiClient";

export default function PublicPayPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const [escrow, setEscrow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PIN verification state
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [verifyingPin, setVerifyingPin] = useState(false);
  const [escrowDetail, setEscrowDetail] = useState<any>(null);

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

  const handleVerifyPin = async () => {
    if (!pin || pin.length !== 4) {
      setPinError('Please enter the 4-digit PIN');
      return;
    }
    setVerifyingPin(true);
    setPinError(null);
    try {
      const response = await apiClient.post(`/api/escrow/public/${code}/verify-pin`, { pin });
      const data = response.data;
      if (data.status) {
        setPinVerified(true);
        setEscrowDetail(data.data);
        // Mark payer as verified
        await apiClient.post(`/api/escrow/public/${code}/payer-verified`).catch(() => {});
      } else {
        setPinError(data.message || 'Invalid PIN');
      }
    } catch (err: any) {
      setPinError(err.response?.data?.message || 'Invalid PIN. Please check with the sender.');
    } finally {
      setVerifyingPin(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4FBF4] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#066B44] animate-spin" />
      </div>
    );
  }

  if (error || !escrow) {
    return (
      <div className="min-h-screen bg-[#F4FBF4] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-gray-900">Payment Not Found</h2>
          <p className="text-gray-500 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const isPaid = escrow.status !== 'awaiting_payment';

  return (
    <div className="min-h-screen bg-[#F4FBF4] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-sm space-y-6">

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
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Amount</p>
          <p className="text-4xl font-black text-[#066B44]">₦{parseFloat(escrow.amount).toLocaleString()}</p>
          <p className="text-sm text-gray-500 font-medium mt-1">{escrow.description}</p>
        </div>

        {/* Creator */}
        {escrow.creator_name && (
          <div className="flex items-center justify-between text-sm px-1">
            <span className="text-gray-400 font-medium">Requested by</span>
            <span className="font-bold text-gray-900">{escrow.creator_name}</span>
          </div>
        )}

        {/* Already paid */}
        {isPaid ? (
          <div className="bg-green-50 rounded-2xl p-5 text-center border border-green-100">
            <p className="text-sm font-bold text-green-700">✓ Payment already received for this escrow</p>
          </div>
        ) : !pinVerified ? (
          /* PIN ENTRY */
          <div className="space-y-4">
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-sm font-bold text-amber-800">PIN Required</p>
              </div>
              <p className="text-xs text-amber-700 font-medium">
                The person who sent this link will share a 4-digit PIN with you separately. Enter it below to proceed with payment.
              </p>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-2">Enter 4-Digit PIN</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={e => setPin(e.target.value.replace(/\D/g, '').substring(0, 4))}
                    onKeyDown={e => e.key === 'Enter' && handleVerifyPin()}
                    placeholder="••••"
                    maxLength={4}
                    className="w-full bg-[#F9FBFA] border border-[#E8EFE8] rounded-xl px-4 py-3.5 text-[18px] font-black text-center tracking-[0.5em] outline-none focus:border-[#066B44] transition-all"
                  />
                </div>
                <button
                  onClick={() => setShowPin(!showPin)}
                  className="px-4 bg-[#F9FBFA] border border-[#E8EFE8] rounded-xl text-gray-400"
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {pinError && (
                <p className="text-xs text-red-500 font-bold mt-2">{pinError}</p>
              )}
            </div>

            <button
              onClick={handleVerifyPin}
              disabled={verifyingPin || pin.length !== 4}
              className="w-full bg-[#066B44] hover:bg-[#055737] text-white py-4 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {verifyingPin ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
              {verifyingPin ? 'Verifying...' : 'Verify PIN & Proceed'}
            </button>
          </div>
        ) : (
          /* PAYMENT OPTIONS after PIN verified */
          <div className="space-y-4">
            <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
              <p className="text-sm font-bold text-green-700">PIN verified — you can now complete payment</p>
            </div>

            {escrowDetail?.checkout_link && (
  <a
    href={escrowDetail.checkout_link}
    target="_blank"
    rel="noopener noreferrer"
    className="w-full bg-[#066B44] hover:bg-[#055737] text-white py-4 rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all"
  >
    Pay Now <ExternalLink className="w-5 h-5" />
  </a>
)}

            <div className="bg-[#F9FBFA] rounded-xl p-5 border border-[#E8EFE8] space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">What happens next?</p>
              <ol className="text-xs text-gray-600 font-medium space-y-1.5 list-decimal list-inside">
                <li>Complete payment above</li>
                <li>The sender confirms they sent everything correctly</li>
                <li>You confirm you received goods/service</li>
                <li>Funds are automatically released to the sender</li>
              </ol>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-400 font-medium">Secured by AjoBI × Nomba</p>
        </div>
      </div>
    </div>
  );
}