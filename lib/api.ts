import * as SecureStore from 'expo-secure-store';

// Update this to your backend URL
// For Android emulator use: http://10.0.2.2:3000/api
// For iOS simulator use: http://localhost:3000/api
// For physical device use your computer's IP: http://192.168.1.13:3000/api
const API_URL = 'http://192.168.1.13:3000/api';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('token');
    } catch {
      return null;
    }
  }

  async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync('token', token);
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  }

  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('token');
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = await this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient(API_URL);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post<{
      success: boolean;
      token: string;
      student: {
        id: string;
        studentId: string;
        name: string;
        email: string;
        course: string;
        year: number;
        section: string;
      };
    }>('/student/auth/login', { email, password });

    if (response.success && response.data?.token) {
      await api.setToken(response.data.token);
    }

    return response;
  },

  logout: async () => {
    await api.removeToken();
    return { success: true };
  },

  getProfile: async () => {
    return api.get<{
      success: boolean;
      student: {
        id: string;
        studentId: string;
        name: string;
        email: string;
        course: string;
        year: number;
        section: string;
      };
    }>('/student/auth/me');
  },
};

// Attendance API
export const attendanceApi = {
  getHistory: async (page = 1, limit = 20) => {
    return api.get<{
      success: boolean;
      records: Array<{
        _id: string;
        date: string;
        status: 'present' | 'absent' | 'late';
        remarks?: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
      stats: {
        present: number;
        absent: number;
        late: number;
        total: number;
      };
    }>(`/student/attendance?page=${page}&limit=${limit}`);
  },
};

// Notifications API
export const notificationsApi = {
  getNotifications: async () => {
    return api.get<{
      success: boolean;
      notifications: Array<{
        _id: string;
        type: 'absence' | 'late' | 'general';
        title: string;
        message: string;
        read: boolean;
        createdAt: string;
      }>;
    }>('/student/notifications');
  },

  markAsRead: async (id: string) => {
    return api.put(`/student/notifications/${id}/read`, {});
  },
};
