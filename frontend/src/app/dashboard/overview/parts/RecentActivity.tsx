"use client";

import { Banknote, TrendingUp, Eye, CheckCircle2 } from "lucide-react";

interface RecentActivityProps {
  activities: {
    id: string;
    type: 'payment' | 'score' | 'view' | 'other';
    title: string;
    subtitle: string;
    timeAgo: string;
  }[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return {
          icon: Banknote,
          color: 'text-[#066B44] bg-[#F1F6F3]'
        };
      case 'score':
        return {
          icon: TrendingUp,
          color: 'text-[#066B44] bg-[#F1F6F3]'
        };
      case 'view':
        return {
          icon: Eye,
          color: 'text-gray-500 bg-gray-100'
        };
      default:
        return {
          icon: CheckCircle2,
          color: 'text-blue-600 bg-blue-50'
        };
    }
  };

  return (
    <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#E8EFE8] p-6 sm:p-8">
      <h3 className="font-bold text-gray-900 text-[16px] uppercase tracking-wider opacity-80 mb-6">
        Recent Activity
      </h3>
      <div className="space-y-5">
        {activities.map((act, idx) => {
          const { icon: Icon, color } = getIcon(act.type);
          return (
            <div key={act.id}>
              <div className="flex items-start justify-between group">
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-gray-900 leading-snug">
                      {act.title}
                    </p>
                    <p className="text-[12px] text-gray-500 font-medium mt-0.5">
                      {act.subtitle}
                    </p>
                  </div>
                </div>
                <span className="text-[12px] font-medium text-gray-400 shrink-0 pl-2">
                  {act.timeAgo}
                </span>
              </div>
              {idx !== activities.length - 1 && (
                <div className="w-full h-px bg-[#F1F6F3] mt-5" />
              )}
            </div>
          );
        })}

        {!activities.length && (
          <div className="text-center py-8 text-gray-400 text-[14px]">No recent activities recorded.</div>
        )}
      </div>
    </div>
  );
}
