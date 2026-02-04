// Main entry point
export { DocMasonApi } from './DocMasonApi';

// Re-export everything for convenience
export * from './DocMasonApi';
export * from './types';
export * from './interfaces/TemplateInterfaces';
export * from './interfaces/TemplateDataInterfaces';
export * from './interfaces/TemplateRequestInterfaces';
export * from './interfaces/UserApiInterfaces';
export * from './interfaces/UserInterfaces';

// Default export
import { DocMasonApi } from './DocMasonApi';
export default DocMasonApi;