// Enums
export enum UserRole {
  User = 0,
  Instructor = 1,
  Admin = 2
}

export enum RequestStatus {
  Pending = 0,
  Assigned = 1,
  Completed = 2,
  Cancelled = 3
}

export enum PurchaseStatus {
  Pending = 0,
  Completed = 1,
  Failed = 2,
  Refunded = 3
}

export enum NotificationType {
  LessonAssignment = 0,
  PurchaseConfirmation = 1,
  LessonCompleted = 2,
  General = 3
}

// Auth Types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// Course Types
export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  instructor: Instructor;
}

export interface CourseListItem {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
  instructorName: string;
}

export interface Instructor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface PaginatedCourses {
  items: CourseListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export interface UpdateCourseRequest {
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
}

// Purchase Types
export interface Purchase {
  id: number;
  userId: number;
  courseId: number;
  courseTitle: string;
  amount: number;
  stripePaymentIntentId: string | null;
  status: PurchaseStatus;
  purchasedAt: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface CreatePaymentIntentRequest {
  courseId: number;
}

export interface ConfirmPurchaseRequest {
  paymentIntentId: string;
}

// Live Lesson Types
export interface LiveLessonRequest {
  id: number;
  userId: number;
  topic: string;
  description: string;
  preferredDate: string | null;
  duration: number;
  status: RequestStatus;
  createdAt: string;
  assignment: InstructorAssignment | null;
}

export interface InstructorAssignment {
  id: number;
  requestId: number;
  instructorId: number;
  instructorName: string;
  instructorEmail: string;
  matchScore: number;
  assignedAt: string;
  status: RequestStatus;
}

export interface AssignedLesson {
  id: number;
  requestId: number;
  topic: string;
  description: string;
  preferredDate: string | null;
  duration: number;
  studentName: string;
  studentEmail: string;
  matchScore: number;
  status: RequestStatus;
  assignedAt: string;
}

export interface CreateLessonRequestRequest {
  topic: string;
  description: string;
  preferredDate?: string;
  duration: number;
}

export interface UpdateRequestStatusRequest {
  status: RequestStatus;
}

// Notification Types
export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// API Result wrapper
export interface ApiResult<T> {
  isSuccess: boolean;
  data?: T;
  error?: string;
  validationErrors?: Record<string, string[]>;
}
