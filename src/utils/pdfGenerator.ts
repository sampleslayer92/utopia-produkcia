
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { OnboardingData } from '@/types/onboarding';

export const generateContractPDF = async (contractNumber: string): Promise<void> => {
  const element = document.getElementById('contract-preview');
  
  if (!element) {
    throw new Error('Contract preview element not found');
  }

  try {
    // Optimize for better PDF quality
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      height: element.scrollHeight,
      width: element.scrollWidth,
      scrollX: 0,
      scrollY: 0,
      allowTaint: true,
      foreignObjectRendering: true
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Create PDF with A4 format
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Add additional pages if needed with proper page breaks
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    // Add metadata
    pdf.setProperties({
      title: `Zmluva ${contractNumber}`,
      subject: 'Zmluva o poskytovaní služieb',
      author: 'PayTech Solutions s.r.o.',
      creator: 'PayTech Admin System',
      producer: 'PayTech PDF Generator'
    });

    // Save the PDF
    pdf.save(`zmluva-${contractNumber}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const generateContractPreview = async (contractNumber: string): Promise<string> => {
  const element = document.getElementById('contract-preview');
  
  if (!element) {
    throw new Error('Contract preview element not found');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 1,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    return canvas.toDataURL('image/png', 0.8);
  } catch (error) {
    console.error('Error generating preview:', error);
    throw error;
  }
};

// Document types for multi-document generation
export type DocumentType = 'main' | 'g1' | 'g2';

// Generate G1 document (Žádost o akceptaci platebních karet)
export const generateG1Document = async (
  contractNumber: string, 
  onboardingData: OnboardingData, 
  signatureDataUrl?: string
): Promise<void> => {
  const htmlContent = createG1Template(contractNumber, onboardingData, signatureDataUrl);
  await generatePDFFromHTML(htmlContent, `g1-zadost-${contractNumber}.pdf`);
};

// Generate G2 document (Prohlášení o skutečném majiteli)
export const generateG2Document = async (
  contractNumber: string, 
  onboardingData: OnboardingData, 
  signatureDataUrl?: string
): Promise<void> => {
  const htmlContent = createG2Template(contractNumber, onboardingData, signatureDataUrl);
  await generatePDFFromHTML(htmlContent, `g2-prohlaseni-${contractNumber}.pdf`);
};

// Generic PDF generation from HTML content
const generatePDFFromHTML = async (htmlContent: string, filename: string): Promise<void> => {
  // Create temporary container
  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = htmlContent;
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.width = '210mm';
  tempContainer.style.backgroundColor = '#ffffff';
  document.body.appendChild(tempContainer);

  try {
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      height: tempContainer.scrollHeight,
      width: tempContainer.scrollWidth
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } finally {
    document.body.removeChild(tempContainer);
  }
};

// Create G1 document template
const createG1Template = (contractNumber: string, data: OnboardingData, signatureDataUrl?: string): string => {
  const { contactInfo, companyInfo, businessLocations, deviceSelection } = data;
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; max-width: 210mm;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 24px; margin-bottom: 10px;">G1 - Žádost o akceptaci platebních karet</h1>
        <p style="font-size: 14px; color: #666;">Číslo zmluvy: ${contractNumber}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; border-bottom: 2px solid #333; padding-bottom: 5px;">Kontaktné údaje</h2>
        <table style="width: 100%; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 30%;">Meno a priezvisko:</td>
            <td style="padding: 8px;">${contactInfo.firstName} ${contactInfo.lastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Email:</td>
            <td style="padding: 8px;">${contactInfo.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Telefón:</td>
            <td style="padding: 8px;">${contactInfo.phonePrefix} ${contactInfo.phone}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; border-bottom: 2px solid #333; padding-bottom: 5px;">Firemné údaje</h2>
        <table style="width: 100%; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 30%;">Názov spoločnosti:</td>
            <td style="padding: 8px;">${companyInfo.companyName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">IČO:</td>
            <td style="padding: 8px;">${companyInfo.ico}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">DIČ:</td>
            <td style="padding: 8px;">${companyInfo.dic}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Adresa:</td>
            <td style="padding: 8px;">${companyInfo.address.street}, ${companyInfo.address.city}, ${companyInfo.address.zipCode}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; border-bottom: 2px solid #333; padding-bottom: 5px;">Prevádzkové miesta</h2>
        ${businessLocations.map((location, index) => `
          <div style="margin-top: 15px; padding: 15px; border: 1px solid #ddd;">
            <h3 style="font-size: 16px; margin-bottom: 10px;">Prevádzka ${index + 1}: ${location.name}</h3>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 4px; font-weight: bold; width: 30%;">Adresa:</td>
                <td style="padding: 4px;">${location.address.street}, ${location.address.city} ${location.address.zipCode}</td>
              </tr>
              <tr>
                <td style="padding: 4px; font-weight: bold;">Sektor:</td>
                <td style="padding: 4px;">${location.businessSector}</td>
              </tr>
              <tr>
                <td style="padding: 4px; font-weight: bold;">Odhadovaný obrat:</td>
                <td style="padding: 4px;">€${location.estimatedTurnover}</td>
              </tr>
            </table>
          </div>
        `).join('')}
      </div>

      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 18px; border-bottom: 2px solid #333; padding-bottom: 5px;">Výber zariadení a služieb</h2>
        <div style="margin-top: 15px;">
          <p style="font-weight: bold; margin-bottom: 10px;">Vybrané riešenia: ${deviceSelection.selectedSolutions.join(', ')}</p>
          ${deviceSelection.dynamicCards.map((item, index) => `
            <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #eee;">
              <strong>${item.name}</strong> (${item.type === 'device' ? 'Zariadenie' : 'Služba'}) - Počet: ${item.count}
              <br>
              <small>${item.description}</small>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-top: 80px;">
        <div style="display: flex; justify-content: space-between; align-items: end;">
          <div style="width: 45%;">
            <p style="font-size: 14px; margin-bottom: 5px;">Dátum a miesto:</p>
            <div style="border-bottom: 1px solid #333; height: 20px; margin-bottom: 40px;"></div>
          </div>
          <div style="width: 45%; text-align: center;">
            <p style="font-size: 14px; margin-bottom: 5px;">Podpis žiadateľa:</p>
            <div id="signature-area" style="border: 1px solid #333; height: 80px; display: flex; align-items: center; justify-content: center;">
              ${signatureDataUrl ? `<img src="${signatureDataUrl}" style="max-height: 70px; max-width: 100%;" />` : 'Podpis'}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Create G2 document template
const createG2Template = (contractNumber: string, data: OnboardingData, signatureDataUrl?: string): string => {
  const { authorizedPersons, actualOwners } = data;
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; max-width: 210mm;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 24px; margin-bottom: 10px;">G2 - Prohlášení o skutečném majiteli</h1>
        <p style="font-size: 14px; color: #666;">Číslo zmluvy: ${contractNumber}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; border-bottom: 2px solid #333; padding-bottom: 5px;">Oprávnené osoby</h2>
        ${authorizedPersons.map((person, index) => `
          <div style="margin-top: 20px; padding: 15px; border: 1px solid #ddd;">
            <h3 style="font-size: 16px; margin-bottom: 10px;">Oprávnená osoba ${index + 1}</h3>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 4px; font-weight: bold; width: 30%;">Meno a priezvisko:</td>
                <td style="padding: 4px;">${person.firstName} ${person.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 4px; font-weight: bold;">Dátum narodenia:</td>
                <td style="padding: 4px;">${person.birthDate}</td>
              </tr>
              <tr>
                <td style="padding: 4px; font-weight: bold;">Miesto narodenia:</td>
                <td style="padding: 4px;">${person.birthPlace}</td>
              </tr>
              <tr>
                <td style="padding: 4px; font-weight: bold;">Trvalá adresa:</td>
                <td style="padding: 4px;">${person.permanentAddress}</td>
              </tr>
              <tr>
                <td style="padding: 4px; font-weight: bold;">Pozícia:</td>
                <td style="padding: 4px;">${person.position}</td>
              </tr>
              <tr>
                <td style="padding: 4px; font-weight: bold;">Doklad totožnosti:</td>
                <td style="padding: 4px;">${person.documentType} ${person.documentNumber}</td>
              </tr>
            </table>
          </div>
        `).join('')}
      </div>

      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 18px; border-bottom: 2px solid #333; padding-bottom: 5px;">Skutočný majitelia</h2>
        ${actualOwners.map((owner, index) => `
          <div style="margin-top: 20px; padding: 15px; border: 1px solid #ddd;">
            <h3 style="font-size: 16px; margin-bottom: 10px;">Skutočný majiteľ ${index + 1}</h3>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 4px; font-weight: bold; width: 30%;">Meno a priezvisko:</td>
                <td style="padding: 4px;">${owner.firstName} ${owner.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 4px; font-weight: bold;">Dátum narodenia:</td>
                <td style="padding: 4px;">${owner.birthDate}</td>
              </tr>
              <tr>
                <td style="padding: 4px; font-weight: bold;">Miesto narodenia:</td>
                <td style="padding: 4px;">${owner.birthPlace}</td>
              </tr>
              <tr>
                <td style="padding: 4px; font-weight: bold;">Trvalá adresa:</td>
                <td style="padding: 4px;">${owner.permanentAddress}</td>
              </tr>
              <tr>
                <td style="padding: 4px; font-weight: bold;">Rodné číslo:</td>
                <td style="padding: 4px;">${owner.birthNumber}</td>
              </tr>
              <tr>
                <td style="padding: 4px; font-weight: bold;">Štátna príslušnosť:</td>
                <td style="padding: 4px;">${owner.citizenship}</td>
              </tr>
              ${owner.maidenName ? `
              <tr>
                <td style="padding: 4px; font-weight: bold;">Rodné priezvisko:</td>
                <td style="padding: 4px;">${owner.maidenName}</td>
              </tr>
              ` : ''}
            </table>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 80px;">
        <div style="display: flex; justify-content: space-between; align-items: end;">
          <div style="width: 45%;">
            <p style="font-size: 14px; margin-bottom: 5px;">Dátum a miesto:</p>
            <div style="border-bottom: 1px solid #333; height: 20px; margin-bottom: 40px;"></div>
          </div>
          <div style="width: 45%; text-align: center;">
            <p style="font-size: 14px; margin-bottom: 5px;">Podpis žiadateľa:</p>
            <div id="signature-area" style="border: 1px solid #333; height: 80px; display: flex; align-items: center; justify-content: center;">
              ${signatureDataUrl ? `<img src="${signatureDataUrl}" style="max-height: 70px; max-width: 100%;" />` : 'Podpis'}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};
