import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/types/onboarding';

export const generateContractPDF = async (contractData: any, documentType: 'G1' | 'G2' = 'G1', customTemplate?: any): Promise<Blob> => {
  try {
    let htmlContent: string;
    let templateData = customTemplate;
    
    // If no custom template provided, try to load from database
    if (!templateData) {
      try {
        const { data: templates } = await supabase
          .from('contract_templates')
          .select('*')
          .eq('template_data->>type', documentType)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (templates && templates.length > 0) {
          templateData = templates[0].template_data;
        }
      } catch (error) {
        console.warn('Could not load template from database, using default:', error);
      }
    }
    
    if (documentType === 'G1') {
      htmlContent = templateData ? createTemplateBasedG1(contractData, templateData) : createG1Template(contractData);
    } else {
      htmlContent = templateData ? createTemplateBasedG2(contractData, templateData) : createG2Template(contractData);
    }

    // Create a temporary container for HTML rendering
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '210mm';
    document.body.appendChild(container);

    // Generate PDF using html2canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Remove temporary container
    document.body.removeChild(container);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Legacy function for backward compatibility
export const generateContractPDFLegacy = async (contractNumber: string): Promise<void> => {
  const element = document.getElementById('contract-preview');
  
  if (!element) {
    throw new Error('Contract preview element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff'
  });

  const imgData = canvas.toDataURL('image/png', 1.0);
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
  pdf.save(`zmluva-${contractNumber}.pdf`);
};

// Template-based generators
const createTemplateBasedG1 = (data: any, template: any): string => {
  const styling = template.styling || {};
  const header = template.header || {};
  const footer = template.footer || {};
  
  return `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: ${styling.fontFamily || 'Arial, sans-serif'};
            font-size: ${styling.fontSize || '12px'};
            margin: ${styling.margin || '20px'};
            color: #333;
            line-height: 1.4;
          }
          .header {
            background: ${header.backgroundColor || '#1E90FF'};
            color: white;
            padding: 20px;
            text-align: center;
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 30px;
          }
          .section {
            margin-bottom: 25px;
          }
          .section-title {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 15px;
            color: ${styling.primaryColor || '#1E90FF'};
            border-bottom: 2px solid ${styling.primaryColor || '#1E90FF'};
            padding-bottom: 5px;
          }
          .field-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 10px;
          }
          .field {
            margin-bottom: 8px;
          }
          .field-label {
            font-weight: bold;
            margin-bottom: 3px;
          }
          .field-value {
            border-bottom: 1px dotted #ccc;
            min-height: 20px;
            padding: 2px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          ${header.title || 'G1 - Žiadosť o akceptáciu platobných kariet'}
        </div>
        ${generateSectionsHTML(data, template.sections || [])}
      </body>
    </html>
  `;
};

const createTemplateBasedG2 = (data: any, template: any): string => {
  const styling = template.styling || {};
  const header = template.header || {};
  
  return `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: ${styling.fontFamily || 'Arial, sans-serif'};
            font-size: ${styling.fontSize || '12px'};
            margin: ${styling.margin || '20px'};
            color: #333;
            line-height: 1.4;
          }
          .header {
            background: ${header.backgroundColor || '#1E90FF'};
            color: white;
            padding: 20px;
            text-align: center;
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 30px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          ${header.title || 'G2 - Prohlášení o skutečném majiteli'}
        </div>
        ${generateSectionsHTML(data, template.sections || [])}
      </body>
    </html>
  `;
};

const generateSectionsHTML = (data: any, sections: any[]): string => {
  return sections.map(section => {
    return `<div class="section"><div class="section-title">${section.title}</div></div>`;
  }).join('');
};

const createG1Template = (data: any): string => {
  return `<html><body><h1>G1 Default Template</h1></body></html>`;
};

const createG2Template = (data: any): string => {
  return `<html><body><h1>G2 Default Template</h1></body></html>`;
};

// Legacy exports for backward compatibility
export type DocumentType = 'g1' | 'g2';

export const generateG1Document = async (contractNumber: string, contractData: any, signatureDataUrl?: string): Promise<void> => {
  const blob = await generateContractPDF(contractData, 'G1');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `g1-${contractNumber}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generateG2Document = async (contractNumber: string, contractData: any, signatureDataUrl?: string): Promise<void> => {
  const blob = await generateContractPDF(contractData, 'G2');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `g2-${contractNumber}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};