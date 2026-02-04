import { DocMasonApi } from '../src/index';

// Initialize the API client
const dmapi = new DocMasonApi({
  apiKey: 'your-api-key-here',
  baseUrl: 'http://localhost:3001/api/v1' // Optional: defaults to production URL
});

async function basicExample() {
  try {
    console.log('🚀 Starting Doc Mason API example...');

    // 1. Create a template
    console.log('\n1. Creating a template...');
    const template = await dmapi.template.create({
      Template_Name: 'Invoice Template',
      content: `
        <h1>Invoice #{{invoiceNumber}}</h1>
        <div>
          <p><strong>Bill To:</strong> {{customerName}}</p>
          <p><strong>Date:</strong> {{date}}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Item</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
          </tr>
          {{#each items}}
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">{{name}}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">\${{price}}</td>
          </tr>
          {{/each}}
        </table>
        <p><strong>Total: \${{total}}</strong></p>
      `,
      Template_MarginTop: '20px',
      Template_MarginBottom: '20px',
      Template_MarginLeft: '20px',
      Template_MarginRight: '20px'
    });

    console.log('✅ Template created:', template.template.Template_guid);

    // 2. Get the template back
    console.log('\n2. Retrieving template...');
    const retrievedTemplate = await dmapi.template.get(template.template.Template_guid);
    console.log('✅ Template retrieved:', retrievedTemplate.template.Template_Name);

    // 3. Generate PDF
    console.log('\n3. Generating PDF...');
    const pdfBuffer = await dmapi.template.generatePdfBuffer({
      Template_guid: template.template.Template_guid,
      data: {
        invoiceNumber: 'INV-001',
        customerName: 'John Doe',
        date: new Date().toLocaleDateString(),
        items: [
          { name: 'Web Development', price: '2000.00' },
          { name: 'Hosting Setup', price: '200.00' }
        ],
        total: '2200.00'
      }
    });

    console.log('✅ PDF generated! Size:', pdfBuffer.length, 'bytes');

    // 4. In Node.js, save to file
    if (typeof require !== 'undefined') {
      try {
        const fs = require('fs');
        fs.writeFileSync('invoice.pdf', pdfBuffer);
        console.log('✅ PDF saved to invoice.pdf');
      } catch (error) {
        console.log('ℹ️ Could not save PDF to file (this is normal in browser environments)');
      }
    }

    // 5. List templates
    console.log('\n4. Listing templates...');
    const templateList = await dmapi.template.list({
      from: 0,
      to: 10
    });
    console.log('✅ Found', templateList.templates.length, 'templates');

    // 6. Create template data
    console.log('\n5. Creating template data...');
    const templateData = await dmapi.templateData.create({
      TemplateData_Name: 'Sample Invoice Data',
      Template_guid: template.template.Template_guid,
      User_guid: 'your-user-guid-here', // You would get this from your user context
      TemplateData_Interface: `{
        invoiceNumber: string;
        customerName: string;
        date: string;
        items: Array<{name: string; price: string}>;
        total: string;
      }`,
      TemplateData_Data: JSON.stringify({
        invoiceNumber: 'INV-002',
        customerName: 'Jane Smith',
        date: new Date().toLocaleDateString(),
        items: [
          { name: 'Logo Design', price: '500.00' },
          { name: 'Business Cards', price: '100.00' }
        ],
        total: '600.00'
      })
    });

    console.log('✅ Template data created:', templateData.templateData.TemplateData_guid);

    console.log('\n🎉 Example completed successfully!');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.errors) {
      console.error('Details:', error.errors);
    }
  }
}

// Run the example
if (require.main === module) {
  basicExample();
}

export { basicExample };