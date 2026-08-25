export interface ParsedDocumentDto {
  ParsedDocument_guid: string;
  ParsedDocument_Name: string | null;
  ParsedDocument_Description: string | null;
  ParsedDocument_Interface: string | null;
  ParsedDocument_ExampleFile: string | null;
  ParsedDocument_CreatedAt: string;
  ParsedDocument_UpdatedAt: string;
}

export default ParsedDocumentDto;
