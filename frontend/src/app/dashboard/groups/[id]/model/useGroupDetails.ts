import { useState, useEffect } from "react";
import { groupsService } from "@/services/groupsService";
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

  const [groupInfo, setGroupInfo] = useState({
    name: "",
    status: "",
    contribution: "",
    rotation: "",
    currentCycle: 0,
    totalCycles: 0,
    nextDisbursement: "",
    onTimeRate: "100%",
    inviteCode: "",
  });

  const [rotationTimeline, setRotationTimeline] = useState<any[]>([]);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [userStatus, setUserStatus] = useState({
    paymentStatus: "Pending",
    paymentMethod: "Nomba Checkout",
    methodActive: false,
    methodDetails: "Click 'Pay Now' to make your contribution.",
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
  const userId = user?.user_id || (typeof window !== "undefined" ? localStorage.getItem("userId") : null);

  const fallbackPics = [
    "https://i.pravatar.cc/150?img=1",
    "https://i.pravatar.cc/150?img=2",
    "https://i.pravatar.cc/150?img=3",
    "https://i.pravatar.cc/150?img=4",
    "https://i.pravatar.cc/150?img=5",
  ];

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const detResp = await groupsService.getGroupDetail(groupId);

        if (detResp.status && detResp.data) {
          const { group, members: memberList, next_recipient } = detResp.data;

          setGroupInfo({
            name: group.name,
            status: group.status.charAt(0).toUpperCase() + group.status.slice(1),
            contribution: `₦${parseFloat(group.contribution_amount).toLocaleString()} Contribution`,
            rotation: `${group.frequency.charAt(0).toUpperCase() + group.frequency.slice(1)} Rotation`,
            currentCycle: group.current_cycle,
            totalCycles: group.max_members,
            nextDisbursement: next_recipient
              ? `₦${(parseFloat(group.contribution_amount) * memberList.length).toLocaleString()} → ${next_recipient.full_name}`
              : "Awaiting members",
            onTimeRate: "100%",
            inviteCode: group.invite_code || "",
          });

          // Rotation timeline from members
          const mappedTimeline = memberList.map((m: any, idx: number) => ({
            id: m.user_id,
            name: m.full_name,
            pos: `Pos ${m.rotation_position}`,
            completed: false,
            isNext: next_recipient?.user_id === m.user_id,
            avatar: fallbackPics[idx % fallbackPics.length],
          }));
          setRotationTimeline(mappedTimeline);

          // Members table
          const mappedMembers: MemberData[] = memberList.map((m: any, idx: number) => ({
            id: String(m.user_id),
            name: m.full_name,
            initials: m.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase(),
            score: 650,
            scoreTag: "Good",
            position: m.rotation_position,
            status: m.current_cycle_status === "paid" ? "Paid" : m.current_cycle_status === "failed" ? "Missed" : "Pending",
            statusDetail: m.current_cycle_status === "paid" ? "Paid this cycle" : "Awaiting payment",
            avatar: fallbackPics[idx % fallbackPics.length],
          }));
          setMembers(mappedMembers);

          // Check if current user is a member
          const memberCheck = memberList.some((m: any) => String(m.user_id) === String(userId));
          setIsMember(memberCheck);

          // User payment status
          const myEntry = memberList.find((m: any) => String(m.user_id) === String(userId));
          if (myEntry) {
            setUserStatus({
              paymentStatus: myEntry.current_cycle_status === "paid" ? "Paid" : "Pending",
              paymentMethod: "Nomba Checkout",
              methodActive: true,
              methodDetails: myEntry.current_cycle_status === "paid"
                ? "You have paid for this cycle."
                : `Make your ₦${parseFloat(group.contribution_amount).toLocaleString()} contribution to stay in rotation.`,
            });
          }
        }

        // Fetch payment history
        try {
          const histResp = await groupsService.getGroupPayments(groupId);
          if (histResp.status && histResp.data) {
            const mappedHist = histResp.data
              .filter((h: any) => h.status === "paid")
              .map((h: any) => ({
                cycle: `#${h.cycle_number}`,
                date: h.paid_at ? new Date(h.paid_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A",
                collected: "100%",
                disbursedTo: h.full_name || "N/A",
                amount: `₦${parseFloat(h.amount).toLocaleString()}`,
              }));
            setHistory(mappedHist);
          }
        } catch {
          // history is optional
        }
      } catch (e) {
        console.warn("Group details fetch failed", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [groupId, userId]);

  const handleInitiatePayment = async () => {
    if (!userId || !groupId) return;
    setIsPaying(true);
    try {
      const response = await groupsService.setupDebit(groupId);
      if (response.status && response.data?.checkout_link) {
        window.open(response.data.checkout_link, "_blank");
      } else {
        alert(response.message || "Failed to generate payment link.");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred while generating your payment link.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleJoinGroup = async (inviteCode?: string) => {
    setIsJoining(true);
    setJoinError(null);
    try {
      const resultAction = await dispatch(
        joinGroupThunk({ invite_code: inviteCode || groupInfo.inviteCode || "" })
      );
      if (joinGroupThunk.fulfilled.match(resultAction)) {
        setIsMember(true);
        window.location.reload();
        return true;
      } else {
        setJoinError((resultAction.payload as string) || "Failed to join group");
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
    handleJoinGroup,
  };
};