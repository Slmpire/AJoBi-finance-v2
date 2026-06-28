"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";

interface RotationTimelineProps {
  nextDisbursement: string;
  timeline: {
    id: string;
    name: string;
    pos: string;
    completed: boolean;
    isNext: boolean;
    avatar: string;
  }[];
}

export default function RotationTracker({ nextDisbursement, timeline }: RotationTimelineProps) {
  return (
    <div className="bg-white rounded-[24px] border border-[#E8EFE8] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
        <h3 className="text-[15px] font-extrabold text-gray-900 uppercase tracking-wider opacity-90">Rotation Tracker</h3>
        <div className="text-left sm:text-right">
          <span className="text-[11px] font-bold text-gray-400 uppercase block">Next Disbursement</span>
          <span className="text-[14px] font-black text-[#066B44]">{nextDisbursement}</span>
        </div>
      </div>

      <div className="flex items-start justify-between overflow-x-auto pb-4 gap-6 scrollbar-none relative">
        {/* Drawing continuous line under the nodes */}
        <div className="absolute top-10 left-10 right-10 h-0.5 bg-[#F1F6F3] z-0 hidden sm:block" />

        {timeline.map((node, i) => (
          <div key={node.id} className="flex flex-col items-center text-center shrink-0 relative z-10 group">
            
            {/* Next up badge label */}
            {node.isNext && (
              <span className="absolute -top-6 text-[9px] font-black uppercase tracking-widest bg-[#066B44] text-white px-2 py-0.5 rounded-md shadow-sm animate-pulse whitespace-nowrap z-20">
                Next Payout
              </span>
            )}

            {/* Avatar ring box */}
            <div className={`w-16 h-16 rounded-full border-[3px] p-0.5 relative transition-all ${
              node.isNext 
                ? 'border-[#066B44] bg-white scale-110 shadow-lg' 
                : node.completed 
                  ? 'border-gray-300 bg-white opacity-80' 
                  : 'border-[#F1F6F3] bg-white opacity-60'
            }`}>
              <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-100 border border-white">
                <Image src={node.avatar} alt={node.name} fill className="object-cover" />
              </div>

              {/* Completed state check */}
              {node.completed && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center text-white">
                  <CheckCircle className="w-3 h-3 fill-current" />
                </div>
              )}
              {/* Active state indicator */}
              {node.isNext && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#066B44] border-2 border-white flex items-center justify-center text-white">
                  <CheckCircle className="w-3 h-3 fill-current" strokeWidth={3} />
                </div>
              )}
            </div>

            <p className={`text-[13px] font-extrabold mt-3 ${node.isNext ? 'text-[#066B44]' : 'text-gray-700'}`}>
              {node.name}
            </p>
            <p className="text-[11px] font-bold text-gray-400 bg-[#F9FCF9] border border-[#E8EFE8] px-2.5 py-0.5 rounded-full mt-1">
              {node.pos}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
