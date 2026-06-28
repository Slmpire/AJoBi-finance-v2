"use client";

import { UserPlus, ShieldCheck, CreditCard } from "lucide-react";
import Link from "next/link";

export default function QuickActions() {
  const actions = [
    { label: "Join an Ajo Group", icon: UserPlus, href: "/dashboard/groups", color: "bg-[#F1F6F3] text-[#066B44]" },
    { label: "Create an Escrow", icon: ShieldCheck, href: "/dashboard/escrow", color: "bg-[#F1F6F3] text-[#066B44]" },
    { label: "Loan Eligibility", icon: CreditCard, href: "#", color: "bg-[#F1F6F3] text-[#066B44]" },
  ];

  return (
    <div>
      <h3 className="font-bold text-gray-900 text-[16px] mb-4 uppercase tracking-wider opacity-80">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <Link 
              key={i} 
              href={action.href}
              className="bg-white p-6 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.01)] border border-[#E8EFE8] flex flex-col items-center justify-center gap-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:border-[#066B44]/30 hover:-translate-y-0.5 transition-all group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[13px] font-bold text-gray-800">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
