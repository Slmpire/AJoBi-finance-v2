"use client";

import { use } from "react";
import { ArrowLeft, ShieldCheck, Calendar, CreditCard, Building, Info, Loader2, FileText } from 'lucide-react';
import Link from 'next/link';
import { useEscrowDetail } from './model/useEscrowDetail';

export default function EscrowDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { 
    escrow, 
    isLoading, 
    error, 
    isCreatingVA, 
    handleCreateVirtualAccount 
  } = useEscrowDetail(id);

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#066B44] animate-spin mb-4" />
        <p className="text-gray-500 font-bold">Loading escrow details...</p>
      </div>
    );
  }

  if (error || !escrow) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-3xl font-bold border border-red-100">
          {error || "Escrow not found"}
        </div>
        <Link href="/dashboard/escrow" className="inline-flex items-center gap-2 text-[#066B44] font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to My Escrows
        </Link>
      </div>
    );
  }

  const paymentLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://ajobi-frontend.vercel.app'}/pay/${escrow.paymentReference}`;

  const shareMessage = `You have been requested to pay ₦${escrow.amount.toLocaleString()} for "${escrow.description}". Pay securely here: ${paymentLink}`;

  const handleConfirm = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/escrow/${escrow.id}/confirm`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      if (data.status) {
        alert(data.message);
        window.location.reload();
      } else {
        alert(data.message || 'Confirmation failed');
      }
    } catch (e) {
      alert('An error occurred. Please try again.');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(paymentLink);
    alert('Payment link copied!');
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  return (
    <div className="mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link href="/dashboard/escrow" className="inline-flex items-center gap-2 text-[13px] font-bold text-gray-400 hover:text-[#066B44] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to My Escrows
          </Link>
          <div className="space-y-1">
            <h1 className="text-[32px] font-bold text-gray-900 tracking-tight">Escrow Details</h1>
            <p className="text-[15px] text-gray-500 font-medium">Ref: {escrow.paymentReference}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {escrow.disputeRaised && (
            <span className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-[12px] font-bold uppercase tracking-widest border border-red-100 animate-pulse">
              Dispute Raised
            </span>
          )}
          <span className={`px-4 py-2 rounded-xl text-[12px] font-bold uppercase tracking-widest ${
            escrow.status === 'Funded' ? 'bg-[#EEF8F3] text-[#066B44]' :
            escrow.status === 'Completed' ? 'bg-blue-50 text-blue-600' :
            'bg-[#FFF9E5] text-[#B78103]'
          }`}>
            {escrow.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Summary Card */}
          <div className="bg-white rounded-[32px] p-8 border border-[#F1F6F3] shadow-sm space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
              <div className="w-12 h-12 bg-[#EEF8F3] rounded-2xl flex items-center justify-center text-[#066B44]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">Protected Transaction</h2>
                <p className="text-sm text-gray-500 font-medium">{escrow.type} • Created on {escrow.createdAt}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Amount</p>
                <p className="text-2xl font-black text-[#066B44]">₦{escrow.amount.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" /> Description
              </h3>
              <p className="text-[15px] text-gray-600 leading-relaxed bg-[#F9FBFA] p-5 rounded-2xl border border-[#F1F6F3]">
                {escrow.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#F1F6F3] rounded-2xl space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Created</p>
                <p className="text-[14px] font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#066B44]" /> {escrow.createdAt}
                </p>
              </div>
              <div className="p-4 bg-[#F1F6F3] rounded-2xl space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trust Verdict</p>
                <p className="text-[14px] font-bold text-[#066B44] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> {escrow.trustVerdict}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          {escrow.status !== 'Completed' && (
            <div className="bg-[#066B44] rounded-[32px] p-8 text-white space-y-6 shadow-xl shadow-[#066B44]/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Escrow Payment</h2>
                  <p className="text-sm text-white/70 font-medium">
                    {escrow.status === 'Funded'
                      ? 'Payment received. Waiting for both parties to confirm.'
                      : 'Share this link with the payer. They do not need an AjoBI account.'}
                  </p>
                </div>
              </div>

              {escrow.status === 'Funded' ? (
                <div className="bg-white/10 rounded-2xl p-6 border border-white/10 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-70">Payment Received</p>
                  <p className="text-white/80 text-sm font-medium">
                    ₦{escrow.amount.toLocaleString()} has been received and is held securely.
                    Both parties must confirm before funds are released.
                  </p>
                  <button
                    onClick={handleConfirm}
                    className="w-full bg-white text-[#066B44] py-4 rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-[0.98]"
                  >
                    Confirm & Release Funds
                  </button>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">You</p>
                      <p className={`text-sm font-bold mt-1 ${escrow.confirmationStatus.creatorConfirmed ? 'text-green-300' : 'text-white/60'}`}>
                        {escrow.confirmationStatus.creatorConfirmed ? '✓ Confirmed' : 'Pending'}
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Other Party</p>
                      <p className={`text-sm font-bold mt-1 ${escrow.confirmationStatus.counterpartyConfirmed ? 'text-green-300' : 'text-white/60'}`}>
                        {escrow.confirmationStatus.counterpartyConfirmed ? '✓ Confirmed' : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : escrow.virtualAccount ? (
                <div className="bg-white/10 rounded-2xl p-6 border border-white/10 backdrop-blur-md space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-70">Pay via Bank Transfer</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Bank Name</p>
                      <p className="text-lg font-bold">{escrow.virtualAccount.bankName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Account Number</p>
                      <p className="text-lg font-bold">{escrow.virtualAccount.accountNumber}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Account Name</p>
                    <p className="text-sm font-bold">{escrow.virtualAccount.accountName}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                <div className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-4">
  <p className="text-xs font-bold uppercase tracking-widest opacity-70">Payment Link</p>
  <div className="bg-white/10 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
    <div className="flex items-center gap-2 min-w-0">
      <ShieldCheck className="w-4 h-4 text-green-300 shrink-0" />
      <span className="text-white font-bold text-sm truncate">
        Secure AjoBI Payment Link
      </span>
    </div>
    <span className="text-white/50 text-xs font-bold shrink-0">
      ₦{escrow.amount.toLocaleString()}
    </span>
  </div>
  <div className="flex gap-3">
    <button
      onClick={handleCopyLink}
      className="flex-1 bg-white text-[#066B44] py-3 rounded-xl font-bold text-[13px] hover:bg-gray-50 transition-all active:scale-[0.98]"
    >
      📋 Copy Link
    </button>
    <button
      onClick={handleWhatsApp}
      className="flex-1 bg-[#25D366] text-white py-3 rounded-xl font-bold text-[13px] hover:bg-[#20b858] transition-all active:scale-[0.98]"
    >
      WhatsApp
    </button>
  </div>
  <p className="text-white/40 text-[11px] text-center font-medium">
    Payer does not need an AjoBI account
  </p>
</div>

                  <div className="relative flex items-center gap-4 py-1">
                    <div className="flex-1 h-px bg-white/20" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">OR</span>
                    <div className="flex-1 h-px bg-white/20" />
                  </div>

                  <button
                    onClick={handleCreateVirtualAccount}
                    disabled={isCreatingVA}
                    className="w-full bg-white/10 border border-white/20 text-white py-4 rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 hover:bg-white/20 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isCreatingVA ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Building className="w-5 h-5" />
                        Generate Virtual Account Instead
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Counterparty Card */}
          <div className="bg-white rounded-[32px] p-6 border border-[#F1F6F3] shadow-sm space-y-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Counterparty</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#066B44] font-bold text-xl border-2 border-[#EEF8F3]">
                {escrow.counterparty.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-gray-900">{escrow.counterparty.name}</h3>
                <p className="text-xs text-gray-400 font-medium">ID: {escrow.counterparty.id}</p>
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">AjoScore</span>
                <span className="text-sm font-black text-[#066B44]">{escrow.counterparty.ajoScore}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tier</span>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  {escrow.counterparty.scoreTier}
                </span>
              </div>
            </div>
          </div>

          {/* Trust Insight Widget */}
          <div className="bg-[#F9FBFA] rounded-[32px] p-6 border border-[#F1F6F3] space-y-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
              <Info className="w-4 h-4 text-[#066B44]" /> AI Trust Insight
            </div>
            <p className="text-[13px] text-gray-500 font-medium leading-relaxed italic">
              "{escrow.trustReason}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}