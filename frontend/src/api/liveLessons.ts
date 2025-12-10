import apiClient from './client';
import type { LiveLessonRequest, AssignedLesson, CreateLessonRequestRequest, UpdateRequestStatusRequest } from '../types';

export const liveLessonsApi = {
  createRequest: async (data: CreateLessonRequestRequest): Promise<LiveLessonRequest> => {
    const response = await apiClient.post<LiveLessonRequest>('/live-lessons/requests', data);
    return response.data;
  },

  getMyRequests: async (): Promise<LiveLessonRequest[]> => {
    const response = await apiClient.get<LiveLessonRequest[]>('/live-lessons/my-requests');
    return response.data;
  },

  getAssignedLessons: async (): Promise<AssignedLesson[]> => {
    const response = await apiClient.get<AssignedLesson[]>('/live-lessons/assigned');
    return response.data;
  },

  updateStatus: async (id: number, data: UpdateRequestStatusRequest): Promise<LiveLessonRequest> => {
    const response = await apiClient.patch<LiveLessonRequest>(`/live-lessons/requests/${id}/status`, data);
    return response.data;
  },
};
