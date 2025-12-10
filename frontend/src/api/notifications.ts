import apiClient from './client';
import type { Notification } from '../types';

export const notificationsApi = {
  getAll: async (isRead?: boolean): Promise<Notification[]> => {
    const params = isRead !== undefined ? `?isRead=${isRead}` : '';
    const response = await apiClient.get<Notification[]>(`/notifications${params}`);
    return response.data;
  },

  markAsRead: async (id: number): Promise<boolean> => {
    const response = await apiClient.patch<boolean>(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<boolean> => {
    const response = await apiClient.patch<boolean>('/notifications/read-all');
    return response.data;
  },
};
