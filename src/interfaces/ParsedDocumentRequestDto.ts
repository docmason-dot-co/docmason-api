export interface ParsedDocumentRequestDto {
  ParsedDocumentRequest_guid: string;
  ParsedDocumentRequest_CreatedAt: string;
  ParsedDocumentRequest_UpdatedAt: string;
  ParsedDocumentRequest_Name: string;
  ParsedDocumentRequest_Data: string | null;
  ParsedDocument_guid: string;
}

export interface ParsedDocumentRequestListResponse {
  parsedDocumentRequests: ParsedDocumentRequestDto[];
  pagination: {
    from: number;
    to: number;
    total: number;
    returned: number;
  };
}

export default ParsedDocumentRequestDto;
