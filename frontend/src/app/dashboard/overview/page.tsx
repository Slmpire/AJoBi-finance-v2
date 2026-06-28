"use client";

import { Loader2 } from "lucide-react";
import { useDashboardOverview } from "./model/useDashboardOverview";
import ScoreCard from "./parts/ScoreCard";
import QuickActions from "./parts/QuickActions";
import ActiveOverview from "./parts/ActiveOverview";
import RecentActivity from "./parts/RecentActivity";
import KYCSection from "./parts/KYCSection";

export default function DashboardOverviewPage() {
  const { 
    isLoading, 
    data,
    kycLoading,
    kycSuccess,
    kycError,
    handleKYCSubmit,
    virtualAccountLoading,
    virtualAccountData,
    handleCreateVirtualAccount
  } = useDashboardOverview();

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#066B44] animate-spin mb-4" />
        <p className="text-[14px] font-bold text-gray-500 tracking-wide">
          Loading your dashboard overview...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full py-12 text-center text-red-500 font-bold">
        Failed to load dashboard overview. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-10 w-full mx-auto">
      {/* Financial Credibility Summary */}
      <ScoreCard 
        score={data.ajoScore} 
        tier={data.scoreTier} 
        diff={data.scoreDiff} 
      />

      <KYCSection 
        kycLoading={kycLoading}
        kycSuccess={kycSuccess}
        onKYCSubmit={handleKYCSubmit}
        virtualAccountLoading={virtualAccountLoading}
        virtualAccountData={virtualAccountData}
        onCreateVirtualAccount={handleCreateVirtualAccount}
        error={kycError}
      />

      {/* Fast Quick Action Hub */}
      <QuickActions />

      {/* Current Live Activity Stats */}
      <ActiveOverview 
        groups={data.activeGroups} 
        escrows={data.activeEscrows} 
        instalments={data.activeInstalments} 
      />

      {/* Tail Audit History Log */}
      <RecentActivity activities={data.recentActivities} />
    </div>
  );
}
