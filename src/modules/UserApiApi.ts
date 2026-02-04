import { BaseApi } from '../BaseApi';
import {
  UserApiDto,
  CreateUserApiDto,
  UpdateUserApiDto,
  CreateUserApiResponse,
  ListUserApiResponse,
  GetUserApiResponse,
  UpdateUserApiResponse,
  DeleteUserApiResponse,
  VerifyUserApiResponse,
} from '../interfaces/UserApiInterfaces';

export class UserApiApi extends BaseApi {
  /**
   * Create a new API key
   */
  async create(params: CreateUserApiDto): Promise<CreateUserApiResponse> {
    return this.makeRequest<CreateUserApiResponse>('/userapi', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * List all API keys for the authenticated user
   */
  async list(): Promise<ListUserApiResponse> {
    return this.makeRequest<ListUserApiResponse>('/userapi/list', {
      method: 'GET',
    });
  }

  /**
   * Get a specific API key by GUID
   */
  async get(userApiGuid: string): Promise<GetUserApiResponse> {
    const queryString = this.buildQueryParams({ UserApi_guid: userApiGuid });
    return this.makeRequest<GetUserApiResponse>(`/userapi?${queryString}`, {
      method: 'GET',
    });
  }

  /**
   * Update an API key (enable/disable or change key)
   */
  async update(userApiGuid: string, params: UpdateUserApiDto): Promise<UpdateUserApiResponse> {
    const queryString = this.buildQueryParams({ UserApi_guid: userApiGuid });
    return this.makeRequest<UpdateUserApiResponse>(`/userapi?${queryString}`, {
      method: 'PATCH',
      body: JSON.stringify(params),
    });
  }

  /**
   * Delete (soft delete) an API key
   */
  async delete(userApiGuid: string): Promise<DeleteUserApiResponse> {
    const queryString = this.buildQueryParams({ UserApi_guid: userApiGuid });
    return this.makeRequest<DeleteUserApiResponse>(`/userapi?${queryString}`, {
      method: 'DELETE',
    });
  }

  /**
   * Verify an API key (public endpoint)
   */
  async verify(apiKey: string): Promise<VerifyUserApiResponse> {
    return this.makeRequest<VerifyUserApiResponse>('/userapi/verify', {
      method: 'POST',
      body: JSON.stringify({ UserApi_Key: apiKey }),
    });
  }
}