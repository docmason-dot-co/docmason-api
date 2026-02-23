import DocMasonApi from "./DocMasonApi";
import apiRequest from "./apiRequest";
import EmailTemplateDto, { EmailTemplateWithContentDto } from "./interfaces/EmailTemplateDto";
import TemplateDto, { TemplateWithContentDto } from "./interfaces/TemplateDto";

export interface CreateTemplateRequestOptionsInterface {
  EmailTemplate_Name: string;
  content?: string; // Optional initial HTML content
}

export interface GetEmailTemplateRequestOptionsInterface {
  EmailTemplate_guid: string;
}
  
export interface ListEmailTemplatesRequestOptionsInterface {
  EmailTemplate_Name?: string;
  from?: number;
  to?: number;
}

export interface EditEmailTemplateRequestOptionsInterface {
  EmailTemplate_guid: string;
  EmailTemplate_Name?: string;
  content?: string; // Optional initial HTML content
}

export interface GetEmailTemplatePreviewRequestOptionsInterface<T> {
  EmailTemplate_guid: string;
  data: T; // Data to be used for rendering the template preview
}

export interface GetEmailTemplatePdfRequestOptionsInterface<T> {
  EmailTemplate_guid: string;
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

export default class EmailTemplateApi {

  constructor(private dmapi: DocMasonApi) {}

  public createEmailTemplateRequest = (options: CreateTemplateRequestOptionsInterface): Promise<EmailTemplateDto> => {
    const prom: Promise<EmailTemplateDto> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/email-template`, { 
        method: 'POST', 
        body: JSON.stringify(options), 
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as EmailTemplateDto));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public getEmailTemplateRequest = (options: GetEmailTemplateRequestOptionsInterface): Promise<EmailTemplateWithContentDto> => {
    const prom: Promise<EmailTemplateWithContentDto> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/email-template?EmailTemplate_guid=${options.EmailTemplate_guid}`, { 
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as EmailTemplateWithContentDto));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public listEmailTemplatesRequest = (options: ListEmailTemplatesRequestOptionsInterface): Promise<EmailTemplateWithContentDto> => {
    const prom: Promise<EmailTemplateWithContentDto> = new Promise((resolve, reject) => {
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
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

      apiRequest(`${this.dmapi.baseUrl}/email-template/list${queryString}`, { 
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as EmailTemplateWithContentDto));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public editEmailTemplateRequest = (options: EditEmailTemplateRequestOptionsInterface): Promise<EmailTemplateWithContentDto> => {
    const prom: Promise<EmailTemplateWithContentDto> = new Promise((resolve, reject) => {
      let queryParams = [];
      queryParams.push(`EmailTemplate_guid=${options.EmailTemplate_guid}`);
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

      let body: any = {};
      if (options.EmailTemplate_Name) {
        body['EmailTemplate_Name'] = options.EmailTemplate_Name;
      }
      if (options.content) {
        body['content'] = options.content;
      }
      
      apiRequest(`${this.dmapi.baseUrl}/email-template${queryString}`, { 
        method: 'PATCH', 
        body: JSON.stringify(body), 
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as EmailTemplateWithContentDto));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public getEmailTemplatePreviewRequest = <T>(options: GetEmailTemplatePreviewRequestOptionsInterface<T>): Promise<string> => {
    const prom: Promise<string> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/email-template/preview?EmailTemplate_guid=${options.EmailTemplate_guid}`, { 
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

  public getEmailTemplatePdfRequest = <T>(options: GetEmailTemplatePdfRequestOptionsInterface<T>): Promise<Blob> => {
    const prom: Promise<Blob> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/email-template/pdf?EmailTemplate_guid=${options.EmailTemplate_guid}`, { 
        method: 'POST',
        body: JSON.stringify(options.data),
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