import DocMasonApi from "./DocMasonApi";
import apiRequest from "./apiRequest";
import TemplateDto, { TemplateWithContentDto } from "./interfaces/TemplateDto";

export interface CreateTemplateRequestOptionsInterface {
  Template_Name: string;
  content?: string; // Optional initial HTML content
  Template_MarginLeft?: string;
  Template_MarginRight?: string;
  Template_MarginTop?: string;
  Template_MarginBottom?: string;
  Template_Width?: string;
  Template_Height?: string;
}

export interface GetTemplateRequestOptionsInterface {
  Template_guid: string;
}
  
export interface ListTemplatesRequestOptionsInterface {
  Template_Name?: string;
  from?: number;
  to?: number;
}

export interface EditTemplateRequestOptionsInterface {
  Template_guid: string;
  Template_Name?: string;
  content?: string; // Optional initial HTML content
  Template_MarginLeft?: string;
  Template_MarginRight?: string;
  Template_MarginTop?: string;
  Template_MarginBottom?: string;
  Template_Width?: string;
  Template_Height?: string;
}

export interface GetTemplatePreviewRequestOptionsInterface<T> {
  Template_guid: string;
  data: T; // Data to be used for rendering the template preview
}

export interface GetTemplatePdfRequestOptionsInterface<T> {
  Template_guid: string;
  data: T; // Data to be used for rendering the template PDF
  save?: boolean; // Whether to save the generated PDF as a SavedDocument
  returnDocument?: boolean; // Whether to return the generated PDF as a SavedDocumentDto in the response (only applicable if save is true)
  documentName?: string; // Optional name for the saved document (if save is true)
  email?: {
    TemplateEmail_guid: string; // Optional EmailTemplate to use when emailing the generated PDF
    data?: any; // Optional data to be used for rendering the email template (if emailing the PDF)
    to?: string; // Optional email address to send the PDF to (if emailing the PDF without using an EmailTemplate)
    subject?: string; // Optional subject for the email (if emailing the PDF without using an EmailTemplate)
  };
}

export default class TemplateApi {

  constructor(private dmapi: DocMasonApi) {}

  public createTemplateRequest = (options: CreateTemplateRequestOptionsInterface): Promise<TemplateDto> => {
    const prom: Promise<TemplateDto> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/template`, { 
        method: 'POST', 
        body: JSON.stringify(options), 
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as TemplateDto));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public getTemplateRequest = (options: GetTemplateRequestOptionsInterface): Promise<TemplateWithContentDto> => {
    const prom: Promise<TemplateWithContentDto> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/template?Template_guid=${options.Template_guid}`, { 
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as TemplateWithContentDto));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public listTemplatesRequest = (options: ListTemplatesRequestOptionsInterface): Promise<TemplateWithContentDto> => {
    const prom: Promise<TemplateWithContentDto> = new Promise((resolve, reject) => {
      let queryParams = [];
      if (options.Template_Name) {
        queryParams.push(`Template_Name=${options.Template_Name}`);
      }
      if (options.from !== undefined) {
        queryParams.push(`from=${options.from}`);
      }
      if (options.to !== undefined) {
        queryParams.push(`to=${options.to}`);
      }
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

      apiRequest(`${this.dmapi.baseUrl}/template/list${queryString}`, { 
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as TemplateWithContentDto));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public editTemplateRequest = (options: EditTemplateRequestOptionsInterface): Promise<TemplateWithContentDto> => {
    const prom: Promise<TemplateWithContentDto> = new Promise((resolve, reject) => {
      let queryParams = [];
      queryParams.push(`Template_guid=${options.Template_guid}`);
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

      let body: any = {};
      if (options.Template_Name) {
        body['Template_Name'] = options.Template_Name;
      }
      if (options.content) {
        body['content'] = options.content;
      }
      if (options.Template_MarginLeft) {
        body['Template_MarginLeft'] = options.Template_MarginLeft;
      }
      if (options.Template_MarginRight) {
        body['Template_MarginRight'] = options.Template_MarginRight ;
      }
      if (options.Template_MarginTop) {
        body['Template_MarginTop'] = options.Template_MarginTop ;
      }
      if (options.Template_MarginBottom) {
        body['Template_MarginBottom'] = options.Template_MarginBottom ;
      }
      if (options.Template_Width) {
        body['Template_Width'] = options.Template_Width ;
      }
      if (options.Template_Height) {
        body['Template_Height'] = options.Template_Height ;
      }

      apiRequest(`${this.dmapi.baseUrl}/template${queryString}`, { 
        method: 'PATCH', 
        body: JSON.stringify(body), 
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as TemplateWithContentDto));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public getTemplatePreviewRequest = <T>(options: GetTemplatePreviewRequestOptionsInterface<T>): Promise<string> => {
    const prom: Promise<string> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/template/preview?Template_guid=${options.Template_guid}`, { 
        method: 'POST',
        body: JSON.stringify(options.data),
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.text().then(text => resolve(text));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public getTemplatePdfRequest = <T>(options: GetTemplatePdfRequestOptionsInterface<T>): Promise<Blob> => {
    const prom: Promise<Blob> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/template/pdf?Template_guid=${options.Template_guid}`, { 
        method: 'POST',
        body: JSON.stringify(options),
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

}