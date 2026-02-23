import DocMasonApi from "./DocMasonApi";
import apiRequest from "./apiRequest";
import SavedDocumentDto, { SavedDocumentContextDto } from "./interfaces/SavedDocumentDto";

export interface ListSavedDocumentsRequestOptionsInterface {
  EmailTemplate_Name: string;
  from?: number;
  to?: number;
  TemplateRequest_CreatedAt_from?: string;
  TemplateRequest_CreatedAt_to?: string;
}

export interface DownloadSavedDocumentRequestOptionsInterface {
  SavedDocument_guid: string;
}

export interface DeleteSavedDocumentRequestOptionsInterface {
  SavedDocument_guid: string;
}

export default class SavedDocumentApi {

  constructor(private dmapi: DocMasonApi) {}

  public listSavedDocumentsRequest = (options: ListSavedDocumentsRequestOptionsInterface): Promise<SavedDocumentContextDto[]> => {
    const prom: Promise<SavedDocumentContextDto[]> = new Promise((resolve, reject) => {
      let queryParams = [];
      if (options.EmailTemplate_Name) {
        queryParams.push(`EmailTemplate_Name=${options.EmailTemplate_Name}`);
      }
      if (options.from !== undefined) {
        queryParams.push(`from=${options.from}`);
      }
      if (options.to !== undefined) {
        queryParams.push(`to=${options.to}`);
      }
      if (options.TemplateRequest_CreatedAt_from) {
        queryParams.push(`TemplateRequest_CreatedAt_from=${options.TemplateRequest_CreatedAt_from}`);
      }
      if (options.TemplateRequest_CreatedAt_to) {
        queryParams.push(`TemplateRequest_CreatedAt_to=${options.TemplateRequest_CreatedAt_to}`);
      }
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

      apiRequest(`${this.dmapi.baseUrl}/email-template/list${queryString}`, { 
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as SavedDocumentContextDto[]));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public downloadSavedDocumentRequest = (options: DownloadSavedDocumentRequestOptionsInterface): Promise<Blob> => {
    const prom: Promise<Blob> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/saved-document/download?SavedDocument_guid=${options.SavedDocument_guid}`, { 
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.blob().then(blob => resolve(blob));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public deleteSavedDocumentRequest = (options: DeleteSavedDocumentRequestOptionsInterface): Promise<{SavedDocument_guid: string;}> => {
    const prom: Promise<{SavedDocument_guid: string;}> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/saved-document?SavedDocument_guid=${options.SavedDocument_guid}`, { 
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as {SavedDocument_guid: string;}));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

}