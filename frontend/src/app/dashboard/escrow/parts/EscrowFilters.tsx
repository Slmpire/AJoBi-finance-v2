"use client";

interface EscrowFiltersProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export default function EscrowFilters({ activeFilter, setActiveFilter }: EscrowFiltersProps) {
  const filters = [
    'All Escrows',
    'As Buyer / Employer',
    'As Seller / Worker',
    'Completed',
    'Disputed'
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
            activeFilter === filter
              ? 'bg-[#066B44] text-white shadow-[0_4px_12px_rgba(6,107,68,0.2)]'
              : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
