import DocMasonApi from "./DocMasonApi";
import apiRequest from "./apiRequest";
import { ParsedDocumentRequestDto, ParsedDocumentRequestListResponse } from "./interfaces/ParsedDocumentRequestDto";

export interface GetParsedDocumentRequestRequestOptionsInterface {
  ParsedDocumentRequest_guid: string;
}

export interface ListParsedDocumentRequestsRequestOptionsInterface {
  from: number;
  to: number;
  ParsedDocumentRequest_Name?: string;
  ParsedDocumentRequest_guid?: string;
  ParsedDocument_guid?: string;
  ParsedDocumentRequest_CreatedAt_from?: string;
  ParsedDocumentRequest_CreatedAt_to?: string;
}

export default class ParsedDocumentRequestApi {

  constructor(private dmapi: DocMasonApi) {}

  public getParsedDocumentRequestRequest = (options: GetParsedDocumentRequestRequestOptionsInterface): Promise<ParsedDocumentRequestDto> => {
    const prom: Promise<ParsedDocumentRequestDto> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/parsed-document-request?ParsedDocumentRequest_guid=${options.ParsedDocumentRequest_guid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as ParsedDocumentRequestDto));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public listParsedDocumentRequestsRequest = (options: ListParsedDocumentRequestsRequestOptionsInterface): Promise<ParsedDocumentRequestListResponse> => {
    const prom: Promise<ParsedDocumentRequestListResponse> = new Promise((resolve, reject) => {
      let queryParams = [];
      if (options.ParsedDocumentRequest_Name) {
        queryParams.push(`ParsedDocumentRequest_Name=${options.ParsedDocumentRequest_Name}`);
      }
      if (options.ParsedDocumentRequest_guid) {
        queryParams.push(`ParsedDocumentRequest_guid=${options.ParsedDocumentRequest_guid}`);
      }
      if (options.ParsedDocument_guid) {
        queryParams.push(`ParsedDocument_guid=${options.ParsedDocument_guid}`);
      }
      if (options.ParsedDocumentRequest_CreatedAt_from) {
        queryParams.push(`ParsedDocumentRequest_CreatedAt_from=${options.ParsedDocumentRequest_CreatedAt_from}`);
      }
      if (options.ParsedDocumentRequest_CreatedAt_to) {
        queryParams.push(`ParsedDocumentRequest_CreatedAt_to=${options.ParsedDocumentRequest_CreatedAt_to}`);
      }
      if (options.from !== undefined) {
        queryParams.push(`from=${options.from}`);
      }
      if (options.to !== undefined) {
        queryParams.push(`to=${options.to}`);
      }
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

      apiRequest(`${this.dmapi.baseUrl}/parsed-document-request/list${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as ParsedDocumentRequestListResponse));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

}
