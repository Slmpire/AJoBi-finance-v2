"use client";

import { use } from "react";
import { Loader2 } from "lucide-react";
import { useGroupDetails } from "./model/useGroupDetails";
import GroupHeader from "./parts/GroupHeader";
import RotationTracker from "./parts/RotationTracker";
import MembersTable from "./parts/MembersTable";
import ContributionHistory from "./parts/ContributionHistory";
import StatusWidget from "./parts/StatusWidget";
import CreatorControls from "./parts/CreatorControls";
import TrustLevel from "./parts/TrustLevel";

export default function GroupDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const {
    isLoading,
    groupInfo,
    rotationTimeline,
    members,
    history,
    userStatus,
    virtualAccount,
    isPaying,
    handleInitiatePayment,
    handleJoinGroup,
    isJoining,
    isMember
  } = useGroupDetails(id);

  console.log(isMember);

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#066B44] animate-spin mb-4" />
        <p className="text-[14px] font-bold text-gray-500">Loading group analytics...</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pb-12">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-4">
        
        {/* Left: Core Group Data Modules */}
        <div className="lg:col-span-2 space-y-8">
          
          <GroupHeader 
            name={groupInfo.name}
            status={groupInfo.status}
            contribution={groupInfo.contribution}
            rotation={groupInfo.rotation}
            currentCycle={groupInfo.currentCycle}
            totalCycles={groupInfo.totalCycles}
            onJoin={handleJoinGroup}
            isJoining={isJoining}
            isMember={isMember}
            virtualAccount={virtualAccount}
            onPayment={handleInitiatePayment}
            isPaying={isPaying} 
            inviteCode={groupInfo.inviteCode}
          />

          <RotationTracker 
            nextDisbursement={groupInfo.nextDisbursement}
            timeline={rotationTimeline}
          />

          <MembersTable 
            members={members}
            onTimeRate={groupInfo.onTimeRate}
          />

          <ContributionHistory 
            history={history}
          />

        </div>

        {/* Right: User Actions & Status Widgets */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            
            <StatusWidget 
              paymentStatus={userStatus.paymentStatus}
              paymentMethod={userStatus.paymentMethod}
              methodActive={userStatus.methodActive}
              methodDetails={userStatus.methodDetails}
            />

            <CreatorControls />

            <TrustLevel />

          </div>
        </div>

      </div>

    </div>
  );
}
