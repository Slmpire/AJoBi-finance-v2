"use client";

import { Search, Lock, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PublicGroup } from "../model/useGroups";

interface BrowseGroupsProps {
  groups: PublicGroup[];
  searchFilter: string;
  setSearchFilter: (v: string) => void;
  amountFilter: string;
  setAmountFilter: (v: string) => void;
  frequencyFilter: string;
  setFrequencyFilter: (v: string) => void;
}

export default function BrowseGroups({
  groups,
  searchFilter,
  setSearchFilter,
  amountFilter,
  setAmountFilter,
  frequencyFilter,
  setFrequencyFilter
}: BrowseGroupsProps) {
  console.log(groups, "groups");
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold text-gray-900 text-[16px] uppercase tracking-wider mb-5 opacity-80">
          Browse Public Groups
        </h3>
        
        {/* Filters Row */}
        <div className="bg-[#FAFCFB] border border-[#E8EFE8] rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            
            {/* Search string */}
            <div className="lg:col-span-2 space-y-2">
              <label className="block text-[11px] font-extrabold text-gray-400 uppercase">Search Groups</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="By name or admin..." 
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-white border border-[#E8EFE8] rounded-xl pl-11 pr-4 py-3 text-[13px] font-medium outline-none focus:border-[#066B44] transition-all shadow-sm"
                />
              </div>
            </div>
            
            {/* Amount range selector */}
            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold text-gray-400 uppercase">Amount</label>
              <select 
                value={amountFilter}
                onChange={(e) => setAmountFilter(e.target.value)}
                className="w-full bg-white border border-[#E8EFE8] rounded-xl px-4 py-3 text-[13px] font-medium outline-none focus:border-[#066B44] transition-all shadow-sm appearance-none"
              >
                <option value="Any">Any</option>
                <option value="Under ₦50k">Under ₦50k</option>
                <option value="₦50k - ₦200k">₦50k - ₦200k</option>
                <option value="Above ₦200k">Above ₦200k</option>
              </select>
            </div>
            
            {/* Frequency select */}
            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold text-gray-400 uppercase">Frequency</label>
              <select 
                value={frequencyFilter}
                onChange={(e) => setFrequencyFilter(e.target.value)}
                className="w-full bg-white border border-[#E8EFE8] rounded-xl px-4 py-3 text-[13px] font-medium outline-none focus:border-[#066B44] transition-all shadow-sm appearance-none"
              >
                <option value="Any">Any</option>
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
              </select>
            </div>
            
            {/* Visual helper indicator for reset or generic count */}
            <div className="text-center text-[12px] text-gray-400 font-extrabold h-full flex items-center justify-center pb-3 border border-dashed border-[#E8EFE8] rounded-xl bg-gray-50/50">
              {groups.length} Groups Found
            </div>

          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groups.map((group) => (
            <div 
              key={group.id} 
              className={`bg-white rounded-[24px] border border-[#E8EFE8] p-6 flex flex-col justify-between relative transition-all duration-200 ${
                group.locked ? 'opacity-75' : 'hover:shadow-md shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:-translate-y-0.5'
              }`}
            >
              {group.locked && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-[24px] z-10 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-[#FFF] rounded-full flex items-center justify-center mb-3 border border-[#E8EFE8] shadow-md">
                    <Lock className="w-5 h-5 text-gray-700" />
                  </div>
                  <p className="text-[16px] font-black text-gray-900">{group.tierRequired} Required</p>
                  <p className="text-[12px] text-gray-500 font-medium mt-0.5">Min Score: {group.minScore}</p>
                  <button className="mt-4 px-6 py-2 bg-gray-700 text-white text-[12px] font-bold rounded-xl shadow-sm cursor-not-allowed opacity-90">
                    Locked
                  </button>
                </div>
              )}

              <div className={group.locked ? 'filter blur-[1.5px] select-none pointer-events-none' : ''}>
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F1F6F3] border border-[#E8EFE8] flex items-center justify-center font-black text-[#066B44] shadow-inner">
                      {group.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-[15px] text-gray-900 tracking-tight">{group.name}</h4>
                      <p className="text-[12px] text-gray-400 font-bold">Admin: {group.admin}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase leading-none mb-1">Amount</p>
                    <p className="text-[16px] font-black text-[#066B44] tracking-tight">{group.amount}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-[#F9FCF9] border border-[#E8EFE8] p-4 rounded-xl mb-6">
                  <div>
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wide">Slots</p>
                    <p className="text-[13px] font-black text-gray-800 mt-0.5">{group.slots}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wide">Min Score</p>
                    <p className="text-[13px] font-black text-gray-800 mt-0.5 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#B8860B] fill-current" /> {group.minScore}+
                    </p>
                  </div>
                </div>

                {!group.locked && (
                  <Link 
                    href={`/dashboard/groups/${group.id}`}
                    className="w-full border-2 border-[#066B44] text-[#066B44] hover:bg-[#066B44] hover:text-white py-3 rounded-xl text-[13px] font-black transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm group/btn"
                  >
                    View group
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full py-12 border border-dashed border-[#E8EFE8] bg-white rounded-[24px] flex flex-col items-center justify-center text-center p-6">
          <div className="w-12 h-12 bg-[#F1F6F3] rounded-full flex items-center justify-center text-[#066B44] mb-3 shadow-inner">
            <Search className="w-5 h-5" />
          </div>
          <h4 className="text-[15px] font-black text-gray-800 mb-1">No Groups Found</h4>
          <p className="text-[13px] text-gray-500 font-medium max-w-xs">
            Try adjusting your search parameters or changing the frequency filters to discover other circles.
          </p>
          <button 
            onClick={() => { setSearchFilter(""); setAmountFilter("Any"); setFrequencyFilter("Any"); }}
            className="mt-4 text-[#066B44] text-[13px] font-black hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
}
