import { fetch } from './fetch';
import { DocMasonApiConfig, ApiError } from './types';

export class BaseApi {
  protected config: DocMasonApiConfig;

  constructor(config: DocMasonApiConfig) {
    this.config = {
      baseUrl: 'https://api.docmason.com/api/v1', // Default production URL
      ...config,
    };

    if (!this.config.apiKey) {
      throw new Error('API key is required');
    }
  }

  protected async makeRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errors: any[] = [];
        
        try {
          const errorData = await response.json() as any;
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errors = errorData.errors;
            errorMessage = errorData.errors[0]?.msg || errorMessage;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // If JSON parsing fails, stick with the basic error message
        }

        const apiError: ApiError = {
          message: errorMessage,
          status: response.status,
          errors: errors.length > 0 ? errors : undefined,
        };
        
        throw apiError;
      }

      const contentType = response.headers.get('content-type');
      
      // Handle different response types
      if (contentType?.includes('application/json')) {
        return response.json() as T;
      } else if (contentType?.includes('text/')) {
        return response.text() as any;
      } else if (contentType?.includes('application/pdf') || contentType?.includes('application/octet-stream')) {
        // For PDF or binary data, return as ArrayBuffer for Node.js compatibility
        return response.arrayBuffer() as any;
      } else {
        return response.json() as T;
      }
    } catch (error: any) {
      if (error.message && error.status) {
        // Already an ApiError, rethrow
        throw error;
      }
      
      // Network or other error
      throw {
        message: error.message || 'Network error occurred',
        status: 0,
      } as ApiError;
    }
  }

  protected buildQueryParams(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    
    return searchParams.toString();
  }
}