import { BaseApi } from '../BaseApi';
import { FullUserDto } from '../interfaces/UserInterfaces';

export class UserApi extends BaseApi {
  /**
   * Create a new user
   */
  async create(params: {
    User_Name: string;
    User_Email: string;
    User_Password: string;
    User_TermsOfService: string;
  }): Promise<Response> {
    // This returns Response for compatibility with frontend code
    const response = await this.makeRequest('/user/create', {
      method: 'POST',
      body: JSON.stringify({
        User_Name: params.User_Name,
        User_Email: params.User_Email,
        User_Password: params.User_Password,
        User_TermsOfService: params.User_TermsOfService,
      }),
    });
    
    // Wrap in Response-like object for compatibility
    return {
      ok: true,
      status: 200,
      json: async () => response,
    } as Response;
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(params: { User_Email: string }): Promise<Response> {
    const response = await this.makeRequest('/user/resend-verification', {
      method: 'POST',
      body: JSON.stringify({
        User_Email: params.User_Email,
      }),
    });
    
    // Wrap in Response-like object for compatibility
    return {
      ok: true,
      status: 200,
      json: async () => response,
    } as Response;
  }

  /**
   * Get the current user's full profile including email
   */
  async getFullProfile(): Promise<FullUserDto> {
    return this.makeRequest<FullUserDto>('/user/profile', {
      method: 'GET',
    });
  }
}