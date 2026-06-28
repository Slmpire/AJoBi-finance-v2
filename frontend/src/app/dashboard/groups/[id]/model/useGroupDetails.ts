import { useState, useEffect } from "react";
import { groupsService, JoinGroupPayload } from "@/services/groupsService";
import { useAppDispatch, useAppSelector } from "@/store";
import { joinGroup as joinGroupThunk } from "@/store/slices/groupsSlice";

export interface MemberData {
  id: string;
  name: string;
  initials: string;
  score: number;
  scoreTag: string;
  position: number;
  status: "Paid" | "Pending" | "Missed";
  statusDetail?: string;
  avatar?: string;
}

export interface HistoryItem {
  cycle: string;
  date: string;
  collected: string;
  disbursedTo: string;
  amount: string;
}

export const useGroupDetails = (groupId: string) => {
  const [isLoading, setIsLoading] = useState(true);

  // Main layout states
  const [groupInfo, setGroupInfo] = useState({
    name: "",
    status: "",
    contribution: "",
    rotation: "",
    currentCycle: 0,
    totalCycles: 0,
    nextDisbursement: "",
    onTimeRate: "0%",
    inviteCode: ""
  });

  const [rotationTimeline, setRotationTimeline] = useState<any[]>([]);

  const [members, setMembers] = useState<MemberData[]>([]);

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [userStatus, setUserStatus] = useState({
    paymentStatus: "Pending",
    paymentMethod: "N/A",
    methodActive: false,
    methodDetails: "Loading status..."
  });

  const [virtualAccount, setVirtualAccount] = useState<{
    bankName: string;
    accountNumber: string;
    accountName: string;
  } | null>(null);

  const [isJoining, setIsJoining] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Core Detailed Payload
        const detResp = await groupsService.getGroupDetail(groupId);
        console.log("details", detResp);
        if (detResp.success && detResp.data) {
          const data = detResp.data;
          setGroupInfo({
            name: data.name,
            status: data.status.charAt(0).toUpperCase() + data.status.slice(1),
            contribution: `₦${data.contribution_amount.toLocaleString()} Contribution`,
            rotation: `${data.frequency.charAt(0).toUpperCase() + data.frequency.slice(1)} Rotation`,
            currentCycle: data.current_cycle,
            totalCycles: data.total_cycles,
            nextDisbursement: `₦${data.next_disbursement_amount?.toLocaleString() || (data.contribution_amount * data.rotation?.length)} on ${new Date(data.next_disbursement_date).toLocaleDateString()}`,
            onTimeRate: "100%",
            inviteCode: data.invitecode || ""
          });

          // Map the rotation timeline avatars
          if (data.rotation) {
            const fallbackPics = [
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop"
            ];
            const mappedTimeline = data.rotation.map((r: any, idx: number) => ({
              id: r.user_id,
              name: r.name.split(' ')[0] + (r.name.split(' ')[1] ? ' ' + r.name.split(' ')[1][0] + '.' : ''),
              pos: `Pos ${r.position}`,
              completed: r.has_received,
              isNext: r.is_next,
              avatar: fallbackPics[idx % fallbackPics.length]
            }));
            setRotationTimeline(mappedTimeline);
          }

          // Map Members Table
          if (data.this_cycle_contributions) {
            const mappedMembers = data.this_cycle_contributions.map((c: any, idx: number) => {
              const rotData = data.rotation?.find((r: any) => r.user_id === c.user_id) || {};
              // Scale 10-100 score standard from backend back up to visual frontend 100-1000
              const scaleScore = rotData.ajo_score ? rotData.ajo_score * 10 : 650; 
              return {
                id: c.user_id,
                name: c.name,
                initials: c.name.split(' ').map((n: any) => n[0]).join('').substring(0, 2),
                score: scaleScore,
                scoreTag: scaleScore >= 750 ? 'Excellent' : scaleScore >= 600 ? 'Good' : 'Fair',
                position: rotData.position || (idx + 1),
                status: c.status === 'paid' ? 'Paid' : c.status === 'missed' ? 'Missed' : 'Pending',
                statusDetail: c.paid_at ? `Paid ${new Date(c.paid_at).toLocaleDateString()}` : c.grace_period_ends ? `Grace ends ${new Date(c.grace_period_ends).toLocaleDateString()}` : "Awaiting status"
              };
            });
            setMembers(mappedMembers);

            // Update user status
            const myStatus = data.this_cycle_contributions.find((c: any) => c.user_id === user?.user_id);
            if (myStatus) {
              setUserStatus({
                paymentStatus: myStatus.status === 'paid' ? 'Paid' : myStatus.status === 'missed' ? 'Missed' : 'Pending',
                paymentMethod: data.direct_debit_active ? "Squad Direct Debit" : "Manual Transfer",
                methodActive: data.direct_debit_active || false,
                methodDetails: myStatus.status === 'paid' 
                  ? `You successfully paid for this cycle on ${new Date(myStatus.paid_at).toLocaleDateString()}.` 
                  : data.direct_debit_active 
                    ? `Your next contribution of ₦${data.contribution_amount.toLocaleString()} will be automatically deducted on ${new Date(data.next_contribution_date).toLocaleDateString()}.`
                    : `Please make your payment of ₦${data.contribution_amount.toLocaleString()} before the deadline.`
              });
            } else {
              setUserStatus({
                paymentStatus: "Pending",
                paymentMethod: "N/A",
                methodActive: false,
                methodDetails: "You are not a member of this cycle's rotation."
              });
            }

            // Check if user is already a member
            const memberCheck = data.rotation?.some((r: any) => r.user_id === user?.user_id);
            setIsMember(!!memberCheck);

            // Handle virtual account details if they exist in the payload
            if (data.virtual_account) {
              setVirtualAccount({
                bankName: data.virtual_account.bank_name || data.virtual_account.bankName || 'Squad Bank',
                accountNumber: data.virtual_account.account_number || data.virtual_account.accountNumber,
                accountName: data.virtual_account.account_name || data.virtual_account.accountName
              });
            }
          }
        }

        // 2. Fetch Table Audits
        try {
          const histResp = await groupsService.getGroupContributionHistory(groupId);
          if (histResp.success && histResp.data?.contributions) {
            const mappedHist = histResp.data.contributions.map((h: any) => ({
              cycle: `#${h.cycle}`,
              date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              collected: h.all_paid ? "100%" : "Partial",
              disbursedTo: h.disbursed_to || "N/A",
              amount: `₦${h.disbursement_amount.toLocaleString()}`
            }));
            setHistory(mappedHist);
          }
        } catch {
          // history fallback maintained implicitly
        }

      } catch (e) {
        console.warn("Group details API failover to simulation", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [groupId]);

  const handleInitiatePayment = async () => {
    if (!user?.user_id || !groupId) return;
    
    // According to backend: "if the group is not longer a n awaiting group. then we they commence the ajo , the members can initiate payment"
    const isAwaiting = groupInfo.status.toLowerCase().includes('awaiting');
    
    if (isAwaiting) {
      alert("Awaiting members means there are not enough members yet, so you can't make a payment. You need to join the group first and wait for it to commence.");
      return;
    }

    setIsPaying(true);
    try {
      console.log(`Initiating payment for user ${user.user_id} in group ${groupId}`);
      const response = await groupsService.initiateGroupPayment(user.user_id, groupId);
      console.log("Payment initiation response:", response);

      if ((response.success === 'true' || response.success === true) && response.url) {
        window.location.href = response.url;
      } else {
        alert(response.message || "Failed to initiate payment. Please try again.");
      }
    } catch (err: any) {
      console.error("Payment initiation failed", err);
      alert(err.message || "An error occurred while initiating your payment slip.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleJoinGroup = async (inviteCode?: string) => {
    setIsJoining(true);
    setJoinError(null);
    try {
      const resultAction = await dispatch(joinGroupThunk({ 
        groupId, 
        payload: { invite_code: inviteCode || groupInfo.inviteCode || "" } 
      }));
      
      if (joinGroupThunk.fulfilled.match(resultAction)) {
        // Refresh details after joining
        const detResp = await groupsService.getGroupDetail(groupId);
        if (detResp.success && detResp.data) {
          setIsMember(true);
          // Re-trigger the logic or just let the next refresh handle it
          // For now, let's just refresh the whole hook data
          window.location.reload(); // Simple way to refresh for now, or we could manually set states
        }
        return true;
      } else {
        setJoinError(resultAction.payload as string || "Failed to join group");
        return false;
      }
    } catch (err: any) {
      setJoinError(err.message);
      return false;
    } finally {
      setIsJoining(false);
    }
  };

  return {
    isLoading,
    isJoining,
    joinError,
    isMember,
    groupInfo,
    rotationTimeline,
    members,
    history,
    userStatus,
    virtualAccount,
    isPaying,
    handleInitiatePayment,
    handleJoinGroup
  };
};
