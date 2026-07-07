import { useState, useMemo, useEffect } from "react";
import { groupsService } from "@/services/groupsService";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchMyGroups, fetchPublicGroups } from "@/store/slices/groupsSlice";

export interface GroupItem {
  id: string;
  name: string;
  type: string;
  contribution: string;
  nextPayout: string;
  position: string;
  status: 'Paid' | 'Pending' | 'Missed';
  members: number;
  avatars: string[];
}

export interface PublicGroup {
  id: string;
  name: string;
  admin: string;
  amount: string;
  rawAmount: number;
  frequency: "Monthly" | "Weekly" | "Bi-Weekly";
  slots: string;
  minScore: number;
  locked?: boolean;
  tierRequired?: string;
}

export interface MatchedGroup {
  id: string;
  name: string;
  matchRate: number;
  description: string;
  amount: string;
  members: string;
  proposedMembers?: any[];
}

export const useGroups = () => {
  const dispatch = useAppDispatch();
  const { myGroups, publicGroups, isLoading, error } = useAppSelector((state) => state.groups);
  console.log(myGroups, "my group");
  console.log(publicGroups, "public groups");
  
  const [activeTab, setActiveTab] = useState<'my' | 'browse' | 'match'>('my');
  
  // Search & States
  const [searchFilter, setSearchFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("Any");
  const [frequencyFilter, setFrequencyFilter] = useState("Any");

  // Matching Engine states
  const [searchQuery, setSearchQuery] = useState("");
  const [matchAmount, setMatchAmount] = useState("50,000");
  const [matchFrequency, setMatchFrequency] = useState<'Monthly' | 'Weekly'>('Monthly');
  const [isMatching, setIsMatching] = useState(false);
  const [showMatches, setShowMatches] = useState(false);

  // Local state for matches since it's a specific interaction
  const [matchedGroups, setMatchedGroups] = useState<MatchedGroup[]>([]);

  // Initialize API calls through Redux
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(fetchMyGroups(userId));
    }
    dispatch(fetchPublicGroups());
  }, [dispatch]);

  // Trigger AI Match Engine
  const handleFindMatch = async () => {
    setIsMatching(true);
    setShowMatches(false);
    try {
      const numericAmt = parseFloat(matchAmount.replace(/,/g, "")) || 10000;
      const resp = await groupsService.autoMatchGroup({
        contribution_amount: 5000,
        // frequency: matchFrequency.toLowerCase() as 'weekly' | 'monthly',
        frequency: 'weekly',
      });
      console.log(resp, "resp")

      if (resp.success && resp.data?.recommended_groups) {
        const mapped = resp.data.recommended_groups.map((m: any) => ({
          id: m.group_id,
          name: m.group_name || `Ajo Circle Match`,
          matchRate: m.group_compatibility_score,
          description: m.why_recommended || `Compatible trust circle based on your Ajo Score.`,
          amount: `₦${parseFloat(m.contribution_amount).toLocaleString()}/${m.frequency === 'weekly' ? 'wk' : 'mo'}`,
          members: `${m.current_members || 0}/${m.max_members || 10} Members`,
          proposedMembers: m.proposed_members || []
        }));
        setMatchedGroups(mapped);
        setShowMatches(true);
      } else {
        setMatchedGroups([]);
      }
    } catch (error) {
      console.error("Match failed:", error);
      setMatchedGroups([]);
    } finally {
      setIsMatching(false);
    }
  };

  // Computational Client Filters on dynamic state payload
  const filteredPublicGroups = useMemo(() => {
    return publicGroups.filter(group => {
      if (searchFilter) {
        const lower = searchFilter.toLowerCase();
        const matchesName = group.name.toLowerCase().includes(lower);
        const matchesAdmin = group.admin.toLowerCase().includes(lower);
        if (!matchesName && !matchesAdmin) return false;
      }
      if (frequencyFilter !== "Any") {
        if (group.frequency !== frequencyFilter) return false;
      }
      if (amountFilter !== "Any") {
        if (amountFilter === "Under ₦50k" && group.rawAmount >= 50000) return false;
        if (amountFilter === "₦50k - ₦200k" && (group.rawAmount < 50000 || group.rawAmount > 200000)) return false;
        if (amountFilter === "Above ₦200k" && group.rawAmount <= 200000) return false;
      }
      return true;
    });
  }, [publicGroups, searchFilter, amountFilter, frequencyFilter]);

  console.log(filteredPublicGroups, "filteredPublicGroups");

  return {
    isLoading,
    activeTab,
    setActiveTab,
    myGroups,
    publicGroups: filteredPublicGroups,
    matchedGroups,
    searchQuery,
    setSearchQuery,
    searchFilter,
    setSearchFilter,
    amountFilter,
    setAmountFilter,
    frequencyFilter,
    setFrequencyFilter,
    matchAmount,
    setMatchAmount,
    matchFrequency,
    setMatchFrequency,
    isMatching,
    showMatches,
    handleFindMatch
  };
};
