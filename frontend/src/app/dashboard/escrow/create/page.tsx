"use client";

import { useState } from "react";
import { ArrowLeft, ShieldCheck, Copy, MessageCircle, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCreateEscrow } from "../model/useCreateEscrow";
import { useRouter } from "next/navigation";

export default function CreateEscrowPage() {
  const router = useRouter();
  const { formData, updateField, isLoading, error, handleSubmit, created, reset } = useCreateEscrow();
  const [showPin, setShowPin] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const copyPin = () => {
    navigator.clipboard.writeText(created?.pin || '');
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(created?.payment_link || '');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareWhatsApp = () => {
    const msg = `${created?.share_message}\n\n🔐 PIN: ${created?.pin} (share this separately and securely)`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // SUCCESS STATE — show PIN and share options
  if (created) {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Escrow Created!</h1>
          <p className="text-gray-500 font-medium">Share the link and PIN separately for security.</p>
        </div>

        {/* Amount */}
        <div className="bg-[#F1F6F3] rounded-2xl p-6 text-center">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Escrow Amount</p>
          <p className="text-4xl font-black text-[#066B44]">₦{parseFloat(created.escrow?.amount || 0).toLocaleString()}</p>
          <p className="text-sm text-gray-500 font-medium mt-1">{created.escrow?.description}</p>
        </div>

        {/* Payment Link */}
        <div className="bg-white rounded-2xl border border-[#E8EFE8] p-6 space-y-4">
          <h3 className="font-bold text-gray-900">1. Share Payment Link</h3>
          <p className="text-sm text-gray-500">Send this link to the person paying. They'll need the PIN separately.</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-[#F9FBFA] rounded-xl px-4 py-3 text-sm font-medium text-gray-600 truncate border border-[#E8EFE8]">
              {created.payment_link}
            </div>
            <button onClick={copyLink} className="bg-[#066B44] text-white px-4 py-3 rounded-xl font-bold text-sm shrink-0">
              {copiedLink ? '✓' : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={shareWhatsApp}
            className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> Share on WhatsApp
          </button>
        </div>

        {/* PIN — shown separately */}
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 space-y-4">
          <h3 className="font-bold text-amber-900">2. Share PIN Separately 🔐</h3>
          <p className="text-sm text-amber-700 font-medium">
            The payer needs this PIN to verify payment. Share it via a <strong>different channel</strong> (call, text, in person) — never in the same message as the link.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white rounded-xl px-6 py-4 text-center border border-amber-200">
              <p className="text-3xl font-black tracking-[0.5em] text-gray-900">
                {showPin ? created.pin : '••••'}
              </p>
            </div>
            <button onClick={() => setShowPin(!showPin)} className="p-3 bg-white rounded-xl border border-amber-200">
              {showPin ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
            </button>
            <button onClick={copyPin} className="p-3 bg-amber-600 rounded-xl text-white">
              {copiedPin ? '✓' : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-amber-600 font-medium text-center">
            ⚠️ Once you leave this page, the PIN cannot be recovered. Save it now.
          </p>
        </div>

        {/* Virtual Account */}
        {created.virtual_account && (
          <div className="bg-white rounded-2xl border border-[#E8EFE8] p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Alternative: Bank Transfer</h3>
            <p className="text-sm text-gray-500">Payer can also transfer directly to this account:</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F9FBFA] rounded-xl p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Bank</p>
                <p className="text-sm font-bold text-gray-900">{created.virtual_account.bank_name}</p>
              </div>
              <div className="bg-[#F9FBFA] rounded-xl p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Account Number</p>
                <p className="text-sm font-bold text-gray-900">{created.virtual_account.account_number}</p>
              </div>
              <div className="bg-[#F9FBFA] rounded-xl p-4 col-span-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Account Name</p>
                <p className="text-sm font-bold text-gray-900">{created.virtual_account.account_name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Set Receiver Password */}
        <div className="bg-white rounded-2xl border border-[#E8EFE8] p-6 space-y-4">
          <h3 className="font-bold text-gray-900">3. Optional: Set Delivery Password</h3>
          <p className="text-sm text-gray-500">
            Set a password that <strong>you</strong> share with the payer only after confirming you've received the goods/service. This prevents premature fund release.
          </p>
          <Link
            href={`/dashboard/escrow/${created.escrow?.id}`}
            className="w-full border border-[#066B44] text-[#066B44] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#F1F6F3] transition-all"
          >
            <ShieldCheck className="w-4 h-4" /> Set Delivery Password in Escrow Details
          </Link>
        </div>

        {/* Done */}
        <button
          onClick={() => router.push('/dashboard/escrow')}
          className="w-full bg-[#066B44] text-white py-4 rounded-2xl font-bold text-[15px]"
        >
          Done — View My Escrows
        </button>
      </div>
    );
  }

  // CREATION FORM
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <Link href="/dashboard/escrow" className="inline-flex items-center gap-2 text-[13px] font-bold text-gray-400 hover:text-[#066B44]">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-[32px] font-black text-gray-900">Create Escrow</h1>
        <p className="text-gray-500 font-medium">Secure payment — funds only release when both parties confirm.</p>
      </div>

      <div className="bg-white rounded-[32px] border border-[#F1F6F3] p-8 space-y-6 shadow-sm">

        <div>
          <label className="block text-[12px] font-bold text-gray-700 mb-2 uppercase tracking-wider">Amount (₦)</label>
          <input
            type="number"
            value={formData.amount || ''}
            onChange={e => updateField('amount', parseFloat(e.target.value) || 0)}
            placeholder="e.g. 25000"
            className="w-full bg-[#F9FBFA] border border-[#E8EFE8] rounded-xl px-4 py-3.5 text-[15px] font-bold outline-none focus:border-[#066B44] transition-all"
          />
        </div>

        <div>
          <label className="block text-[12px] font-bold text-gray-700 mb-2 uppercase tracking-wider">Description</label>
          <textarea
            value={formData.description}
            onChange={e => updateField('description', e.target.value)}
            placeholder="What is this payment for? e.g. Payment for logo design work"
            rows={3}
            className="w-full bg-[#F9FBFA] border border-[#E8EFE8] rounded-xl px-4 py-3.5 text-[14px] font-medium outline-none focus:border-[#066B44] transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-[12px] font-bold text-gray-700 mb-2 uppercase tracking-wider">Recipient Email (Optional)</label>
          <input
            type="email"
            value={formData.recipient_email}
            onChange={e => updateField('recipient_email', e.target.value)}
            placeholder="If they have an AjoBI account"
            className="w-full bg-[#F9FBFA] border border-[#E8EFE8] rounded-xl px-4 py-3.5 text-[14px] font-medium outline-none focus:border-[#066B44] transition-all"
          />
          <p className="text-xs text-gray-400 mt-1 font-medium">Leave empty if the recipient doesn't have an AjoBI account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl font-medium text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="bg-[#F9FBFA] rounded-xl p-4 border border-[#E8EFE8]">
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            🔐 After creation you'll receive a <strong>payment link</strong> and a <strong>4-digit PIN</strong>. Share the link publicly but the PIN only via a separate, private channel. The payer must enter the PIN to verify payment.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || !formData.amount || !formData.description}
          className="w-full bg-[#066B44] hover:bg-[#055737] text-white py-4 rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
          {isLoading ? 'Creating...' : 'Create Secure Escrow'}
        </button>
      </div>
    </div>
  );
}