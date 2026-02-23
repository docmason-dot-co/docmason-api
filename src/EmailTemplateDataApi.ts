import DocMasonApi from "./DocMasonApi";
import apiRequest from "./apiRequest";
import EmailTemplateDataDto from "./interfaces/EmailTemplateDataDto";

export interface GetEmailTemplateDataRequestOptionsInterface {
  EmailTemplateData_guid: string;
}

export interface EditEmailTemplateDataRequestOptionsInterface {
  EmailTemplateData_guid: string;
  EmailTemplateData_Name?: string | null;
  EmailTemplateData_Data?: string;
  EmailTemplateData_Interface?: string;
}

export interface DeleteEmailTemplateDataRequestOptionsInterface {
  EmailTemplateData_guid: string;
}

export interface ListEmailTemplateDataRequestOptionsInterface {
  EmailTemplate_guid?: string;
  EmailTemplate_Name?: string;
  from?: number;
  to?: number;
}

export default class EmailTemplateDataApi {
  constructor(private dmapi: DocMasonApi) {}

  public getEmailTemplateDataRequest = (options: GetEmailTemplateDataRequestOptionsInterface): Promise<EmailTemplateDataDto> => {
    const prom: Promise<EmailTemplateDataDto> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/email-template-data?EmailTemplateData_guid=${options.EmailTemplateData_guid}`, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as EmailTemplateDataDto));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public editEmailTemplateDataRequest = (options: EditEmailTemplateDataRequestOptionsInterface): Promise<EmailTemplateDataDto> => {
    const prom: Promise<EmailTemplateDataDto> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/email-template-data?EmailTemplateData_guid=${options.EmailTemplateData_guid}`, { 
        method: 'PATCH',
        body: JSON.stringify(options),
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as EmailTemplateDataDto));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public deleteEmailTemplateDataRequest = (options: DeleteEmailTemplateDataRequestOptionsInterface): Promise<{EmailTemplateData_guid: string;}> => {
    const prom: Promise<{EmailTemplateData_guid: string;}> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/email-template-data?EmailTemplateData_guid=${options.EmailTemplateData_guid}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as {EmailTemplateData_guid: string;}));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public listEmailTemplateDataRequest = (options: ListEmailTemplateDataRequestOptionsInterface): Promise<EmailTemplateDataDto[]> => {
    const prom: Promise<EmailTemplateDataDto[]> = new Promise((resolve, reject) => {
      let queryParams = [];
      if (options.EmailTemplate_guid) {
        queryParams.push(`EmailTemplate_guid=${options.EmailTemplate_guid}`);
      }
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

      apiRequest(`${this.dmapi.baseUrl}/email-template-data${queryString}`, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as EmailTemplateDataDto[]));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }
}