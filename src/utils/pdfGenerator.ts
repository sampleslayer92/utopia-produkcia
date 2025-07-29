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
  return `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @page {
            margin: 0;
            size: A4;
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            margin: 0;
            padding: 0;
            line-height: 1.2;
            color: #000;
            background: white;
          }
          .page {
            width: 210mm;
            min-height: 297mm;
            padding: 10mm;
            box-sizing: border-box;
            background: white;
          }
          .header {
            background: #1E90FF;
            color: white;
            padding: 8px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 15px;
          }
          .header-title {
            flex: 1;
            text-align: center;
          }
          .header-logo {
            font-size: 12px;
            font-weight: normal;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 10px;
            text-decoration: underline;
          }
          .form-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          .form-table td, .form-table th {
            border: 1px solid #000;
            padding: 4px 6px;
            font-size: 9px;
            vertical-align: top;
          }
          .form-table th {
            background: #f5f5f5;
            font-weight: bold;
            text-align: left;
          }
          .label-cell {
            background: #f9f9f9;
            font-weight: bold;
            width: 25%;
          }
          .input-cell {
            width: 75%;
            min-height: 18px;
            border-bottom: 1px dotted #999;
          }
          .checkbox-group {
            display: flex;
            gap: 15px;
            margin: 8px 0;
          }
          .checkbox-item {
            display: flex;
            align-items: center;
            gap: 5px;
          }
          .checkbox {
            width: 12px;
            height: 12px;
            border: 1px solid #000;
            display: inline-block;
          }
          .footer {
            position: fixed;
            bottom: 10mm;
            left: 10mm;
            right: 10mm;
            display: flex;
            justify-content: space-between;
            font-size: 8px;
            border-top: 1px solid #ccc;
            padding-top: 5px;
          }
          .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .three-column {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div></div>
            <div class="header-title">G1 - Žiadosť o akceptáciu platobných kariet</div>
            <div class="header-logo">onepos | globalpayments</div>
          </div>

          <!-- Sekcia 1: Údaje o spoločnosti -->
          <div class="section">
            <div class="section-title">1. ÚDAJE O SPOLEČNOSTI</div>
            
            <table class="form-table">
              <tr>
                <td class="label-cell">Název společnosti:</td>
                <td class="input-cell">${data?.companyInfo?.name || ''}</td>
                <td class="label-cell">IČO:</td>
                <td class="input-cell">${data?.companyInfo?.ico || ''}</td>
              </tr>
              <tr>
                <td class="label-cell">DIČ:</td>
                <td class="input-cell">${data?.companyInfo?.dic || ''}</td>
                <td class="label-cell">IČ DPH:</td>
                <td class="input-cell">${data?.companyInfo?.icDph || ''}</td>
              </tr>
              <tr>
                <td class="label-cell">Sídlo - ulice:</td>
                <td class="input-cell">${data?.companyInfo?.street || ''}</td>
                <td class="label-cell">Číslo popisné:</td>
                <td class="input-cell">${data?.companyInfo?.houseNumber || ''}</td>
              </tr>
              <tr>
                <td class="label-cell">Město:</td>
                <td class="input-cell">${data?.companyInfo?.city || ''}</td>
                <td class="label-cell">PSČ:</td>
                <td class="input-cell">${data?.companyInfo?.postalCode || ''}</td>
              </tr>
              <tr>
                <td class="label-cell">Země:</td>
                <td class="input-cell">${data?.companyInfo?.country || ''}</td>
                <td class="label-cell">Telefon:</td>
                <td class="input-cell">${data?.contactInfo?.phone || ''}</td>
              </tr>
              <tr>
                <td class="label-cell">E-mail:</td>
                <td class="input-cell" colspan="3">${data?.contactInfo?.email || ''}</td>
              </tr>
            </table>

            <table class="form-table">
              <tr>
                <th colspan="4">Kontaktní osoba pro obchodní záležitosti</th>
              </tr>
              <tr>
                <td class="label-cell">Jméno a příjmení:</td>
                <td class="input-cell">${data?.contactInfo?.businessContactName || ''}</td>
                <td class="label-cell">Telefon:</td>
                <td class="input-cell">${data?.contactInfo?.businessContactPhone || ''}</td>
              </tr>
              <tr>
                <td class="label-cell">E-mail:</td>
                <td class="input-cell" colspan="3">${data?.contactInfo?.businessContactEmail || ''}</td>
              </tr>
            </table>

            <table class="form-table">
              <tr>
                <th colspan="4">Kontaktní osoba pro technické záležitosti (pokud je jiná)</th>
              </tr>
              <tr>
                <td class="label-cell">Jméno a příjmení:</td>
                <td class="input-cell">${data?.contactInfo?.technicalContactName || ''}</td>
                <td class="label-cell">Telefon:</td>
                <td class="input-cell">${data?.contactInfo?.technicalContactPhone || ''}</td>
              </tr>
              <tr>
                <td class="label-cell">E-mail:</td>
                <td class="input-cell" colspan="3">${data?.contactInfo?.technicalContactEmail || ''}</td>
              </tr>
            </table>
          </div>

          <!-- Sekcia 2: Údaje o provozovne -->
          <div class="section">
            <div class="section-title">2. ÚDAJE O PROVOZOVNE OBCHODNÍKA</div>
            
            <table class="form-table">
              <tr>
                <td class="label-cell">Název provozovny:</td>
                <td class="input-cell" colspan="3">${data?.businessLocation?.name || ''}</td>
              </tr>
              <tr>
                <td class="label-cell">Adresa - ulice:</td>
                <td class="input-cell">${data?.businessLocation?.street || ''}</td>
                <td class="label-cell">Číslo popisné:</td>
                <td class="input-cell">${data?.businessLocation?.houseNumber || ''}</td>
              </tr>
              <tr>
                <td class="label-cell">Město:</td>
                <td class="input-cell">${data?.businessLocation?.city || ''}</td>
                <td class="label-cell">PSČ:</td>
                <td class="input-cell">${data?.businessLocation?.postalCode || ''}</td>
              </tr>
              <tr>
                <td class="label-cell">Země:</td>
                <td class="input-cell">${data?.businessLocation?.country || ''}</td>
                <td class="label-cell">Telefon:</td>
                <td class="input-cell">${data?.businessLocation?.phone || ''}</td>
              </tr>
            </table>

            <div class="checkbox-group">
              <div class="checkbox-item">
                <span class="checkbox"></span>
                <span>ECOMMERCE</span>
              </div>
              <div class="checkbox-item">
                <span class="checkbox"></span>
                <span>POS</span>
              </div>
            </div>

            <table class="form-table">
              <tr>
                <td class="label-cell">URL obchodu:</td>
                <td class="input-cell" colspan="3">${data?.businessLocation?.websiteUrl || ''}</td>
              </tr>
              <tr>
                <td class="label-cell">Měna:</td>
                <td class="input-cell">
                  <div class="checkbox-group">
                    <div class="checkbox-item">
                      <span class="checkbox"></span>
                      <span>CZK</span>
                    </div>
                    <div class="checkbox-item">
                      <span class="checkbox"></span>
                      <span>EUR</span>
                    </div>
                    <div class="checkbox-item">
                      <span class="checkbox"></span>
                      <span>Jiná:</span>
                    </div>
                  </div>
                </td>
                <td class="label-cell">MCC kód:</td>
                <td class="input-cell">${data?.businessLocation?.mccCode || ''}</td>
              </tr>
              <tr>
                <td class="label-cell">Popis činnosti:</td>
                <td class="input-cell" colspan="3">${data?.businessLocation?.businessDescription || ''}</td>
              </tr>
            </table>
          </div>

          <div class="footer">
            <div>ONEPOS 032024</div>
            <div>G1 - Žiadosť o akceptáciu platobných kariet</div>
            <div>Strana 1/4</div>
          </div>
        </div>
      </body>
    </html>
  `;
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