import apiClient from './client';
import type { Course, PaginatedCourses, CreateCourseRequest, UpdateCourseRequest, CourseListItem } from '../types';

export const coursesApi = {
  getAll: async (page: number = 1, pageSize: number = 10, search?: string): Promise<PaginatedCourses> => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(search && { search }),
    });
    const response = await apiClient.get<PaginatedCourses>(`/courses?${params}`);
    return response.data;
  },

  getById: async (id: number): Promise<Course> => {
    const response = await apiClient.get<Course>(`/courses/${id}`);
    return response.data;
  },

  getMyCourses: async (): Promise<CourseListItem[]> => {
    const response = await apiClient.get<CourseListItem[]>('/courses/my-courses');
    return response.data;
  },

  create: async (data: CreateCourseRequest): Promise<Course> => {
    const response = await apiClient.post<Course>('/courses', data);
    return response.data;
  },

  update: async (id: number, data: UpdateCourseRequest): Promise<Course> => {
    const response = await apiClient.put<Course>(`/courses/${id}`, data);
    return response.data;
  },
};
