import DocMasonApi from "./DocMasonApi";
import apiRequest from "./apiRequest";
import ParsedDocumentDto from "./interfaces/ParsedDocumentDto";
import { ParsedDocumentRequestDto } from "./interfaces/ParsedDocumentRequestDto";

export interface CreateParsedDocumentRequestOptionsInterface {
  ParsedDocument_Name: string;
  ParsedDocument_Description?: string;
  ParsedDocument_Interface: string;
}

export interface GetParsedDocumentRequestOptionsInterface {
  ParsedDocument_guid: string;
}

export interface ListParsedDocumentsRequestOptionsInterface {
  from: number;
  to: number;
  ParsedDocument_Name?: string;
}

export interface UpdateParsedDocumentRequestOptionsInterface {
  ParsedDocument_guid: string;
  ParsedDocument_Name?: string;
  ParsedDocument_Description?: string;
  ParsedDocument_Interface?: string;
}

export interface DeleteParsedDocumentRequestOptionsInterface {
  ParsedDocument_guid: string;
}

export interface UploadParsedDocumentExampleRequestOptionsInterface {
  ParsedDocument_guid: string;
  file: File | Blob;
}

export interface RunParsedDocumentRequestOptionsInterface {
  ParsedDocument_guid: string;
  file: File | Blob;
}

export interface RunParsedDocumentResponse<TData = unknown> {
  status: 200 | 202;
  data?: TData;
  message?: string;
  pollUrl?: string;
  parsedDocumentRequestGuid?: string;
}

export interface PollParsedDocumentRequestOptionsInterface {
  ParsedDocument_guid: string;
  ParsedDocumentRequest_guid: string;
}

export interface PollParsedDocumentResponse<TData = unknown> {
  status: 'processing' | 'complete';
  data?: TData;
  parsedDocumentRequest?: ParsedDocumentRequestDto;
}

// The API occasionally wraps single-resource responses as { parsedDocument: {...} } instead of returning the bare object
const unwrapParsedDocument = (json: any): ParsedDocumentDto => (json && typeof json === 'object' && 'parsedDocument' in json ? json.parsedDocument : json) as ParsedDocumentDto;

export default class ParsedDocumentApi {

  constructor(private dmapi: DocMasonApi) {}

  public createParsedDocumentRequest = (options: CreateParsedDocumentRequestOptionsInterface): Promise<ParsedDocumentDto> => {
    const prom: Promise<ParsedDocumentDto> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/parsed-document`, {
        method: 'POST',
        body: JSON.stringify(options),
        headers: {
          'Content-Type': 'application/json'
        }
      },
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(unwrapParsedDocument(json)));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public getParsedDocumentRequest = (options: GetParsedDocumentRequestOptionsInterface): Promise<ParsedDocumentDto> => {
    const prom: Promise<ParsedDocumentDto> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/parsed-document?ParsedDocument_guid=${options.ParsedDocument_guid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(unwrapParsedDocument(json)));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public listParsedDocumentsRequest = (options: ListParsedDocumentsRequestOptionsInterface): Promise<ParsedDocumentDto[]> => {
    const prom: Promise<ParsedDocumentDto[]> = new Promise((resolve, reject) => {
      let queryParams = [];
      if (options.ParsedDocument_Name) {
        queryParams.push(`ParsedDocument_Name=${options.ParsedDocument_Name}`);
      }
      if (options.from !== undefined) {
        queryParams.push(`from=${options.from}`);
      }
      if (options.to !== undefined) {
        queryParams.push(`to=${options.to}`);
      }
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

      apiRequest(`${this.dmapi.baseUrl}/parsed-document/list${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as ParsedDocumentDto[]));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public updateParsedDocumentRequest = (options: UpdateParsedDocumentRequestOptionsInterface): Promise<ParsedDocumentDto> => {
    const prom: Promise<ParsedDocumentDto> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/parsed-document?ParsedDocument_guid=${options.ParsedDocument_guid}`, {
        method: 'PATCH',
        body: JSON.stringify(options),
        headers: {
          'Content-Type': 'application/json'
        }
      },
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(unwrapParsedDocument(json)));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public deleteParsedDocumentRequest = (options: DeleteParsedDocumentRequestOptionsInterface): Promise<void> => {
    const prom: Promise<void> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/parsed-document?ParsedDocument_guid=${options.ParsedDocument_guid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          resolve();
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public uploadParsedDocumentExampleRequest = (options: UploadParsedDocumentExampleRequestOptionsInterface): Promise<ParsedDocumentDto> => {
    const prom: Promise<ParsedDocumentDto> = new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', options.file);

      apiRequest(`${this.dmapi.baseUrl}/parsed-document/example?ParsedDocument_guid=${options.ParsedDocument_guid}`, {
        method: 'POST',
        body: formData
      },
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(unwrapParsedDocument(json)));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public runParsedDocumentRequest = <TData = unknown>(options: RunParsedDocumentRequestOptionsInterface): Promise<RunParsedDocumentResponse<TData>> => {
    const prom: Promise<RunParsedDocumentResponse<TData>> = new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', options.file);

      apiRequest(`${this.dmapi.baseUrl}/parsed-document/run?ParsedDocument_guid=${options.ParsedDocument_guid}`, {
        method: 'POST',
        body: formData
      },
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as RunParsedDocumentResponse<TData>));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

  public pollParsedDocumentRequest = <TData = unknown>(options: PollParsedDocumentRequestOptionsInterface): Promise<PollParsedDocumentResponse<TData>> => {
    const prom: Promise<PollParsedDocumentResponse<TData>> = new Promise((resolve, reject) => {
      apiRequest(`${this.dmapi.baseUrl}/parsed-document/poll?ParsedDocument_guid=${options.ParsedDocument_guid}&ParsedDocumentRequest_guid=${options.ParsedDocumentRequest_guid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      this.dmapi.apiKey).then(res => {
        if (res.ok) {
          res.json().then(json => resolve(json as PollParsedDocumentResponse<TData>));
        } else {
          reject(res);
        }
      });
    });
    return prom;
  }

}
