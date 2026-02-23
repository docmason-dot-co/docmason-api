export default interface EmailTemplateDto {
  EmailTemplate_guid: string;
  EmailTemplate_Name: string | null;
  EmailTemplate_CreatedAt: string;
}

export interface EmailTemplateWithContentDto extends EmailTemplateDto {
  content: string;
}

export interface CreateEmailTemplateDto {
  EmailTemplate_Name: string;
  User_guid: string;
  content?: string; // Optional initial HTML content
}