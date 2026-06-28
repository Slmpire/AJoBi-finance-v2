import { useState, useEffect } from 'react';
import { escrowService } from '@/services/escrowService';

export interface EscrowDetailData {
  id: string;
  type: string;
  status: string;
  amount: number;
  description: string;
  expectedCompletionDate: string;
  createdAt: string;
  paymentReference: string;
  squadPaymentLink: string;
  trustScore: number;
  trustVerdict: string;
  trustReason: string;
  confirmationStatus: {
    creatorConfirmed: boolean;
    counterpartyConfirmed: boolean;
    bothConfirmed: boolean;
  };
  disputeRaised: boolean;
  counterparty: {
    id: string;
    name: string;
    ajoScore: number;
    scoreTier: string;
  };
  virtualAccount?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export const useEscrowDetail = (escrowId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [escrow, setEscrow] = useState<EscrowDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingVA, setIsCreatingVA] = useState(false);

  const fetchDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await escrowService.getEscrowDetail(escrowId);
        console.log('Escrow Detail Response:', response);
        if (response.success && response.data) {
          const data = response.data;
          console.log('Mapping Escrow Data:', data);
          setEscrow({
            id: data.escrow_id,
            type: data.type,
            status: data.status,
            amount: parseFloat(data.amount) || 0,
            description: data.description,
            expectedCompletionDate: data.expected_completion_date ? new Date(data.expected_completion_date).toLocaleDateString() : 'N/A',
            createdAt: new Date(data.created_at).toLocaleDateString(),
            paymentReference: data.payment_reference || 'N/A',
            squadPaymentLink: data.squad_payment_link || '#',
            trustScore: data.trust_score || 0,
            trustVerdict: data.trust_verdict || (data.trust_score >= 70 ? 'High Trust' : 'Medium Trust'),
            trustReason: data.trust_reason || "Evaluated using AjoScore transparency protocols",
            confirmationStatus: {
              creatorConfirmed: !!data.confirmation_status?.creator_confirmed,
              counterpartyConfirmed: !!data.confirmation_status?.counterparty_confirmed,
              bothConfirmed: !!data.confirmation_status?.both_confirmed
            },
            disputeRaised: !!data.dispute_raised,
            counterparty: {
              id: data.counterparty?.user_id || 'N/A',
              name: data.counterparty?.name || 'Counterparty',
              ajoScore: data.counterparty?.ajo_score || 0,
              scoreTier: (data.counterparty?.ajo_score || 0) >= 70 ? 'Gold' : (data.counterparty?.ajo_score || 0) >= 50 ? 'Silver' : 'Bronze'
            },
            virtualAccount: data.virtual_account ? {
              bankName: data.virtual_account.bank_name || 'Squad Bank',
              accountNumber: data.virtual_account.account_number,
              accountName: data.virtual_account.account_name
            } : undefined
          });
        }
      } catch (err: any) {
        console.error('Failed to fetch escrow detail. Full error:', err);
        setError(err.message || 'Failed to load escrow details');
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    if (escrowId) {
      fetchDetail();
    }
  }, [escrowId]);

  const handleCreateVirtualAccount = async () => {
    if (!escrowId) return;
    setIsCreatingVA(true);
    try {
      const response = await escrowService.generateVirtualAccount(escrowId);
      if (response.status === 'success') {
        // Refresh details to get the new virtual account
        await fetchDetail();
      }
    } catch (err: any) {
      console.error('Failed to create virtual account', err);
      setError(err.message || 'Failed to generate virtual account');
    } finally {
      setIsCreatingVA(false);
    }
  };

  return {
    isLoading,
    escrow,
    error,
    isCreatingVA,
    handleCreateVirtualAccount
  };
};
