"use client";

import { Download, CheckCircle } from "lucide-react";
import { HistoryItem } from "../model/useGroupDetails";

export default function ContributionHistory({ history }: { history: HistoryItem[] }) {
  return (
    <div className="bg-white rounded-[24px] border border-[#E8EFE8] shadow-sm overflow-hidden">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1F6F3]">
        <h3 className="text-[15px] font-extrabold text-gray-900 uppercase tracking-wider opacity-90">Contribution History</h3>
        <button className="flex items-center justify-center gap-2 text-[12px] font-extrabold text-gray-600 border border-[#E8EFE8] px-4 py-2 rounded-xl bg-white hover:bg-[#F9FCF9] transition-all shadow-sm shrink-0 self-start">
          <Download className="w-4 h-4" /> Download PDF Report
        </button>
      </div>

      {/* Audit Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-[#F1F6F3] text-left text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
              <th className="px-6 sm:px-8 py-4">Cycle #</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Collected</th>
              <th className="px-6 py-4">Disbursed To</th>
              <th className="px-6 sm:px-8 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F6F3]">
            {history.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/30 transition-all text-[13px]">
                <td className="px-6 sm:px-8 py-4 font-black text-gray-800">{row.cycle}</td>
                <td className="px-6 py-4 font-medium text-gray-500">{row.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 font-black text-[#066B44]">
                    <CheckCircle className="w-3.5 h-3.5 fill-current" strokeWidth={3} /> {row.collected}
                  </div>
                </td>
                <td className="px-6 py-4 font-extrabold text-gray-700">{row.disbursedTo}</td>
                <td className="px-6 sm:px-8 py-4 text-right font-black text-gray-900">{row.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
