import { useState } from 'react';
import { useAppSelector } from '@/store';
import { escrowService } from '@/services/escrowService';

export const useCreateEscrow = () => {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.user_id || (typeof window !== 'undefined' ? localStorage.getItem('userId') : null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<any>(null); // holds the full response after creation

  const [formData, setFormData] = useState({
    amount: 0,
    description: '',
    recipient_email: '',
    recipient_phone: '',
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!userId) return;
    if (!formData.amount || !formData.description) {
      setError('Amount and description are required');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await escrowService.createEscrow({
        amount: formData.amount,
        description: formData.description,
        recipient_email: formData.recipient_email || undefined,
        recipient_phone: formData.recipient_phone || undefined,
      });

      if (response.status && response.data) {
        setCreated(response.data);
      } else {
        setError(response.message || 'Failed to create escrow');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create escrow');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setCreated(null);
    setFormData({ amount: 0, description: '', recipient_email: '', recipient_phone: '' });
  };

  return {
    formData,
    updateField,
    isLoading,
    error,
    handleSubmit,
    created,
    reset,
  };
};