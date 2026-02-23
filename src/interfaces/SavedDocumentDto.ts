import TemplateRequestDto from "./TemplateRequestDto";

export default interface SavedDocumentDto {
  SavedDocument_guid: string;
  SavedDocument_FileExtension: string;
  SavedDocument_Size: number;
  SavedDocument_CreatedAt: string;
  Template_guid: string | null;
  TemplateRequest_guid: string;
}

export interface SavedDocumentContextDto {
  SavedDocument: SavedDocumentDto;
  TemplateRequest: TemplateRequestDto;
}