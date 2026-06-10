// API configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

// Type definitions matching backend DTOs
export interface RegisterRequest {
  email: string;
  username: string;
  name: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface Session {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

// Helper function for making authenticated requests
async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = localStorage.getItem('accessToken');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add custom headers from options
  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers[key] = value;
      }
    });
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  return response;
}

// Helper to handle API errors
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      statusCode: response.status,
      message: response.statusText,
    }));
    throw error;
  }

  return response.json();
}

// Authentication API methods
export const authApi = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  /**
   * Refresh access token using refresh token
   */
  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const response = await fetchWithAuth('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    return handleResponse<RefreshResponse>(response);
  },

  /**
   * Logout from current session
   */
  async logout(): Promise<{ message: string }> {
    const response = await fetchWithAuth('/auth/logout', {
      method: 'POST',
    });
    return handleResponse<{ message: string }>(response);
  },

  /**
   * Logout from all sessions
   */
  async logoutAll(): Promise<{ message: string }> {
    const response = await fetchWithAuth('/auth/logout-all', {
      method: 'DELETE',
    });
    return handleResponse<{ message: string }>(response);
  },

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<User> {
    const response = await fetchWithAuth('/auth/me');
    return handleResponse<User>(response);
  },

  /**
   * Get all active sessions
   */
  async getSessions(): Promise<{ sessions: Session[] }> {
    const response = await fetchWithAuth('/auth/sessions');
    return handleResponse<{ sessions: Session[] }>(response);
  },
};
