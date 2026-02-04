import { BaseApi } from '../BaseApi';
import {
  TemplateRequestDto,
  CreateTemplateRequestDto,
  PatchTemplateRequestDto,
  TemplateRequestStatsDto,
  TemplateRequestListResponse,
  TemplateRequestResponse,
  CreateTemplateRequestResponse,
  UpdateTemplateRequestResponse,
  DeleteTemplateRequestResponse,
} from '../interfaces/TemplateRequestInterfaces';

export class TemplateRequestApi extends BaseApi {
  /**
   * Create a new template request
   */
  async create(params: CreateTemplateRequestDto): Promise<CreateTemplateRequestResponse> {
    return this.makeRequest<CreateTemplateRequestResponse>('/template-request', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get a specific template request by GUID
   */
  async get(templateRequestGuid: string): Promise<TemplateRequestResponse> {
    const queryString = this.buildQueryParams({ TemplateRequest_guid: templateRequestGuid });
    return this.makeRequest<TemplateRequestResponse>(`/template-request?${queryString}`, {
      method: 'GET',
    });
  }

  /**
   * List template requests with pagination
   */
  async list(params: {
    templateRequestName?: string;
    from: number;
    to: number;
  }): Promise<TemplateRequestListResponse> {
    const queryParams: Record<string, any> = {
      from: params.from,
      to: params.to,
    };

    if (params.templateRequestName) {
      queryParams.TemplateRequest_Name = params.templateRequestName;
    }

    const queryString = this.buildQueryParams(queryParams);
    return this.makeRequest<TemplateRequestListResponse>(`/template-request/list?${queryString}`, {
      method: 'GET',
    });
  }

  /**
   * Update a template request
   */
  async update(templateRequestGuid: string, updates: PatchTemplateRequestDto): Promise<UpdateTemplateRequestResponse> {
    const queryString = this.buildQueryParams({ TemplateRequest_guid: templateRequestGuid });
    return this.makeRequest<UpdateTemplateRequestResponse>(`/template-request?${queryString}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Delete a template request
   */
  async delete(templateRequestGuid: string): Promise<DeleteTemplateRequestResponse> {
    const queryString = this.buildQueryParams({ TemplateRequest_guid: templateRequestGuid });
    return this.makeRequest<DeleteTemplateRequestResponse>(`/template-request?${queryString}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get template request statistics
   */
  async getStats(params: {
    startDate: string; // ISO date string
    endDate: string;   // ISO date string
  }): Promise<TemplateRequestStatsDto> {
    const queryString = this.buildQueryParams({
      startDate: params.startDate,
      endDate: params.endDate,
    });
    return this.makeRequest<TemplateRequestStatsDto>(`/template-request/stats?${queryString}`, {
      method: 'GET',
    });
  }
}