"use client";

import Image from "next/image";
import { GroupItem } from "../model/useGroups";

export default function MyGroups({ groups }: { groups: GroupItem[] }) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Paid": return "bg-[#F1F6F3] text-[#066B44]";
      case "Pending": return "bg-[#FFF5F5] text-[#FF4D4D]";
      case "Missed": return "bg-red-50 text-red-600";
      default: return "bg-gray-50 text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-white rounded-[24px] p-6 border border-[#E8EFE8] shadow-sm relative flex flex-col justify-between h-full hover:shadow-md transition-shadow duration-200">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-[16px] text-gray-900 leading-tight">{group.name}</h4>
                  <p className="text-[12px] text-gray-400 font-medium mt-0.5">{group.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${getStatusStyle(group.status)}`}>
                  {group.status}
                </span>
              </div>
              
              <h3 className="text-[28px] font-black text-[#066B44] mb-6 tracking-tight">{group.contribution}</h3>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-[#E8EFE8] mb-6">
                <div>
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase">
                    {group.nextPayout === 'Awaiting start' ? 'Next Recipient' : 'Next Payout'}
                  </p>
                  <p className="text-[13px] font-bold text-gray-800 mt-0.5">
                    {group.nextPayout === 'Awaiting start' ? (group as any).nextRecipient : group.nextPayout}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase">Position</p>
                  <p className="text-[13px] font-bold text-gray-800 mt-0.5">{group.position}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {group.avatars.map((url, idx) => (
                  <div key={idx} className="w-7 h-7 rounded-full border-2 border-white overflow-hidden relative bg-gray-200">
                    <Image src={url} alt="member" fill className="object-cover" />
                  </div>
                ))}
                <div className="w-7 h-7 rounded-full border-2 border-white bg-[#F1F6F3] flex items-center justify-center text-[10px] font-extrabold text-[#066B44]">
                  +{group.members - group.avatars.length}
                </div>
              </div>
              <span className="text-[12px] font-bold text-gray-500">{group.members} members</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
