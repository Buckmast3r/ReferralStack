import { useState } from 'react';
import { paymentService } from '../services/paymentService';

export function usePayments() {
  const [processing, setProcessing] = useState(false);

  const upgradeToPro = async () => {
    setProcessing(true);
    try {
      await paymentService.createCheckoutSession();
    } finally {
      setProcessing(false);
    }
  };

  return { upgradeToPro, processing };
}