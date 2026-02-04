// TemplateRequest interfaces
export interface TemplateRequestDto {
  TemplateRequest_guid: string;
  TemplateRequest_CreatedAt: string;
  TemplateRequest_Name: string;
  User_id: number;
}

export interface CreateTemplateRequestDto {
  Template_guid: string;
}

export interface PatchTemplateRequestDto {
  TemplateRequest_CreatedAt?: string;
  TemplateRequest_Name?: string;
}

export interface TemplateRequestStatsDto {
  startDate: string;
  endDate: string;
  totalRequests: number;
  totalFileSize: number;
  Templates: {
    Template: {
      Template_Name: string;
      Template_guid: string;
    };
    totalRequests: number;
    totalFileSize: number;
  }[];
}

export interface TemplateRequestListResponse {
  templateRequests: TemplateRequestDto[];
  pagination: {
    from: number;
    to: number;
    total: number;
    returned: number;
  };
}

export interface TemplateRequestResponse {
  templateRequest: TemplateRequestDto;
}

export interface CreateTemplateRequestResponse {
  message: string;
  templateRequest: TemplateRequestDto;
}

export interface UpdateTemplateRequestResponse {
  message: string;
  templateRequest: TemplateRequestDto;
}

export interface DeleteTemplateRequestResponse {
  message: string;
  templateRequest: TemplateRequestDto;
}