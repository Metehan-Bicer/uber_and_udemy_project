import apiClient from './client';
import type { PaymentIntentResponse, CreatePaymentIntentRequest, ConfirmPurchaseRequest, Purchase } from '../types';

export const purchasesApi = {
  createPaymentIntent: async (data: CreatePaymentIntentRequest): Promise<PaymentIntentResponse> => {
    const response = await apiClient.post<PaymentIntentResponse>('/purchases/create-payment-intent', data);
    return response.data;
  },

  confirmPurchase: async (data: ConfirmPurchaseRequest): Promise<Purchase> => {
    const response = await apiClient.post<Purchase>('/purchases/confirm', data);
    return response.data;
  },

  getMyPurchases: async (): Promise<Purchase[]> => {
    const response = await apiClient.get<Purchase[]>('/purchases/my-purchases');
    return response.data;
  },
};
