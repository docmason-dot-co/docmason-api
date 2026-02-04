# Doc Mason API Client

Official TypeScript/JavaScript client library for the Doc Mason API. This package provides a simple and type-safe way to interact with Doc Mason's PDF generation and template management services.

## Installation

```bash
npm install doc-mason-api
```

## Quick Start

```typescript
import { DocMasonApi } from 'doc-mason-api';

// Initialize the API client
const dmapi = new DocMasonApi({
  apiKey: 'your-api-key-here'
});

// Create a template
const template = await dmapi.template.create({
  Template_Name: 'My Invoice Template',
  content: '<h1>Invoice #{{invoiceNumber}}</h1><p>Amount: ${{amount}}</p>'
});

// Generate a PDF
const pdfBuffer = await dmapi.template.generatePdfBuffer({
  Template_guid: template.template.Template_guid,
  data: {
    invoiceNumber: '12345',
    amount: '99.99'
  }
});

// In Node.js, save to file
import fs from 'fs';
fs.writeFileSync('invoice.pdf', pdfBuffer);
```

## Configuration

### Basic Configuration

```typescript
const dmapi = new DocMasonApi({
  apiKey: 'your-api-key-here',
  baseUrl: 'https://api.docmason.com/api/v1' // Optional, defaults to production URL
});
```

### Environment-Specific Configuration

```typescript
// Development
const dmapi = new DocMasonApi({
  apiKey: process.env.DOC_MASON_API_KEY!,
  baseUrl: 'http://localhost:3001/api/v1'
});

// Production
const dmapi = new DocMasonApi({
  apiKey: process.env.DOC_MASON_API_KEY!
  // baseUrl defaults to production
});
```

## API Reference

### Templates

#### Create Template
```typescript
const response = await dmapi.template.create({
  Template_Name: 'My Template',
  content: '<h1>Hello {{name}}!</h1>',
  Template_MarginTop: '20px',
  Template_MarginBottom: '20px',
  Template_MarginLeft: '20px',
  Template_MarginRight: '20px',
  Template_Width: '210mm',
  Template_Height: '297mm'
});
```

#### Get Template
```typescript
const template = await dmapi.template.get('template-guid-here');
```

#### List Templates
```typescript
const templates = await dmapi.template.list({
  from: 0,
  to: 10,
  templateName: 'search-term' // optional
});
```

#### Update Template
```typescript
const updated = await dmapi.template.update('template-guid-here', {
  Template_Name: 'Updated Template Name',
  content: '<h1>Updated content</h1>'
});
```

#### Delete Template
```typescript
const result = await dmapi.template.delete('template-guid-here');
```

#### Preview Template
```typescript
const htmlPreview = await dmapi.template.preview({
  Template_guid: 'template-guid-here',
  data: { name: 'John Doe', amount: 100 }
});
```

#### Generate PDF
```typescript
// Returns ArrayBuffer (cross-platform)
const pdfArrayBuffer = await dmapi.template.generatePdf({
  Template_guid: 'template-guid-here',
  data: { name: 'John Doe', amount: 100 }
});

// Returns Buffer (Node.js) or Uint8Array (Browser)
const pdfBuffer = await dmapi.template.generatePdfBuffer({
  Template_guid: 'template-guid-here',
  data: { name: 'John Doe', amount: 100 }
});
```

#### Upload Asset
```typescript
// In Node.js with Buffer
import fs from 'fs';
const imageBuffer = fs.readFileSync('path/to/image.png');
const uploadResult = await dmapi.template.uploadAsset(
  'template-guid-here',
  'logo.png',
  imageBuffer
);

// In Browser with File
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const file = fileInput.files[0];
const uploadResult = await dmapi.template.uploadAsset(
  'template-guid-here',
  'logo.png',
  file
);
```

### User API Management

#### Create API Key
```typescript
const apiKey = await dmapi.userApi.create({
  User_guid: 'user-guid-here'
});
```

#### List API Keys
```typescript
const apiKeys = await dmapi.userApi.list();
```

#### Verify API Key
```typescript
const verification = await dmapi.userApi.verify('api-key-to-verify');
```

### User Management

#### Get User Profile
```typescript
const userProfile = await dmapi.user.getFullProfile();
```

## Error Handling

The API client throws structured errors that you can catch and handle:

```typescript
import { ApiError } from 'doc-mason-api';

try {
  const template = await dmapi.template.get('invalid-guid');
} catch (error) {
  if (error.status && error.message) {
    // This is an ApiError
    const apiError = error as ApiError;
    console.error(`API Error ${apiError.status}: ${apiError.message}`);
    
    if (apiError.errors) {
      console.error('Detailed errors:', apiError.errors);
    }
  } else {
    // Network or other error
    console.error('Unexpected error:', error);
  }
}
```

## TypeScript Support

This package is written in TypeScript and includes comprehensive type definitions. All API responses are fully typed:

```typescript
import { TemplateResponse, CreateTemplateResponse } from 'doc-mason-api';

const template: CreateTemplateResponse = await dmapi.template.create({
  Template_Name: 'My Template',
  content: '<h1>Hello World</h1>'
});

// Full type safety
console.log(template.template.Template_guid); // string
console.log(template.limits.current); // number
```

## Node.js vs Browser

The package automatically detects the environment and uses the appropriate fetch implementation:

- **Browser**: Uses the native `fetch` API
- **Node.js**: Uses `node-fetch` (install as peer dependency)

### Node.js Example

```typescript
import { DocMasonApi } from 'doc-mason-api';
import fs from 'fs/promises';

const dmapi = new DocMasonApi({
  apiKey: process.env.DOC_MASON_API_KEY!
});

async function generateInvoice() {
  const pdfBuffer = await dmapi.template.generatePdfBuffer({
    Template_guid: 'your-template-guid',
    data: {
      customerName: 'John Doe',
      invoiceNumber: 'INV-001',
      items: [
        { name: 'Item 1', price: 29.99 },
        { name: 'Item 2', price: 49.99 }
      ]
    }
  });
  
  await fs.writeFile('invoice.pdf', pdfBuffer);
  console.log('PDF generated successfully!');
}
```

### Browser Example

```typescript
import { DocMasonApi } from 'doc-mason-api';

const dmapi = new DocMasonApi({
  apiKey: 'your-api-key-here'
});

async function downloadPdf() {
  const pdfArrayBuffer = await dmapi.template.generatePdf({
    Template_guid: 'your-template-guid',
    data: { name: 'John Doe' }
  });
  
  // Create download link
  const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'document.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```

## License

MIT

## Support

For support, please visit [our documentation](https://docs.docmason.com) or contact support@docmason.com.