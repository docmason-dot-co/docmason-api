# Doc Mason API Client

Official TypeScript/JavaScript client library for the Doc Mason API. This package provides a simple and type-safe way to interact with Doc Mason's PDF generation and template management services.

## Features

- ✅ **Full TypeScript support** with comprehensive type definitions
- ✅ **IntelliSense/autocomplete** in VS Code and other IDEs
- ✅ **Cross-platform** - works in Node.js and browsers
- ✅ **Flexible constructor** - supports both config objects and direct parameters
- ✅ **Complete API coverage** - all endpoints supported
- ✅ **Built-in error handling** with detailed error messages
- ✅ **Modern ES6+ and CommonJS** module support

## Installation

```bash
npm install doc-mason-api
```

For Node.js environments, you may also need to install node-fetch:
```bash
npm install node-fetch@3
```

## Getting Started

### 1. Get Your API Key

To use this package, you'll need a DocMason API key:

1. Visit [https://docmason.co](https://docmason.co)
2. Sign up for a free account
3. Navigate to your dashboard
4. Generate your API key
5. Keep your API key secure and never commit it to version control

### 2. Install the Package

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
const template = await dmapi.templateApi.createTemplateRequest({
  Template_Name: 'My Invoice Template',
  content: '<h1>Invoice #{{invoiceNumber}}</h1><p>Amount: ${{amount}}</p>'
});

// Generate a PDF
const pdfBlob = await dmapi.templateApi.getTemplatePdfRequest({
  Template_guid: template.Template_guid,
  data: {
    invoiceNumber: '12345',
    amount: '99.99'
  }
});

// In Node.js, convert to buffer and save
const buffer = Buffer.from(await pdfBlob.arrayBuffer());
import fs from 'fs';
fs.writeFileSync('invoice.pdf', buffer);
```

## Complete Usage Example

Here's a comprehensive example showing the full workflow from template creation to PDF generation:

```typescript
import { DocMasonApi } from 'doc-mason-api';

async function completeWorkflow() {
  // Initialize the API client
  const dmapi = new DocMasonApi({
    apiKey: process.env.API_KEY!,
    baseUrl: process.env.BASE_URL // optional, defaults to production
  });

  try {
    // 1. Create a professional invoice template
    console.log('📄 Creating template...');
    const template = await dmapi.templateApi.createTemplateRequest({
      Template_Name: 'Professional Invoice Template',
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <header style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">{{companyName}}</h1>
            <p style="margin: 5px 0; color: #666;">{{companyAddress}}</p>
          </header>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #333;">Invoice #{{invoiceNumber}}</h2>
            <p><strong>Date:</strong> {{invoiceDate}}</p>
            <p><strong>Due Date:</strong> {{dueDate}}</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h3>Bill To:</h3>
            <p><strong>{{clientName}}</strong><br>{{clientAddress}}</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Description</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Rate</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              {{#each items}}
              <tr>
                <td style="border: 1px solid #ddd; padding: 12px;">{{description}}</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${{rate}}</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${{amount}}</td>
              </tr>
              {{/each}}
            </tbody>
          </table>
          
          <div style="text-align: right; margin-bottom: 30px;">
            <h3 style="color: #333;">Total: ${{total}}</h3>
          </div>
          
          <footer style="margin-top: 50px; text-align: center; color: #666;">
            <p>Thank you for your business!</p>
          </footer>
        </div>
      `,
      Template_MarginTop: '20px',
      Template_MarginBottom: '20px',
      Template_MarginLeft: '20px',
      Template_MarginRight: '20px'
    });
    
    console.log('✅ Template created:', template.Template_guid);

    // 2. Create reusable template data
    console.log('📊 Creating template data...');
    const templateData = await dmapi.templateDataApi.createTemplateDataRequest({
      TemplateData_Name: 'Sample Invoice Data',
      Template_guid: template.Template_guid,
      TemplateData_Interface: JSON.stringify({
        companyName: 'string',
        companyAddress: 'string',
        invoiceNumber: 'string',
        invoiceDate: 'string',
        dueDate: 'string',
        clientName: 'string',
        clientAddress: 'string',
        items: 'array',
        total: 'string'
      }),
      TemplateData_Data: JSON.stringify({
        companyName: 'Your Company Name',
        companyAddress: '123 Business St, City, State 12345',
        invoiceNumber: 'INV-001',
        invoiceDate: new Date().toLocaleDateString(),
        dueDate: new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString(),
        clientName: 'Acme Corporation',
        clientAddress: '456 Client Ave, City, State 67890',
        items: [
          { description: 'Web Development Services', rate: '2000.00', amount: '2000.00' },
          { description: 'Hosting Setup and Configuration', rate: '200.00', amount: '200.00' }
        ],
        total: '2200.00'
      })
    });
    
    console.log('✅ Template data created:', templateData.TemplateData_guid);

    // 3. Preview the template (optional)
    console.log('👀 Generating preview...');
    const preview = await dmapi.templateApi.getTemplatePreviewRequest({
      Template_guid: template.Template_guid,
      data: JSON.parse(templateData.TemplateData_Data!)
    });
    
    console.log('✅ Preview generated, HTML length:', preview.length);

    // 4. Generate PDF
    console.log('📋 Generating PDF...');
    const pdfBlob = await dmapi.templateApi.getTemplatePdfRequest({
      Template_guid: template.Template_guid,
      data: JSON.parse(templateData.TemplateData_Data!)
    });
    
    console.log('✅ PDF generated, size:', pdfBlob.size, 'bytes');
    
    // Save PDF (Node.js environment)
    if (typeof require !== 'undefined') {
      const fs = require('fs');
      const buffer = Buffer.from(await pdfBlob.arrayBuffer());
      fs.writeFileSync('professional-invoice.pdf', buffer);
      console.log('💾 PDF saved as professional-invoice.pdf');
    }
    
    // 5. Create an email template for sending invoices
    console.log('📧 Creating email template...');
    const emailTemplate = await dmapi.emailTemplateApi.createEmailTemplateRequest({
      EmailTemplate_Name: 'Invoice Email Template',
      content: `
        <div style="font-family: Arial, sans-serif;">
          <h2>{{subject}}</h2>
          <p>Dear {{clientName}},</p>
          <p>Please find attached invoice #{{invoiceNumber}} for the amount of ${{total}}.</p>
          <p>{{message}}</p>
          <p>Best regards,<br>{{companyName}}</p>
        </div>
      `
    });
    
    console.log('✅ Email template created:', emailTemplate.EmailTemplate_guid);
    
    console.log('🎉 Complete workflow finished successfully!');
    
  } catch (error: any) {
    console.error('❌ Error:', error);
    if (error.status) {
      console.error('HTTP Status:', error.status, error.statusText);
      try {
        const errorBody = await error.text();
        console.error('Error details:', errorBody);
      } catch {}
    }
  }
}

// Run the complete workflow
completeWorkflow();
```

## Complete Example

Here's a comprehensive example showing the full workflow:

```typescript
import { DocMasonApi } from 'doc-mason-api';

async function completeExample() {
  // Initialize the API
  const dmapi = new DocMasonApi({
    apiKey: process.env.API_KEY!,
    baseUrl: process.env.BASE_URL // optional, defaults to production
  });

  try {
    // 1. Create a template
    console.log('Creating template...');
    const template = await dmapi.templateApi.createTemplateRequest({
      Template_Name: 'Business Invoice',
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <header style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">{{companyName}}</h1>
            <p style="margin: 5px 0; color: #666;">{{companyAddress}}</p>
          </header>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #333;">Invoice #{{invoiceNumber}}</h2>
            <p><strong>Date:</strong> {{invoiceDate}}</p>
            <p><strong>Due Date:</strong> {{dueDate}}</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h3>Bill To:</h3>
            <p><strong>{{clientName}}</strong><br>
            {{clientAddress}}</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Description</th>
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">Quantity</th>
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">Rate</th>
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              {{#each items}}
              <tr>
                <td style="border: 1px solid #dee2e6; padding: 12px;">{{description}}</td>
                <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">{{quantity}}</td>
                <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">${{rate}}</td>
                <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">${{amount}}</td>
              </tr>
              {{/each}}
            </tbody>
          </table>
          
          <div style="text-align: right; margin-bottom: 30px;">
            <p><strong>Subtotal: ${{subtotal}}</strong></p>
            <p><strong>Tax ({{taxRate}}%): ${{taxAmount}}</strong></p>
            <h3 style="color: #333;">Total: ${{total}}</h3>
          </div>
          
          <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #666;">
            <p>Thank you for your business!</p>
            <p>{{paymentTerms}}</p>
          </footer>
        </div>
      `,
      Template_MarginTop: '20px',
      Template_MarginBottom: '20px',
      Template_MarginLeft: '20px',
      Template_MarginRight: '20px'
    });
    
    console.log('✅ Template created:', template.Template_guid);

    // 2. Create template data for reuse
    console.log('Creating template data...');
    const templateData = await dmapi.templateDataApi.createTemplateDataRequest({
      TemplateData_Name: 'Sample Invoice Data',
      Template_guid: template.Template_guid,
      TemplateData_Interface: JSON.stringify({
        companyName: 'string',
        companyAddress: 'string',
        invoiceNumber: 'string',
        invoiceDate: 'string',
        dueDate: 'string',
        clientName: 'string',
        clientAddress: 'string',
        items: 'array',
        subtotal: 'string',
        taxRate: 'string',
        taxAmount: 'string',
        total: 'string',
        paymentTerms: 'string'
      }),
      TemplateData_Data: JSON.stringify({
        companyName: 'Your Company Name',
        companyAddress: '123 Business St, City, State 12345',
        invoiceNumber: 'INV-001',
        invoiceDate: new Date().toLocaleDateString(),
        dueDate: new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString(),
        clientName: 'Client Company',
        clientAddress: '456 Client Ave, City, State 67890',
        items: [
          { description: 'Web Development', quantity: '1', rate: '2000.00', amount: '2000.00' },
          { description: 'Hosting Setup', quantity: '1', rate: '200.00', amount: '200.00' }
        ],
        subtotal: '2200.00',
        taxRate: '8.25',
        taxAmount: '181.50',
        total: '2381.50',
        paymentTerms: 'Payment due within 30 days'
      })
    });
    
    console.log('✅ Template data created:', templateData.TemplateData_guid);

    // 3. Preview the template
    console.log('Generating preview...');
    const preview = await dmapi.templateApi.getTemplatePreviewRequest({
      Template_guid: template.Template_guid,
      data: JSON.parse(templateData.TemplateData_Data)
    });
    
    console.log('✅ Preview generated, HTML length:', preview.length);

    // 4. Generate PDF
    console.log('Generating PDF...');
    const pdfBlob = await dmapi.templateApi.getTemplatePdfRequest({
      Template_guid: template.Template_guid,
      data: JSON.parse(templateData.TemplateData_Data)
    });
    
    // Save PDF (Node.js)
    if (typeof require !== 'undefined') {
      const fs = require('fs');
      const buffer = Buffer.from(await pdfBlob.arrayBuffer());
      fs.writeFileSync('business-invoice.pdf', buffer);
      console.log('✅ PDF saved as business-invoice.pdf');
    }
    
    console.log('✅ Complete example finished successfully!');
    
  } catch (error: any) {
    console.error('❌ Error:', error);
    if (error.status) {
      console.error('HTTP Status:', error.status, error.statusText);
      try {
        const errorBody = await error.text();
        console.error('Error details:', errorBody);
      } catch {}
    }
  }
}

// Run the example
completeExample();
```

## Configuration

### Modern Configuration (Recommended)

```typescript
// Config object style (recommended for new code)
const dmapi = new DocMasonApi({
  apiKey: 'your-api-key-here',
  baseUrl: 'https://docmason.co/api/v1' // Optional, defaults to production URL
});
```

### Legacy Configuration (Backward Compatible)

```typescript
// Direct parameters style (for backward compatibility)
const dmapi = new DocMasonApi('your-api-key-here', 'https://docmason.co/api/v1');
```

### Environment-Specific Configuration

```typescript
// Development
const dmapi = new DocMasonApi({
  apiKey: process.env.API_KEY!,
  baseUrl: 'http://localhost:3001/api/v1'
});

// Production
const dmapi = new DocMasonApi({
  apiKey: process.env.API_KEY!
  // baseUrl defaults to production
});
```

## API Reference

### Templates

#### Create Template
```typescript
const response = await dmapi.templateApi.createTemplateRequest({
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
const template = await dmapi.templateApi.getTemplateRequest({ 
  Template_guid: 'template-guid-here' 
});
```

#### List Templates
```typescript
const templates = await dmapi.templateApi.listTemplatesRequest({
  from: 0,
  to: 10,
  Template_Name: 'search-term' // optional
});
```

#### Update Template
```typescript
const updated = await dmapi.templateApi.editTemplateRequest({
  Template_guid: 'template-guid-here',
  Template_Name: 'Updated Template Name',
  content: '<h1>Updated content</h1>'
});
```

#### Preview Template
```typescript
const htmlPreview = await dmapi.templateApi.getTemplatePreviewRequest({
  Template_guid: 'template-guid-here',
  data: { name: 'John Doe', amount: 100 }
});
```

#### Generate PDF
```typescript
// Returns Blob (cross-platform)
const pdfBlob = await dmapi.templateApi.getTemplatePdfRequest({
  Template_guid: 'template-guid-here',
  data: { name: 'John Doe', amount: 100 }
});

// Convert to buffer in Node.js
const buffer = Buffer.from(await pdfBlob.arrayBuffer());
```

### Email Templates

#### Create Email Template
```typescript
const emailTemplate = await dmapi.emailTemplateApi.createEmailTemplateRequest({
  EmailTemplate_Name: 'Welcome Email',
  content: '<h1>Welcome {{name}}!</h1><p>{{message}}</p>'
});
```

#### Get Email Template
```typescript
const template = await dmapi.emailTemplateApi.getEmailTemplateRequest({
  EmailTemplate_guid: 'email-template-guid-here'
});
```

#### List Email Templates
```typescript
const templates = await dmapi.emailTemplateApi.listEmailTemplatesRequest({
  from: 0,
  to: 10
});
```

#### Preview Email Template
```typescript
const htmlPreview = await dmapi.emailTemplateApi.getEmailTemplatePreviewRequest({
  EmailTemplate_guid: 'email-template-guid-here',
  data: { name: 'John Doe', message: 'Welcome to our service!' }
});
```

### Email Template Data

#### Create Email Template Data
```typescript
const emailTemplateData = await dmapi.emailTemplateDataApi.createEmailTemplateDataRequest({
  EmailTemplateData_Name: 'Sample Email Data',
  EmailTemplate_guid: 'email-template-guid-here',
  EmailTemplateData_Interface: JSON.stringify({ 
    subject: 'string', 
    recipientName: 'string',
    message: 'string'
  }),
  EmailTemplateData_Data: JSON.stringify({
    subject: 'Welcome to our service!',
    recipientName: 'John Doe',
    message: 'Thank you for joining us. We are excited to have you!'
  })
});
```

#### Get Email Template Data
```typescript
const data = await dmapi.emailTemplateDataApi.getEmailTemplateDataRequest({
  EmailTemplate_guid: 'email-template-guid-here'
});
```

#### List Email Template Data
```typescript
const dataList = await dmapi.emailTemplateDataApi.listEmailTemplateDataRequest({
  EmailTemplate_guid: 'email-template-guid-here',
  from: 0,
  to: 10
});
```

#### Update Email Template Data
```typescript
const updatedData = await dmapi.emailTemplateDataApi.editEmailTemplateDataRequest({
  EmailTemplateData_guid: 'email-template-data-guid-here',
  EmailTemplateData_Name: 'Updated Email Data',
  EmailTemplateData_Interface: JSON.stringify({ 
    subject: 'string', 
    recipientName: 'string',
    message: 'string' 
  }),
  EmailTemplateData_Data: JSON.stringify({
    subject: 'Updated welcome message',
    recipientName: 'Jane Smith',
    message: 'We have updated our welcome process!'
  })
});
```

#### Delete Email Template Data
```typescript
await dmapi.emailTemplateDataApi.deleteEmailTemplateDataRequest({
  EmailTemplateData_guid: 'email-template-data-guid-here'
});
```

### Template Data

#### Create Template Data
```typescript
const templateData = await dmapi.templateDataApi.createTemplateDataRequest({
  TemplateData_Name: 'Sample Data',
  Template_guid: 'template-guid-here',
  TemplateData_Interface: JSON.stringify({ name: 'string', amount: 'number' }),
  TemplateData_Data: JSON.stringify({ name: 'John Doe', amount: 100 })
});
```

#### Get Template Data
```typescript
const data = await dmapi.templateDataApi.getTemplateDataRequest({
  Template_guid: 'template-guid-here'
});
```

#### List Template Data
```typescript
const dataList = await dmapi.templateDataApi.listTemplateDataRequest({
  Template_guid: 'template-guid-here',
  from: 0,
  to: 10
});
```

### User Management

#### Get User Profile
```typescript
const userProfile = await dmapi.userApi.profileRequest();
```

#### Update User
```typescript
const updatedUser = await dmapi.userApi.editUser({
  User_Name: 'New Username'
});
```

### Saved Documents

#### List Saved Documents
```typescript
const documents = await dmapi.savedDocumentApi.listSavedDocumentsRequest({
  EmailTemplate_Name: '',
  from: 0,
  to: 10
});
```

#### Download Saved Document
```typescript
const pdfBlob = await dmapi.savedDocumentApi.downloadSavedDocumentRequest({
  SavedDocument_guid: 'document-guid-here'
});
```

## Development & Testing

### Running Tests

The package includes comprehensive test suites:

```bash
# Run the package-specific tests (TypeScript)
npm run test-package

# Run comprehensive API tests (JavaScript)
npm run test-all

# Run standard Jest tests
npm test
```

### Building the Package

```bash
# Build the TypeScript source
npm run build

# Clean build artifacts
npm run clean

# Development with auto-rebuild
npm run dev
```

### Environment Variables

Create a `.env` file in the project root for testing:

```
API_KEY=your-api-key-here
BASE_URL=https://docmason.co/api/v1
```

## IDE Support

This package provides excellent IDE support with:

- **Full TypeScript definitions** for all API methods and response types
- **IntelliSense/autocomplete** suggestions
- **Parameter hints** and documentation
- **Type checking** to catch errors at compile time
- **Import suggestions** for all exported interfaces and types

### VS Code Example

```typescript
import { DocMasonApi, TemplateDto } from 'doc-mason-api';

const dmapi = new DocMasonApi({ apiKey: 'your-key' });

// VS Code will provide full autocomplete and type checking
dmapi.templateApi.createTemplateRequest({
  Template_Name: 'My Template', // ✅ Type-checked
  content: '<h1>Hello {{name}}</h1>' // ✅ Optional parameter
  // ✅ IDE shows all available options with documentation
});
```

## Error Handling

The API client provides detailed error information for debugging:

```typescript
try {
  const template = await dmapi.templateApi.createTemplateRequest({
    Template_Name: 'My Template',
    content: '<h1>Hello {{name}}!</h1>'
  });
} catch (error: any) {
  if (error.status) {
    // HTTP error response
    console.error(`API Error ${error.status}: ${error.statusText}`);
    const errorBody = await error.text();
    console.error('Error details:', errorBody);
  } else {
    // Network or other error
    console.error('Unexpected error:', error.message);
  }
}
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
  apiKey: process.env.API_KEY!
});

async function generateInvoice() {
  // Create a template
  const template = await dmapi.templateApi.createTemplateRequest({
    Template_Name: 'Invoice Template',
    content: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Invoice #{{invoiceNumber}}</h1>
        <p><strong>Customer:</strong> {{customerName}}</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><th>Item</th><th>Price</th></tr>
          {{#each items}}
          <tr><td>{{name}}</td><td>${{price}}</td></tr>
          {{/each}}
        </table>
        <p><strong>Total: ${{total}}</strong></p>
      </div>
    `
  });
  
  // Generate PDF
  const pdfBlob = await dmapi.templateApi.getTemplatePdfRequest({
    Template_guid: template.Template_guid,
    data: {
      customerName: 'John Doe',
      invoiceNumber: 'INV-001',
      items: [
        { name: 'Web Development', price: '2000.00' },
        { name: 'Hosting Setup', price: '200.00' }
      ],
      total: '2200.00'
    }
  });
  
  // Convert to buffer and save
  const buffer = Buffer.from(await pdfBlob.arrayBuffer());
  await fs.writeFile('invoice.pdf', buffer);
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
  // Create a simple receipt template
  const template = await dmapi.templateApi.createTemplateRequest({
    Template_Name: 'Receipt Template',
    content: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 400px;">
        <h2 style="text-align: center; color: #333;">Receipt</h2>
        <hr>
        <p><strong>Customer:</strong> {{customerName}}</p>
        <p><strong>Date:</strong> {{date}}</p>
        <p><strong>Item:</strong> {{item}}</p>
        <p><strong>Amount:</strong> ${{amount}}</p>
        <hr>
        <p style="text-align: center;">Thank you for your business!</p>
      </div>
    `
  });
  
  // Generate PDF
  const pdfBlob = await dmapi.templateApi.getTemplatePdfRequest({
    Template_guid: template.Template_guid,
    data: {
      customerName: 'John Doe',
      date: new Date().toLocaleDateString(),
      item: 'Premium Subscription',
      amount: '29.99'
    }
  });
  
  // Create download link
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'receipt.pdf';
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