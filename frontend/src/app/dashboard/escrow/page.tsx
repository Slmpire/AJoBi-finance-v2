"use client";

import { Plus, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEscrows } from './model/useEscrows';
import EscrowCard from './parts/EscrowCard';
import EscrowFilters from './parts/EscrowFilters';

export default function EscrowPage() {
  const { escrows, isLoading, activeFilter, setActiveFilter, searchQuery, setSearchQuery } = useEscrows();

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-[32px] font-bold text-gray-900 tracking-tight">My Escrows</h1>
          <p className="text-[15px] text-gray-500 font-medium max-w-xl">
            Manage and track your secure transactions in the informal economy.
          </p>
        </div>
        <Link href="/dashboard/escrow/create">
          <button className="bg-[#066B44] text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-[15px] shadow-[0_4px_15px_rgba(6,107,68,0.15)] transition-all hover:bg-[#055636] hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="w-5 h-5" />
            Create Escrow
          </button>
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Filters and Search Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <EscrowFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          
          {/* Internal Search (Small) */}
          <div className="relative w-full lg:w-72 mb-8 lg:mb-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search escrows..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-[13px] font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#066B44]/10 focus:border-[#066B44] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Escrow Grid */}
        {isLoading ? (
          <div className="w-full h-64 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-[#066B44] animate-spin mb-4" />
            <p className="text-gray-500 font-bold">Loading your escrows...</p>
          </div>
        ) : escrows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {escrows.map((escrow) => (
              <EscrowCard key={escrow.id} escrow={escrow} />
            ))}
          </div>
        ) : (
          <div className="w-full h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold text-center">No escrows found matching this filter.</p>
            <Link href="/dashboard/escrow/create" className="mt-4 text-[#066B44] font-bold underline">
              Create your first escrow
            </Link>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#F1F6F3]/50 p-6 rounded-[24px] border border-[#F1F6F3]">
          <p className="text-[13px] text-gray-500 font-medium">
            Showing <span className="font-bold text-gray-900">{escrows.length}</span> of <span className="font-bold text-gray-900">{escrows.length}</span> escrows
          </p>
          
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[#066B44] hover:border-[#066B44] transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {[1, 2, 3, '...', 8].map((page, i) => (
              <button
                key={i}
                className={`w-10 h-10 flex items-center justify-center rounded-xl text-[13px] font-bold transition-all ${
                  page === 1
                    ? 'bg-[#066B44] text-white shadow-md'
                    : 'bg-white border border-gray-100 text-gray-500 hover:border-[#066B44] hover:text-[#066B44]'
                } ${page === '...' ? 'pointer-events-none border-none bg-transparent' : ''}`}
              >
                {page}
              </button>
            ))}
            
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[#066B44] hover:border-[#066B44] transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
