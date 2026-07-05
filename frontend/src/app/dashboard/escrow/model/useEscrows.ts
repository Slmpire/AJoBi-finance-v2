import { useState, useEffect } from 'react';
import { escrowService } from '@/services/escrowService';
import { useAppSelector } from '@/store';

export interface EscrowItem {
  id: string;
  category: 'Employment' | 'Purchase' | 'Instalment';
  status: 'Funded' | 'Awaiting Confirmation' | 'Disputed' | 'Released' | 'Completed' | 'Awaiting Payment';
  userName: string;
  userAvatar: string;
  ajoScore: number;
  scoreTier: string;
  title: string;
  amount: number;
  createdAt: string;
  actionLabel: string;
}

function mapStatus(status: string): EscrowItem['status'] {
  const map: Record<string, EscrowItem['status']> = {
    awaiting_payment: 'Awaiting Payment',
    funded: 'Funded',
    awaiting_confirmation: 'Awaiting Confirmation',
    released: 'Released',
    disputed: 'Disputed',
    refunded: 'Released',
  };
  return map[status] || 'Awaiting Payment';
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
        const response = await escrowService.getMyEscrows();

        if (response.status && response.data && Array.isArray(response.data)) {
          const mapped: EscrowItem[] = response.data.map((item: any) => ({
            id: String(item.id),
            category: 'Purchase',
            status: mapStatus(item.status),
            userName: item.creator_name || item.recipient_name || 'Counterparty',
            userAvatar: `https://i.pravatar.cc/150?u=${item.id}`,
            ajoScore: 0,
            scoreTier: 'Starter',
            title: item.description || 'Escrow transaction',
            amount: parseFloat(item.amount) || 0,
            createdAt: new Date(item.created_at).toLocaleDateString(),
            actionLabel: 'View Details',
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

  const filteredEscrows = escrows.filter(e => {
    if (activeFilter === 'All Escrows') return true;
    if (activeFilter === 'As Buyer / Employer') return true;
    if (activeFilter === 'As Seller / Worker') return true;
    if (activeFilter === 'Completed') return e.status === 'Released';
    if (activeFilter === 'Disputed') return e.status === 'Disputed';
    return true;
  }).filter(e =>
    searchQuery === '' ||
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    escrows: filteredEscrows,
    isLoading,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
  };
};