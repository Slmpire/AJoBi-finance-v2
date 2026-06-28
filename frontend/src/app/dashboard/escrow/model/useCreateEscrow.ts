import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import { escrowService, CreateEscrowPayload } from '@/services/escrowService';

export const useCreateEscrow = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.user_id || (typeof window !== 'undefined' ? localStorage.getItem('userId') : null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<CreateEscrowPayload, 'creator_id'>>({
    type: 'Purchase',
    counterparty_id: '',
    amount: 0,
    description: '',
    expected_completion_date: '',
    listing_id: ''
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const payload: CreateEscrowPayload = {
        ...formData,
        creator_id: userId
      };
      
      const response = await escrowService.createEscrow(payload);
      
      if (response.status && response.data?.escrow_id) {
        // Automatically generate escrow virtual account immediately after creation
        try {
          await escrowService.generateVirtualAccount(response.data.escrow_id);
          console.log('Escrow virtual account generated successfully');
        } catch (vaError) {
          console.error('Failed to generate escrow virtual account', vaError);
        }
        
        // Redirect to the new escrow details or list
        router.push('/dashboard/escrow');
      }
    } catch (err: any) {
      console.error('Escrow creation failed', err);
      setError(err.message || 'Failed to create escrow');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    updateField,
    isLoading,
    error,
    handleSubmit
  };
};
