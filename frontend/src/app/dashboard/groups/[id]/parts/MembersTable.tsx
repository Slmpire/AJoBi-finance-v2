"use client";

import { UserPlus, MoreVertical, Flag, Star } from "lucide-react";
import { MemberData } from "../model/useGroupDetails";

interface MembersTableProps {
  members: MemberData[];
  onTimeRate: string;
}

export default function MembersTable({ members, onTimeRate }: MembersTableProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Paid": return "bg-[#F1F6F3] text-[#066B44] border-[#066B44]/10";
      case "Pending": return "bg-[#FFF8E6] text-[#B8860B] border-[#B8860B]/10";
      case "Missed": return "bg-[#FFF5F5] text-[#FF4D4D] border-[#FF4D4D]/10";
      default: return "bg-gray-50 text-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#E8EFE8] shadow-sm overflow-hidden">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1F6F3]">
        <div>
          <h3 className="text-[15px] font-extrabold text-gray-900 uppercase tracking-wider opacity-90 mb-1">Active Members</h3>
          <p className="text-[12px] text-gray-500 font-bold">Group On-time rate: <span className="text-[#066B44]">{onTimeRate}</span></p>
        </div>
        <button className="flex items-center justify-center gap-2 text-[13px] font-extrabold text-[#066B44] border border-[#E8EFE8] px-5 py-2.5 rounded-xl bg-white hover:bg-[#F9FCF9] transition-all shadow-sm shrink-0 self-start">
          <UserPlus className="w-4 h-4" /> Invite
        </button>
      </div>

      {/* Responsive Table View */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-[#F1F6F3] text-left text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
              <th className="px-6 sm:px-8 py-4">Member Name</th>
              <th className="px-6 py-4">AjoScore</th>
              <th className="px-6 py-4 text-center">Position</th>
              <th className="px-6 py-4">Cycle Status</th>
              <th className="px-6 sm:px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F6F3]">
            {members.map((member) => (
              <tr key={member.id} className="group hover:bg-gray-50/30 transition-all">
                
                {/* Name Column */}
                <td className="px-6 sm:px-8 py-4.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-black text-gray-600 border border-gray-200 shadow-sm shrink-0">
                      {member.initials}
                    </div>
                    <div>
                      <p className="text-[13px] font-extrabold text-gray-800 leading-tight">{member.name}</p>
                      {member.statusDetail && (
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5 leading-none">{member.statusDetail}</p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Score Column */}
                <td className="px-6 py-4.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-black text-gray-800">{member.score}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                      member.score > 700 ? 'text-[#066B44] border-[#066B44]/10 bg-[#F1F6F3]' : 'text-[#B8860B] border-[#B8860B]/10 bg-[#FFF8E6]'
                    }`}>
                      {member.scoreTag}
                    </span>
                  </div>
                </td>

                {/* Position Column */}
                <td className="px-6 py-4.5 text-center">
                  <span className="text-[13px] font-extrabold text-gray-800 bg-white border border-[#E8EFE8] w-6 h-6 inline-flex items-center justify-center rounded-md shadow-sm">
                    {member.position}
                  </span>
                </td>

                {/* Cycle Status */}
                <td className="px-6 py-4.5">
                  <span className={`inline-block px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-md border ${getStatusStyle(member.status)}`}>
                    {member.status}
                  </span>
                </td>

                {/* Actions Column */}
                <td className="px-6 sm:px-8 py-4.5 text-right">
                  <div className="inline-flex items-center gap-2 justify-end">
                    {member.status === "Missed" ? (
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors border border-red-100 shadow-sm">
                        <Flag className="w-4 h-4 fill-current" />
                      </button>
                    ) : (
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100/60 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
