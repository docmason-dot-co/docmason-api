export default interface TemplateDataDto {
  TemplateData_guid: string;
  TemplateData_Name: string | null;
  TemplateData_CreatedAt: string;
  TemplateData_UpdatedAt: string;
}

export interface FullTemplateDataDto extends TemplateDataDto {
  TemplateData_Data: string | null;
  TemplateData_Interface: string | null;
}