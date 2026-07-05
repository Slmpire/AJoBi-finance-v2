import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchMyGroups } from '@/store/slices/groupsSlice';
import { fetchSavingsOverview } from '@/store/slices/savingsSlice';
import { fetchProfile } from '@/store/slices/settingsSlice';
import { fetchAjoScore, fetchEligibility } from '@/store/slices/scoreSlice';
import { userService } from '@/services/userService';
import { escrowService } from '@/services/escrowService';
import { scoreService } from '@/services/scoreService';

export interface DashboardData {
  ajoScore: number;
  scoreTier: string;
  scoreDiff: number;
  activeGroups: {
    name: string;
    nextDate: string;
    status: string;
    amount: string;
  }[];
  activeEscrows: {
    title: string;
    status: string;
    amount: string;
  }[];
  activeInstalments: {
    item: string;
    progress: number;
    paid: string;
    total: string;
  }[];
  recentActivities: {
    id: string;
    type: 'payment' | 'score' | 'view' | 'other';
    title: string;
    subtitle: string;
    timeAgo: string;
  }[];
  improvementTips: string[];
  eligibility: {
    loanEligible: boolean;
    loanMessage: string;
  };
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export const useDashboardOverview = () => {
  const dispatch = useAppDispatch();
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [kycLoading, setKycLoading] = useState(false);
  const [virtualAccountLoading, setVirtualAccountLoading] = useState(false);
  const [kycSuccess, setKycSuccess] = useState(false);
  const [kycError, setKycError] = useState<string | null>(null);
  const [virtualAccountData, setVirtualAccountData] = useState<any>(null);
  const [recentEscrows, setRecentEscrows] = useState<any[]>([]);
  const [scoreEvents, setScoreEvents] = useState<any[]>([]);

  const { myGroups, isLoading: groupsLoading } = useAppSelector((state) => state.groups);
  const { balance, isLoading: savingsLoading } = useAppSelector((state) => state.savings);
  const { profile, isLoading: settingsLoading } = useAppSelector((state) => state.settings);
  const { ajoScore, eligibility, isLoading: scoreLoading } = useAppSelector((state) => state.score);
  const user = useAppSelector((state) => state.auth.user);

  const userId = useMemo(() => {
    if (user?.user_id) return user.user_id;
    if (typeof window !== 'undefined') return localStorage.getItem('userId');
    return null;
  }, [user]);

  const isLoading = groupsLoading || savingsLoading || settingsLoading || scoreLoading;

 useEffect(() => {
  dispatch(fetchMyGroups(userId));
  dispatch(fetchSavingsOverview());
  dispatch(fetchProfile());
  dispatch(fetchAjoScore(userId));
  dispatch(fetchEligibility(userId));

  escrowService.getMyEscrows().then(res => {
    if (res.status && res.data) setRecentEscrows(res.data.slice(0, 3));
  }).catch(() => {});

  scoreService.getScoreEvents(5, 0).then(res => {
    if (res.status && res.data) setScoreEvents(res.data);
  }).catch(() => {});

// Load virtual account — if exists, show it directly
userService.getVirtualAccountData().then((res: any) => {
  if (res.status && res.data) {
    setVirtualAccountData({
      accountNumber: res.data.account_number,
      accountName: res.data.account_name,
      bankName: res.data.bank_name,
    });
    setKycSuccess(true);
  } else {
    // No virtual account yet — check if BVN exists and auto-create
    userService.getProfile().then(async (profileRes: any) => {
      if (profileRes.status && profileRes.data?.bvn) {
        setKycSuccess(true);
        // Auto-create virtual account in background
        try {
          const vaRes = await userService.createUserVirtualAccount();
          if (vaRes.status && vaRes.data) {
            setVirtualAccountData({
              accountNumber: vaRes.data.account_number,
              accountName: vaRes.data.account_name,
              bankName: vaRes.data.bank_name,
            });
          }
        } catch (e) {
          // Will show "Generate" button instead
        }
      }
    }).catch(() => {});
  }
}).catch(() => {});

  // If no virtual account, check if KYC was already submitted (BVN exists)
  userService.getProfile().then((res: any) => {
    if (res.status && res.data?.bvn) {
      setKycSuccess(true);
    }
  }).catch(() => {});
}, [dispatch, userId]);

  const data = useMemo(() => {
    if (!ajoScore && isLoading) return null;

    const activeEscrows = recentEscrows.map((e: any) => ({
      title: e.description || 'Escrow transaction',
      status: e.status === 'funded' ? 'Funded' : e.status === 'released' ? 'Released' : 'Pending',
      amount: `₦${parseFloat(e.amount).toLocaleString()}`,
    }));

    const recentActivities = scoreEvents.map((e: any) => ({
      id: String(e.event_id),
      type: e.direction === 'up' ? 'payment' : 'other' as any,
      title: e.reason,
      subtitle: `AjoScore ${e.direction === 'up' ? '+' : '-'}${e.points} points`,
      timeAgo: timeAgo(e.created_at),
    }));

    return {
      ajoScore: ajoScore?.score || 0,
      scoreTier: (typeof ajoScore?.tier === 'object' ? (ajoScore.tier as any).name : ajoScore?.tier) || 'Starter',
      scoreDiff: 0,
      activeGroups: myGroups.map(g => ({
        name: g.name,
        nextDate: g.nextPayout,
        status: g.status,
        amount: g.contribution,
      })),
      activeEscrows,
      activeInstalments: [],
      recentActivities,
      improvementTips: ajoScore?.improvement_tips || [],
      eligibility: {
        loanEligible: eligibility?.loan_eligible || false,
        loanMessage: eligibility?.loan_eligibility_message || '',
      },
    } as DashboardData;
  }, [myGroups, balance, profile, ajoScore, eligibility, isLoading, recentEscrows, scoreEvents]);

  const handleKYCSubmit = async (kycData: any) => {
    setKycLoading(true);
    setKycError(null);
    try {
      // Submit real KYC with actual form data
      const response = await userService.submitKYC({
        bvn: kycData.bvn,
        account_number: kycData.beneficiary_account,
        account_name: kycData.account_name,
        bank_code: kycData.bank_code || '058',
      });

      if (response.status) {
        setKycSuccess(true);
        dispatch(fetchProfile());
        return true;
      }
      return false;
    } catch (error: any) {
      setKycError(error.message || 'KYC update failed');
      return false;
    } finally {
      setKycLoading(false);
    }
  };

 const handleCreateVirtualAccount = async () => {
  if (!userId) return;
  setVirtualAccountLoading(true);
  setKycError(null);
  try {
    const response = await userService.createVirtualAccount(userId) as any;
    setVirtualAccountData({
      accountNumber: response?.data?.account_number || '9200000001',
      accountName: response?.data?.account_name || 'AjoBI User',
      bankName: response?.data?.bank_name || 'Nomba MFB',
    });
  } catch (error: any) {
    setKycError(error.message || 'Virtual account creation failed');
  } finally {
    setVirtualAccountLoading(false);
  }
};

  return {
    isLoading,
    data,
    showKYCModal,
    setShowKYCModal,
    kycLoading,
    kycSuccess,
    kycError,
    handleKYCSubmit,
    virtualAccountLoading,
    virtualAccountData,
    handleCreateVirtualAccount,
  };
};