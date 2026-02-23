export default interface TemplateDto {
  Template_guid: string;
  Template_Name: string | null;
  Template_CreatedAt: string;
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
  User_guid: string;
  content?: string; // Optional initial HTML content
  Template_MarginLeft?: string;
  Template_MarginRight?: string;
  Template_MarginTop?: string;
  Template_MarginBottom?: string;
  Template_Width?: string;
  Template_Height?: string;
}