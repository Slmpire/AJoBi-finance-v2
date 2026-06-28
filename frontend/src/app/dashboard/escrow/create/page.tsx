"use client";

import { ArrowLeft, ShieldCheck, User, CreditCard, Calendar, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCreateEscrow } from '../model/useCreateEscrow';

export default function CreateEscrowPage() {
  const { formData, updateField, isLoading, error, handleSubmit } = useCreateEscrow();

  return (
    <div className="mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/dashboard/escrow" className="inline-flex items-center gap-2 text-[13px] font-bold text-gray-400 hover:text-[#066B44] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to My Escrows
        </Link>
        <div className="space-y-1">
          <h1 className="text-[32px] font-bold text-gray-900 tracking-tight">Create New Escrow</h1>
          <p className="text-[15px] text-gray-500 font-medium">Secure your transaction with AjoBI's trusted escrow system.</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-[32px] p-8 border border-[#F1F6F3] shadow-sm space-y-8">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
          <div className="w-12 h-12 bg-[#EEF8F3] rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-[#066B44]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
            <p className="text-sm text-gray-500 font-medium">Provide the necessary information to protect both parties.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-2xl text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Type */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase">Transaction Type</label>
            <select
              className="w-full px-4 py-3.5 bg-[#F1F6F3] rounded-2xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#066B44]/10 transition-all border-none"
              value={formData.type}
              onChange={(e) => updateField('type', e.target.value)}
            >
              <option value="Purchase">Product Purchase</option>
              <option value="Service">Professional Service</option>
              <option value="Employment">Employment/Freelance</option>
              <option value="Instalment">Instalment Payment</option>
            </select>
          </div>

          {/* Counterparty */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase">Counterparty ID / Phone</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-11 pr-4 py-3.5 bg-[#F1F6F3] rounded-2xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#066B44]/10 transition-all"
                placeholder="e.g. USR-123456"
                value={formData.counterparty_id}
                onChange={(e) => updateField('counterparty_id', e.target.value)}
              />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase">Transaction Amount (₦)</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                className="w-full pl-11 pr-4 py-3.5 bg-[#F1F6F3] rounded-2xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#066B44]/10 transition-all"
                placeholder="0.00"
                value={formData.amount || ''}
                onChange={(e) => updateField('amount', parseFloat(e.target.value))}
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase">Expected Completion</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                className="w-full pl-11 pr-4 py-3.5 bg-[#F1F6F3] rounded-2xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#066B44]/10 transition-all"
                value={formData.expected_completion_date}
                onChange={(e) => updateField('expected_completion_date', e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase">Description of Services/Goods</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
              <textarea
                className="w-full pl-11 pr-4 py-3.5 bg-[#F1F6F3] rounded-2xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#066B44]/10 transition-all min-h-[120px] resize-none"
                placeholder="Describe exactly what is being exchanged..."
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-[#066B44] text-white py-4 rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(6,107,68,0.15)] transition-all hover:bg-[#055636] active:scale-[0.98] disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Create Protected Escrow
            </>
          )}
        </button>
      </div>
    </div>
  );
}
