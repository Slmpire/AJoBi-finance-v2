"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCreateGroup } from "./model/useCreateGroup";
import CreateForm from "./parts/CreateForm";
import PreviewSummary from "./parts/PreviewSummary";

export default function CreateGroupPage() {
  const {
    formData,
    updateField,
    targetPayout,
    cycleDuration,
    formattedContribution,
    isSubmitting,
    error,
    handleSubmit
  } = useCreateGroup();

  return (
    <div className="w-full mx-auto pb-12">
      
      {/* Wizard Header */}
      <div className="mb-8 flex items-center gap-4 border-b border-[#E8EFE8] pb-6">
        <Link 
          href="/dashboard/groups"
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#E8EFE8] text-gray-600 hover:text-[#066B44] hover:border-[#066B44] transition-colors shadow-sm shrink-0 hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
        </Link>
        <div>
          <h1 className="text-[26px] sm:text-[28px] font-black text-gray-900 tracking-tight leading-tight mb-1">
            Create New Ajo Group
          </h1>
          <p className="text-[13px] sm:text-[14px] text-gray-500 font-medium">
            Establish a new trust circle and manage contributions with automated transparency.
          </p>
        </div>
      </div>
      
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3 animate-shake">
          <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">!</div>
          {error}
        </div>
      )}

      {/* Columns Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left: Multi-part Form Blocks */}
        <CreateForm 
          formData={formData} 
          updateField={updateField} 
        />

        {/* Right: Dynamic Sticky Calculation Drawer */}
        <PreviewSummary 
          targetPayout={targetPayout}
          cycleDuration={cycleDuration}
          formattedContribution={formattedContribution}
          minScore={formData.minScore}
          gracePeriod={formData.gracePeriod}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />

      </div>

    </div>
  );
}
