"use client";

import { ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function TrustLevel() {
  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
  ];

  return (
    <div className="bg-[#066B44] text-white rounded-[24px] p-6 shadow-[0_20px_40px_rgba(6,107,68,0.12)] border border-[#055737] relative overflow-hidden">
      {/* Decorative backdrop bubble */}
      <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

      <div className="flex items-center gap-2.5 mb-4 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-[15px] font-black tracking-tight leading-none">
          Group Trust Level: Platinum
        </h3>
      </div>

      <p className="text-[12px] text-white/80 font-medium leading-relaxed mb-6 relative z-10">
        This group is currently insured by AjoShield against default. Maintain 100% on-time performance to retain Platinum status and lowest escrow rates.
      </p>

      <div className="flex items-center justify-between border-t border-white/10 pt-5 relative z-10">
        <div className="flex -space-x-2">
          {avatars.map((url, i) => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-[#066B44] overflow-hidden relative shadow-sm bg-white/20">
              <Image src={url} alt="trustee" fill className="object-cover" />
            </div>
          ))}
          <div className="w-6 h-6 rounded-full border-2 border-[#066B44] bg-[#055737] text-[9px] font-extrabold text-white flex items-center justify-center">
            +6
          </div>
        </div>
        <span className="text-[11px] font-black uppercase tracking-wider text-white/90">
          Trusted by All Members
        </span>
      </div>
    </div>
  );
}
