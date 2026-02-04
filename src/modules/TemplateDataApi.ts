import { BaseApi } from '../BaseApi';
import {
  TemplateDataDto,
  FullTemplateDataDto,
  CreateTemplateDataDto,
  PatchTemplateDataDto,
  TemplateDataResponse,
  TemplateDataListResponse,
  CreateTemplateDataResponse,
  UpdateTemplateDataResponse,
  DeleteTemplateDataResponse,
  ValidateTemplateDataResponse,
} from '../interfaces/TemplateDataInterfaces';

export class TemplateDataApi extends BaseApi {
  /**
   * Create new template data
   */
  async create(params: CreateTemplateDataDto): Promise<CreateTemplateDataResponse> {
    return this.makeRequest<CreateTemplateDataResponse>('/template-data', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get a specific template data by GUID
   */
  async get(templateDataGuid: string): Promise<TemplateDataResponse> {
    const queryString = this.buildQueryParams({ TemplateData_guid: templateDataGuid });
    return this.makeRequest<TemplateDataResponse>(`/template-data?${queryString}`, {
      method: 'GET',
    });
  }

  /**
   * List template data for a specific template
   */
  async list(params: {
    templateGuid: string;
    templateDataName?: string;
    from: number;
    to: number;
  }): Promise<TemplateDataListResponse> {
    const queryParams: Record<string, any> = {
      Template_guid: params.templateGuid,
      from: params.from,
      to: params.to,
    };

    if (params.templateDataName) {
      queryParams.TemplateData_Name = params.templateDataName;
    }

    const queryString = this.buildQueryParams(queryParams);
    return this.makeRequest<TemplateDataListResponse>(`/template-data/list?${queryString}`, {
      method: 'GET',
    });
  }

  /**
   * Update template data
   */
  async update(templateDataGuid: string, updates: PatchTemplateDataDto): Promise<UpdateTemplateDataResponse> {
    const queryString = this.buildQueryParams({ TemplateData_guid: templateDataGuid });
    return this.makeRequest<UpdateTemplateDataResponse>(`/template-data?${queryString}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Delete template data
   */
  async delete(templateDataGuid: string): Promise<DeleteTemplateDataResponse> {
    const queryString = this.buildQueryParams({ TemplateData_guid: templateDataGuid });
    return this.makeRequest<DeleteTemplateDataResponse>(`/template-data?${queryString}`, {
      method: 'DELETE',
    });
  }

  /**
   * Validate template data interface and data compatibility
   */
  async validate(params: {
    TemplateData_Interface: string;
    TemplateData_Data: string;
  }): Promise<ValidateTemplateDataResponse> {
    return this.makeRequest<ValidateTemplateDataResponse>('/template-data/validate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Apply template data to a template (compile with data)
   */
  async apply(params: {
    Template_guid: string;
    TemplateData_guid: string;
  }): Promise<string> {
    return this.makeRequest<string>('/template-data/apply', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Apply template data and generate PDF
   */
  async applyAndGeneratePdf(params: {
    Template_guid: string;
    TemplateData_guid: string;
  }): Promise<ArrayBuffer> {
    return this.makeRequest<ArrayBuffer>('/template-data/apply/pdf', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
}