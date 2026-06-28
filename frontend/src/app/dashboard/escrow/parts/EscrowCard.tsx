"use client";

import Image from 'next/image';
import Link from 'next/link';
import { EscrowItem } from '../model/useEscrows';

interface EscrowCardProps {
  escrow: EscrowItem;
}

export default function EscrowCard({ escrow }: EscrowCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Funded':
        return 'bg-[#EEF8F3] text-[#066B44]';
      case 'Awaiting Confirmation':
        return 'bg-[#FFF9E5] text-[#B78103]';
      case 'Disputed':
        return 'bg-[#FEECEB] text-[#E03137]';
      case 'Released':
        return 'bg-[#EBF5FF] text-[#006ADC]';
      case 'Completed':
        return 'bg-[#EEF8F3] text-[#066B44]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Employment':
        return 'bg-[#F0F2FF] text-[#4F63D6]';
      case 'Purchase':
        return 'bg-[#FFF0F6] text-[#D6336C]';
      case 'Instalment':
        return 'bg-[#F1F3F5] text-[#495057]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getActionButtonStyle = (label: string) => {
    if (label === 'View Dispute') {
      return 'bg-[#E03137] text-white hover:bg-[#C0262C]';
    }
    if (label === 'Confirm Delivery') {
      return 'bg-[#066B44] text-white hover:bg-[#055636]';
    }
    if (label === 'Rate Transaction' || label === 'Re-order') {
      return 'bg-[#F1F6F3] text-[#066B44] hover:bg-[#E2EBE5]';
    }
    return 'bg-[#066B44] text-white hover:bg-[#055636]';
  };

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#F1F6F3] flex flex-col gap-5 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      {/* Badges */}
      <div className="flex justify-between items-center">
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getCategoryColor(escrow.category)}`}>
          {escrow.category}
        </span>
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getStatusColor(escrow.status)}`}>
          {escrow.status}
        </span>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100">
          <Image
            src={escrow.userAvatar}
            alt={escrow.userName}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-[15px] font-bold text-gray-900">{escrow.userName}</h3>
          <p className="text-[11px] text-gray-500 font-medium">
            AjoScore: <span className={`font-bold ${escrow.ajoScore > 700 ? 'text-[#066B44]' : 'text-gray-700'}`}>{escrow.ajoScore} ({escrow.scoreTier})</span>
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1">
        <p className="text-[12px] text-gray-400 font-medium">{escrow.title}</p>
        <p className="text-[22px] font-black text-gray-900 tracking-tight">
          ₦ {escrow.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
        <span className="text-[11px] text-gray-400 font-medium italic">Created: {escrow.createdAt}</span>
        <Link href={`/dashboard/escrow/${escrow.id}`}>
          <button className={`text-[12px] font-bold px-4 py-2 rounded-xl transition-colors ${getActionButtonStyle(escrow.actionLabel)}`}>
            {escrow.actionLabel}
          </button>
        </Link>
      </div>
    </div>
  );
}
