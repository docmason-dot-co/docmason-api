// TemplateData interfaces
export interface TemplateDataDto {
  TemplateData_guid: string;
  TemplateData_Name: string | null;
  TemplateData_CreatedAt: string;
  TemplateData_UpdatedAt: string;
  Template_id: number;
  User_id: number;
}

export interface FullTemplateDataDto extends TemplateDataDto {
  TemplateData_Data: string | null;
  TemplateData_Interface: string | null;
}

export interface CreateTemplateDataDto {
  TemplateData_Name: string;
  TemplateData_Interface: string;
  TemplateData_Data: string;
  Template_guid: string;
  User_guid: string;
}

export interface PatchTemplateDataDto {
  TemplateData_Name?: string;
  TemplateData_Interface?: string;
  TemplateData_Data?: string;
}

export interface TemplateDataResponse {
  templateData: FullTemplateDataDto;
}

export interface TemplateDataListResponse {
  templateData: FullTemplateDataDto[];
  pagination: {
    from: number;
    to: number;
    total: number;
    returned: number;
  };
  template: {
    Template_guid: string;
    Template_Name: string | null;
  };
}

export interface CreateTemplateDataResponse {
  message: string;
  templateData: FullTemplateDataDto;
}

export interface UpdateTemplateDataResponse {
  message: string;
  templateData: FullTemplateDataDto;
}

export interface DeleteTemplateDataResponse {
  message: string;
}

export interface ValidateTemplateDataResponse {
  message: string;
  validation: {
    interface: string;
    data: string;
  };
}