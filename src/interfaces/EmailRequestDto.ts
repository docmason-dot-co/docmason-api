export default interface EmailRequestDto {
  EmailRequest_guid: string;
  EmailRequest_CreatedAt: string;
  EmailRequest_Name: string;
  EmailRequest_Recipient: string;
  EmailRequest_Subject: string;
  EmailRequest_Status: string;
}

export interface EmailRequestStatsDto {
  startDate: string;
  endDate: string;
  totalRequests: number;
  totalEmails: number;
  EmailTemplates: {
    EmailTemplate: {
      EmailTemplate_Name: string;
      EmailTemplate_guid: string;
    };
    totalRequests: number;
    totalEmails: number;
  }[];
}