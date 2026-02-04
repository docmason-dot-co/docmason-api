import { DocMasonApi } from '../src/index';

// Initialize the API client
const dmapi = new DocMasonApi({
  apiKey: 'your-api-key-here'
});

// Browser-specific example
async function browserExample() {
  try {
    console.log('🌐 Browser PDF Generation Example');

    // Create a simple template
    const template = await dmapi.template.create({
      Template_Name: 'Simple Receipt',
      content: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Receipt</h2>
          <p><strong>Customer:</strong> {{customerName}}</p>
          <p><strong>Item:</strong> {{item}}</p>
          <p><strong>Amount:</strong> ${{amount}}</p>
          <p><strong>Date:</strong> {{date}}</p>
        </div>
      `
    });

    // Generate PDF
    const pdfArrayBuffer = await dmapi.template.generatePdf({
      Template_guid: template.template.Template_guid,
      data: {
        customerName: 'John Doe',
        item: 'Premium Subscription',
        amount: '29.99',
        date: new Date().toLocaleDateString()
      }
    });

    // Create download link
    const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    // Create and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'receipt.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('✅ PDF download triggered!');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

// Auto-run in browser
if (typeof window !== 'undefined') {
  // Add a button to trigger the example
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.createElement('button');
    button.textContent = 'Generate and Download PDF';
    button.onclick = browserExample;
    document.body.appendChild(button);
  });
}

export { browserExample };