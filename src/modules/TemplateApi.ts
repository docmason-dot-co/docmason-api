import { BaseApi } from '../BaseApi';
import {
  TemplateDto,
  TemplateWithContentDto,
  CreateTemplateDto,
  TemplateListResponse,
  TemplateResponse,
  CreateTemplateResponse,
  UpdateTemplateResponse,
  DeleteTemplateResponse,
  AssetUploadResponse,
} from '../interfaces/TemplateInterfaces';

export class TemplateApi extends BaseApi {
  /**
   * Create a new template
   */
  async create(params: CreateTemplateDto): Promise<CreateTemplateResponse> {
    return this.makeRequest<CreateTemplateResponse>('/template', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get a specific template by GUID
   */
  async get(templateGuid: string): Promise<TemplateResponse> {
    const queryString = this.buildQueryParams({ Template_guid: templateGuid });
    return this.makeRequest<TemplateResponse>(`/template?${queryString}`, {
      method: 'GET',
    });
  }

  /**
   * Get paginated list of templates with optional name filtering
   */
  async list(params: {
    templateName?: string;
    from: number;
    to: number;
  }): Promise<TemplateListResponse> {
    const queryParams: Record<string, any> = {
      from: params.from,
      to: params.to,
    };

    if (params.templateName) {
      queryParams.Template_Name = params.templateName;
    }

    const queryString = this.buildQueryParams(queryParams);
    return this.makeRequest<TemplateListResponse>(`/template/list?${queryString}`, {
      method: 'GET',
    });
  }

  /**
   * Update a template's name and/or content
   */
  async update(
    templateGuid: string,
    updates: {
      Template_Name?: string;
      content?: string;
      Template_MarginLeft?: string;
      Template_MarginRight?: string;
      Template_MarginTop?: string;
      Template_MarginBottom?: string;
      Template_Width?: string;
      Template_Height?: string;
    }
  ): Promise<UpdateTemplateResponse> {
    const queryString = this.buildQueryParams({ Template_guid: templateGuid });
    return this.makeRequest<UpdateTemplateResponse>(`/template?${queryString}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Delete a template
   */
  async delete(templateGuid: string): Promise<DeleteTemplateResponse> {
    const queryString = this.buildQueryParams({ Template_guid: templateGuid });
    return this.makeRequest<DeleteTemplateResponse>(`/template?${queryString}`, {
      method: 'DELETE',
    });
  }

  /**
   * Preview template with data (returns HTML)
   */
  async preview(params: {
    Template_guid: string;
    data: any;
  }): Promise<string> {
    return this.makeRequest<string>('/template/preview', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Generate PDF from template with data
   * Returns ArrayBuffer for cross-platform compatibility
   */
  async generatePdf(params: {
    Template_guid: string;
    data: any;
  }): Promise<ArrayBuffer> {
    return this.makeRequest<ArrayBuffer>('/template/pdf', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Upload an asset (image, etc.) to a template
   * Note: In Node.js, you'll need to pass a Buffer or similar for assetData
   */
  async uploadAsset(
    templateGuid: string,
    assetName: string,
    assetData: File | Blob | Buffer | ArrayBuffer
  ): Promise<AssetUploadResponse> {
    const queryString = this.buildQueryParams({
      Template_guid: templateGuid,
      assetName: assetName,
    });

    return this.makeRequest<AssetUploadResponse>(`/template/upload-asset?${queryString}`, {
      method: 'POST',
      headers: {
        // Remove Content-Type to let the browser/fetch set it appropriately
        'Content-Type': undefined,
      } as any,
      body: assetData as any,
    });
  }

  /**
   * Convenience method to generate PDF and return as Buffer (Node.js) or Uint8Array (Browser)
   */
  async generatePdfBuffer(params: {
    Template_guid: string;
    data: any;
  }): Promise<Buffer | Uint8Array> {
    const arrayBuffer = await this.generatePdf(params);
    
    // Convert ArrayBuffer to appropriate type based on environment
    if (typeof Buffer !== 'undefined') {
      // Node.js environment
      return Buffer.from(arrayBuffer);
    } else {
      // Browser environment
      return new Uint8Array(arrayBuffer);
    }
  }
}