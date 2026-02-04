export interface DocMasonApiConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Array<{
    msg: string;
    param?: string;
    location?: string;
  }>;
}