const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ResumeData {
  personal_info: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
  };
  experiences: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    location: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: string[];
  languages: string[];
  projects: string[];
}

export interface GenerateResumeRequest extends ResumeData {
  style: 'german' | 'international';
  language: 'en' | 'de';
  tone: 'conservative' | 'balanced' | 'dynamic';
}

export interface GenerateResumeResponse {
  success: boolean;
  data?: {
    id?: number;
    content: string;
    enhanced_data?: any;
    language: string;
    style: string;
    fallback: boolean;
    ai_generated?: boolean;
  };
  message?: string;
  error?: string;
}

export interface GenerateCoverLetterRequest {
  resume_data: ResumeData;
  job_description: string;
  language: 'en' | 'de';
}

export interface GenerateCoverLetterResponse {
  success: boolean;
  data?: {
    content: string;
    language: string;
    fallback: boolean;
  };
  message?: string;
  error?: string;
}

export interface User {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  created_at: string;
  updated_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token: string;
    token_type: string;
  };
  error?: string;
  errors?: any;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  password_confirmation: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Try to get the actual error message from the response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('API Error Response:', errorData);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
          if (errorData.errors) {
            console.error('Validation Errors:', errorData.errors);
            errorMessage += ` - Validation errors: ${JSON.stringify(errorData.errors)}`;
          }
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async generateResume(data: GenerateResumeRequest): Promise<GenerateResumeResponse> {
    return this.request<GenerateResumeResponse>('/resumes/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateCoverLetter(data: GenerateCoverLetterRequest): Promise<GenerateCoverLetterResponse> {
    return this.request<GenerateCoverLetterResponse>('/resumes/cover-letter', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async exportPdf(data: any): Promise<Blob> {
    const url = `${API_BASE_URL}/resumes/export-pdf`;
    
    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/pdf',
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = `${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      return await response.blob();
    } catch (error) {
      console.error('PDF export failed:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<{ status: string; timestamp: string; service: string }> {
    return this.request<{ status: string; timestamp: string; service: string }>('/health');
  }

  // Future authentication methods
  async getUserResumes(token: string): Promise<any> {
    return this.request('/resumes', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getResume(id: number, token: string): Promise<any> {
    return this.request(`/resumes/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async deleteResume(id: number, token: string): Promise<any> {
    return this.request(`/resumes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async translateResume(id: number, targetLanguage: 'en' | 'de', token: string): Promise<any> {
    return this.request(`/resumes/${id}/translate`, {
      method: 'POST',
      body: JSON.stringify({ target_language: targetLanguage }),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log('Registration data being sent:', userData);
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(token: string): Promise<{ success: boolean; message?: string }> {
    return this.request('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getProfile(token: string): Promise<{ success: boolean; data?: { user: User }; message?: string }> {
    return this.request('/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateProfile(userData: Partial<User>, token: string): Promise<AuthResponse> {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async changePassword(passwordData: { current_password: string; password: string; password_confirmation: string }, token: string): Promise<{ success: boolean; message?: string }> {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async refreshToken(token: string): Promise<{ success: boolean; data?: { token: string; token_type: string }; message?: string }> {
    return this.request('/auth/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

export const apiService = new ApiService();
