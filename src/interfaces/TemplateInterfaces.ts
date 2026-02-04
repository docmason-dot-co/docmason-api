// Template interfaces
export interface TemplateDto {
  Template_guid: string;
  Template_Name: string | null;
  Template_CreatedAt: string;
  User_id: number;
  Template_MarginLeft: string;
  Template_MarginRight: string;
  Template_MarginTop: string;
  Template_MarginBottom: string;
  Template_Width: string;
  Template_Height: string;
}

export interface TemplateWithContentDto extends TemplateDto {
  content: string;
}

export interface CreateTemplateDto {
  Template_Name: string;
  content?: string; // Optional initial HTML content
  Template_MarginLeft?: string;
  Template_MarginRight?: string;
  Template_MarginTop?: string;
  Template_MarginBottom?: string;
  Template_Width?: string;
  Template_Height?: string;
}

export interface TemplateListResponse {
  templates: TemplateDto[];
  pagination: {
    from: number;
    to: number;
    total: number;
    returned: number;
  };
  limits: {
    current: number;
    limit: number;
    userType: string;
  };
}

export interface TemplateResponse {
  template: TemplateWithContentDto;
}

export interface CreateTemplateResponse {
  message: string;
  template: TemplateWithContentDto;
  limits: {
    current: number;
    limit: number;
    userType: string;
  };
}

export interface UpdateTemplateResponse {
  message: string;
  template: TemplateWithContentDto;
}

export interface DeleteTemplateResponse {
  message: string;
}

export interface AssetUploadResponse {
  message: string;
  assetName: string;
  templateGuid: string;
}