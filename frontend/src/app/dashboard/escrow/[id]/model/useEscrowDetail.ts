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
  checkoutLink: string;
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

function mapStatus(status: string) {
  const map: Record<string, string> = {
    awaiting_payment: 'Awaiting Payment',
    funded: 'Funded',
    awaiting_confirmation: 'Awaiting Confirmation',
    released: 'Completed',
    disputed: 'Disputed',
    refunded: 'Refunded',
  };
  return map[status] || status;
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

      if (response.status && response.data) {
        const data = response.data;

        setEscrow({
          id: String(data.id),
          type: 'Escrow',
          status: mapStatus(data.status),
          amount: parseFloat(data.amount) || 0,
          description: data.description || 'No description',
          expectedCompletionDate: 'N/A',
          createdAt: data.created_at
            ? new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'N/A',
          paymentReference: data.payment_code || data.nomba_reference || 'N/A',
          checkoutLink: data.nomba_checkout_link || '#',
          trustScore: 70,
          trustVerdict: 'Protected',
          trustReason: 'This transaction is secured by AjoBI escrow. Funds are only released when both parties confirm.',
          confirmationStatus: {
            creatorConfirmed: !!data.creator_confirmed,
            counterpartyConfirmed: !!data.recipient_confirmed,
            bothConfirmed: !!(data.creator_confirmed && data.recipient_confirmed),
          },
          disputeRaised: data.status === 'disputed',
          counterparty: {
            id: String(data.recipient_user_id || 'N/A'),
            name: data.recipient_name || data.creator_name || 'Counterparty',
            ajoScore: 0,
            scoreTier: 'Starter',
          },
          virtualAccount: undefined,
        });
      } else {
        setError('Escrow not found or could not be loaded');
      }
    } catch (err: any) {
      console.error('Failed to fetch escrow detail:', err);
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
      const response = await escrowService.generateVirtualAccount
        ? await (escrowService as any).generateVirtualAccount(escrowId)
        : await fetch(`/api/escrow/${escrowId}/virtual-account`, { method: 'POST' }).then(r => r.json());

      if (response.status && response.data) {
        setEscrow(prev => prev ? {
          ...prev,
          virtualAccount: {
            bankName: response.data.bank_name || 'Nomba MFB',
            accountNumber: response.data.account_number,
            accountName: response.data.account_name || 'AjoBI Escrow',
          }
        } : null);
      }
    } catch (err: any) {
      console.error('Failed to create virtual account', err);
    } finally {
      setIsCreatingVA(false);
    }
  };

  return {
    isLoading,
    escrow,
    error,
    isCreatingVA,
    handleCreateVirtualAccount,
  };
};