import { useState, useEffect } from 'react';
import { escrowService } from '@/services/escrowService';
import { useAppSelector } from '@/store';

export interface EscrowItem {
  id: string;
  category: 'Employment' | 'Purchase' | 'Instalment';
  status: 'Funded' | 'Awaiting Confirmation' | 'Disputed' | 'Released' | 'Completed';
  userName: string;
  userAvatar: string;
  ajoScore: number;
  scoreTier: string;
  title: string;
  amount: number;
  createdAt: string;
  actionLabel: string;
}

export const useEscrows = () => {
  const [activeFilter, setActiveFilter] = useState('All Escrows');
  const [searchQuery, setSearchQuery] = useState('');

  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.user_id || (typeof window !== 'undefined' ? localStorage.getItem('userId') : null);
  
  const [escrows, setEscrows] = useState<EscrowItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEscrows = async () => {
      if (!userId) return;
      setIsLoading(true);
      try {
        const response = await escrowService.getUserEscrows(userId, {
          type: 'payment',
          status: 'pending_funding'
        });

        if (response.success && response.data && Array.isArray(response.data.escrows)) {
          const mapped: EscrowItem[] = response.data.escrows.map((item: any) => ({
            id: item.escrow_id,
            category: item.type === 'payment' ? 'Purchase' : (item.type || 'Purchase'), // Mapping 'payment' to our UI category
            status: item.status === 'pending_funding' ? 'Funded' : (item.status || 'Funded'), // Simple mapping for now
            userName: item.counterparty_name || 'Counterparty',
            userAvatar: `https://i.pravatar.cc/150?u=${item.escrow_id}`, // Using escrow_id as seed for avatar
            ajoScore: item.counterparty_score || 0,
            scoreTier: item.counterparty_score >= 700 ? 'Gold Tier' : item.counterparty_score >= 500 ? 'Silver Tier' : 'Bronze Tier',
            title: item.description || 'No Description',
            amount: parseFloat(item.amount) || 0,
            createdAt: new Date(item.created_at).toLocaleDateString(),
            actionLabel: 'View Details'
          }));
          setEscrows(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch escrows', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEscrows();
  }, [userId, activeFilter]);

  return {
    escrows,
    isLoading,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery
  };
};
