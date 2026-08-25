// Main exports for the DocMasonApi package
export { default as DocMasonApi, DocMasonApiConfig } from './DocMasonApi';
export { default as EmailTemplateApi } from './EmailTemplateApi';
export { default as ParsedDocumentApi } from './ParsedDocumentApi';
export { default as ParsedDocumentRequestApi } from './ParsedDocumentRequestApi';
export { default as SavedDocumentApi } from './SavedDocumentApi';
export { default as TemplateApi } from './TemplateApi';
export { default as TemplateDataApi } from './TemplateDataApi';
export { default as UserApi } from './UserApi';

// Interface exports
export * from './interfaces/EmailRequestDto';
export * from './interfaces/EmailTemplateDataDto';
export * from './interfaces/EmailTemplateDto';
export * from './interfaces/ParsedDocumentDto';
export * from './interfaces/ParsedDocumentRequestDto';
export * from './interfaces/SavedDocumentDto';
export * from './interfaces/TemplateDataDto';
export * from './interfaces/TemplateDto';
export * from './interfaces/TemplateRequestDto';
export * from './interfaces/UserDto';

// Default export
export { default as default } from './DocMasonApi';