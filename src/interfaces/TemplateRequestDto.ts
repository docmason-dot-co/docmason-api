export default interface TemplateRequestDto {
  TemplateRequest_guid: string;
  TemplateRequest_CreatedAt: string;
  TemplateRequest_Name: string;
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