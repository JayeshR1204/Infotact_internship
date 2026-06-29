import axios from 'axios';

interface DownloadPayloadOptions {
  employeeId: string;
  payPeriod: string;
  authToken: string;
}

export async function downloadEmployeePayslip({ employeeId, payPeriod, authToken }: DownloadPayloadOptions): Promise<boolean> {
  try {
    // Replace with explicit process.env variables or runtime configurations
    const BASE_URL = 'https://api.workspace-hr.internal/v1'; 
    
    const response = await axios.get(`${BASE_URL}/employees/${employeeId}/payslips/download`, {
      params: { period: payPeriod },
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/pdf'
      },
      // Essential override to tell Axios not to parse the stream payload bytes as UTF-8 JSON text strings
      responseType: 'blob' 
    });

    // Create a local virtual asset tracking path mapping to the in-memory binary asset structure
    const fileBlobRef = new Blob([response.data], { type: 'application/pdf' });
    const dynamicDownloadUrl = window.URL.createObjectURL(fileBlobRef);
    
    // Inject a clean virtual anchor element, dispatch human trigger behavior, then immediately purge the DOM references
    const hiddenAnchorElement = document.createElement('a');
    hiddenAnchorElement.href = dynamicDownloadUrl;
    hiddenAnchorElement.download = `payslip_${employeeId}_${payPeriod}.pdf`;
    
    document.body.appendChild(hiddenAnchorElement);
    hiddenAnchorElement.click();
    
    // Immediate Garbage Collection cleanup pass
    document.body.removeChild(hiddenAnchorElement);
    window.URL.revokeObjectURL(dynamicDownloadUrl);
    
    return true;
  } catch (err) {
    console.error('Binary payload pipeline compilation interrupted:', err);
    throw new Error('Could not access remote asset cluster registry. Try downloading later.');
  }
}

