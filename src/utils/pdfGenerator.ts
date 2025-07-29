
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
    <div style="font-family: Arial, sans-serif; padding: 0; margin: 0; background: white; width: 210mm; min-height: 297mm;">
      <!-- Header with logos and blue background -->
      <div style="background: #1E90FF; padding: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
        <div style="display: flex; align-items: center;">
          <div style="width: 60px; height: 60px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
            <span style="font-weight: bold; color: #1E90FF; font-size: 14px;">ONEPOS</span>
          </div>
          <div style="color: white;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold;">G1 - Žádost o akceptaci platebních karet</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Číslo zmluvy: ${contractNumber}</p>
          </div>
        </div>
        <div style="width: 120px; height: 40px; background: white; border-radius: 5px; display: flex; align-items: center; justify-content: center;">
          <span style="font-weight: bold; color: #333; font-size: 12px;">Global Payments</span>
        </div>
      </div>

      <div style="padding: 0 30px;">
        <!-- 1. ÚDAJE O SPOLEČNOSTI -->
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #333;">1. ÚDAJE O SPOLEČNOSTI</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div>
              <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Obchodní název / název společnosti</label>
              <div style="border: 1px solid #ddd; padding: 8px; background: #f9f9f9; min-height: 20px;">${companyInfo.companyName}</div>
            </div>
            <div>
              <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">IČO</label>
              <div style="border: 1px solid #ddd; padding: 8px; background: #f9f9f9; min-height: 20px;">${companyInfo.ico}</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div>
              <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">DIČ</label>
              <div style="border: 1px solid #ddd; padding: 8px; background: #f9f9f9; min-height: 20px;">${companyInfo.dic || ''}</div>
            </div>
            <div>
              <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">DPH</label>
              <div style="border: 1px solid #ddd; padding: 8px; background: #f9f9f9; min-height: 20px;">${companyInfo.vatNumber || ''}</div>
            </div>
          </div>

          <!-- Kontaktná adresa -->
          <h3 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0; color: #333;">Kontaktná adresa</h3>
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div>
              <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Ulica a číslo</label>
              <div style="border: 1px solid #ddd; padding: 8px; background: #f9f9f9; min-height: 20px;">${companyInfo.address.street}</div>
            </div>
            <div>
              <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Mesto</label>
              <div style="border: 1px solid #ddd; padding: 8px; background: #f9f9f9; min-height: 20px;">${companyInfo.address.city}</div>
            </div>
            <div>
              <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">PSČ</label>
              <div style="border: 1px solid #ddd; padding: 8px; background: #f9f9f9; min-height: 20px;">${companyInfo.address.zipCode}</div>
            </div>
          </div>

          <!-- Kontaktné osoby -->
          <h3 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0; color: #333;">Kontaktné osoby</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <h4 style="font-size: 12px; font-weight: bold; margin-bottom: 10px; color: #333;">Obchodný kontakt</h4>
              <div style="margin-bottom: 8px;">
                <label style="font-size: 11px; color: #666; display: block; margin-bottom: 2px;">Meno a priezvisko</label>
                <div style="border: 1px solid #ddd; padding: 6px; background: #f9f9f9; font-size: 12px;">${contactInfo.firstName} ${contactInfo.lastName}</div>
              </div>
              <div style="margin-bottom: 8px;">
                <label style="font-size: 11px; color: #666; display: block; margin-bottom: 2px;">Email</label>
                <div style="border: 1px solid #ddd; padding: 6px; background: #f9f9f9; font-size: 12px;">${contactInfo.email}</div>
              </div>
              <div>
                <label style="font-size: 11px; color: #666; display: block; margin-bottom: 2px;">Telefón</label>
                <div style="border: 1px solid #ddd; padding: 6px; background: #f9f9f9; font-size: 12px;">${contactInfo.phonePrefix} ${contactInfo.phone}</div>
              </div>
            </div>
            <div>
              <h4 style="font-size: 12px; font-weight: bold; margin-bottom: 10px; color: #333;">Technický kontakt</h4>
              <div style="margin-bottom: 8px;">
                <label style="font-size: 11px; color: #666; display: block; margin-bottom: 2px;">Meno a priezvisko</label>
                <div style="border: 1px solid #ddd; padding: 6px; background: #f9f9f9; font-size: 12px;">${contactInfo.firstName} ${contactInfo.lastName}</div>
              </div>
              <div style="margin-bottom: 8px;">
                <label style="font-size: 11px; color: #666; display: block; margin-bottom: 2px;">Email</label>
                <div style="border: 1px solid #ddd; padding: 6px; background: #f9f9f9; font-size: 12px;">${contactInfo.email}</div>
              </div>
              <div>
                <label style="font-size: 11px; color: #666; display: block; margin-bottom: 2px;">Telefón</label>
                <div style="border: 1px solid #ddd; padding: 6px; background: #f9f9f9; font-size: 12px;">${contactInfo.phonePrefix} ${contactInfo.phone}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. ÚDAJE O PROVOZOVNĚ OBCHODNÍKA -->
        <div style="margin-bottom: 25px; page-break-inside: avoid;">
          <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #333;">2. ÚDAJE O PROVOZOVNĚ OBCHODNÍKA</h2>
          
          ${businessLocations.map((location, index) => `
            <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; background: #fafafa;">
              <h3 style="font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #333;">Prevádzka ${index + 1}: ${location.name}</h3>
              <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <div>
                  <label style="font-size: 11px; color: #666; display: block; margin-bottom: 2px;">Adresa</label>
                  <div style="border: 1px solid #ccc; padding: 6px; background: white; font-size: 12px;">${location.address.street}, ${location.address.city}</div>
                </div>
                <div>
                  <label style="font-size: 11px; color: #666; display: block; margin-bottom: 2px;">PSČ</label>
                  <div style="border: 1px solid #ccc; padding: 6px; background: white; font-size: 12px;">${location.address.zipCode}</div>
                </div>
                <div>
                  <label style="font-size: 11px; color: #666; display: block; margin-bottom: 2px;">MCC kód</label>
                  <div style="border: 1px solid #ccc; padding: 6px; background: white; font-size: 12px;">${location.mccCode || ''}</div>
                </div>
              </div>
              
              <!-- Terminály tabuľka -->
              <h4 style="font-size: 12px; font-weight: bold; margin-bottom: 8px; color: #333;">Terminály</h4>
              <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                <thead>
                  <tr style="background: #e9e9e9;">
                    <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Typ terminálu</th>
                    <th style="border: 1px solid #ccc; padding: 6px; text-align: center;">Počet</th>
                    <th style="border: 1px solid #ccc; padding: 6px; text-align: right;">Mies. poplatok</th>
                    <th style="border: 1px solid #ccc; padding: 6px; text-align: right;">Celkom</th>
                  </tr>
                </thead>
                <tbody>
                  ${deviceSelection.dynamicCards.filter(item => item.type === 'device' && item.locationId === location.id).map(device => `
                    <tr>
                      <td style="border: 1px solid #ccc; padding: 6px;">${device.name}</td>
                      <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">${device.count}</td>
                      <td style="border: 1px solid #ccc; padding: 6px; text-align: right;">€${device.monthlyFee}</td>
                      <td style="border: 1px solid #ccc; padding: 6px; text-align: right; font-weight: bold;">€${(device.count * device.monthlyFee).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `).join('')}
        </div>

        <!-- Funkcionality checkboxy -->
        <div style="margin-bottom: 30px;">
          <h3 style="font-size: 14px; font-weight: bold; margin-bottom: 15px; color: #333;">Požadované funkcionality</h3>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
            <div>
              <h4 style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">ECOMMERCE</h4>
              <div style="font-size: 11px; line-height: 1.4;">
                <div style="margin-bottom: 4px;"><input type="checkbox" style="margin-right: 5px;"> Payment Gateway</div>
                <div style="margin-bottom: 4px;"><input type="checkbox" style="margin-right: 5px;"> API Integration</div>
                <div style="margin-bottom: 4px;"><input type="checkbox" style="margin-right: 5px;"> Hosted Payment Page</div>
              </div>
            </div>
            <div>
              <h4 style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">POS</h4>
              <div style="font-size: 11px; line-height: 1.4;">
                <div style="margin-bottom: 4px;"><input type="checkbox" style="margin-right: 5px;"> Card Present</div>
                <div style="margin-bottom: 4px;"><input type="checkbox" style="margin-right: 5px;"> Contactless</div>
                <div style="margin-bottom: 4px;"><input type="checkbox" style="margin-right: 5px;"> Mobile POS</div>
              </div>
            </div>
            <div>
              <h4 style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">PAYMENT METHODS</h4>
              <div style="font-size: 11px; line-height: 1.4;">
                <div style="margin-bottom: 4px;"><input type="checkbox" style="margin-right: 5px;"> VISA</div>
                <div style="margin-bottom: 4px;"><input type="checkbox" style="margin-right: 5px;"> Mastercard</div>
                <div style="margin-bottom: 4px;"><input type="checkbox" style="margin-right: 5px;"> American Express</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Signature Area -->
        <div style="margin-top: 50px; display: flex; justify-content: space-between; align-items: end;">
          <div style="width: 40%;">
            <p style="font-size: 12px; margin-bottom: 5px; color: #666;">Dátum a miesto:</p>
            <div style="border-bottom: 1px solid #333; height: 25px; margin-bottom: 30px;"></div>
          </div>
          <div style="width: 40%; text-align: center;">
            <p style="font-size: 12px; margin-bottom: 5px; color: #666;">Podpis žiadateľa:</p>
            <div style="border: 1px solid #333; height: 60px; display: flex; align-items: center; justify-content: center; background: #fafafa;">
              ${signatureDataUrl ? `<img src="${signatureDataUrl}" style="max-height: 50px; max-width: 90%;" />` : '<span style="color: #999; font-size: 11px;">Podpis</span>'}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="position: absolute; bottom: 20px; left: 30px; right: 30px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #666;">
        <div style="display: flex; align-items: center;">
          <div style="width: 20px; height: 20px; background: #1E90FF; border-radius: 50%; margin-right: 8px;"></div>
          <span style="font-weight: bold;">ONEPOS</span>
        </div>
        <span>Strana 1/4</span>
      </div>
    </div>
  `;
};

// Create G2 document template
const createG2Template = (contractNumber: string, data: OnboardingData, signatureDataUrl?: string): string => {
  const { authorizedPersons, actualOwners } = data;
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 0; margin: 0; background: white; width: 210mm; min-height: 297mm;">
      <!-- Header with logos and blue background -->
      <div style="background: #1E90FF; padding: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
        <div style="display: flex; align-items: center;">
          <div style="width: 60px; height: 60px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
            <span style="font-weight: bold; color: #1E90FF; font-size: 14px;">ONEPOS</span>
          </div>
          <div style="color: white;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold;">G2 - Prohlášení o skutečném majiteli</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Číslo zmluvy: ${contractNumber}</p>
          </div>
        </div>
        <div style="width: 120px; height: 40px; background: white; border-radius: 5px; display: flex; align-items: center; justify-content: center;">
          <span style="font-weight: bold; color: #333; font-size: 12px;">Global Payments</span>
        </div>
      </div>

      <div style="padding: 0 30px;">
        <!-- Oprávnené osoby -->
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #333;">1. OPRÁVNENÉ OSOBY</h2>
          ${authorizedPersons.map((person, index) => `
            <div style="margin-bottom: 25px; padding: 20px; border: 1px solid #ddd; background: #fafafa;">
              <h3 style="font-size: 14px; font-weight: bold; margin-bottom: 15px; color: #333;">Oprávnená osoba ${index + 1}</h3>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                  <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Meno a priezvisko</label>
                  <div style="border: 1px solid #ccc; padding: 8px; background: white; min-height: 20px; font-size: 12px;">${person.firstName} ${person.lastName}</div>
                </div>
                <div>
                  <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Pozícia v spoločnosti</label>
                  <div style="border: 1px solid #ccc; padding: 8px; background: white; min-height: 20px; font-size: 12px;">${person.position}</div>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                  <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Dátum narodenia</label>
                  <div style="border: 1px solid #ccc; padding: 8px; background: white; min-height: 20px; font-size: 12px;">${person.birthDate}</div>
                </div>
                <div>
                  <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Miesto narodenia</label>
                  <div style="border: 1px solid #ccc; padding: 8px; background: white; min-height: 20px; font-size: 12px;">${person.birthPlace}</div>
                </div>
              </div>

              <div style="margin-bottom: 15px;">
                <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Trvalá adresa</label>
                <div style="border: 1px solid #ccc; padding: 8px; background: white; min-height: 20px; font-size: 12px;">${person.permanentAddress}</div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                  <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Typ dokladu totožnosti</label>
                  <div style="border: 1px solid #ccc; padding: 8px; background: white; min-height: 20px; font-size: 12px;">${person.documentType}</div>
                </div>
                <div>
                  <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Číslo dokladu</label>
                  <div style="border: 1px solid #ccc; padding: 8px; background: white; min-height: 20px; font-size: 12px;">${person.documentNumber}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Skutočný majitelia -->
        <div style="margin-bottom: 40px;">
          <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #333;">2. SKUTOČNÝ MAJITELIA</h2>
          ${actualOwners.map((owner, index) => `
            <div style="margin-bottom: 25px; padding: 20px; border: 1px solid #ddd; background: #fafafa;">
              <h3 style="font-size: 14px; font-weight: bold; margin-bottom: 15px; color: #333;">Skutočný majiteľ ${index + 1}</h3>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                  <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Meno a priezvisko</label>
                  <div style="border: 1px solid #ccc; padding: 8px; background: white; min-height: 20px; font-size: 12px;">${owner.firstName} ${owner.lastName}</div>
                </div>
                <div>
                  <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Rodné priezvisko</label>
                  <div style="border: 1px solid #ccc; padding: 8px; background: white; min-height: 20px; font-size: 12px;">${owner.maidenName || ''}</div>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                  <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Dátum narodenia</label>
                  <div style="border: 1px solid #ccc; padding: 8px; background: white; min-height: 20px; font-size: 12px;">${owner.birthDate}</div>
                </div>
                <div>
                  <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Miesto narodenia</label>
                  <div style="border: 1px solid #ccc; padding: 8px; background: white; min-height: 20px; font-size: 12px;">${owner.birthPlace}</div>
                </div>
              </div>

              <div style="margin-bottom: 15px;">
                <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Trvalá adresa</label>
                <div style="border: 1px solid #ccc; padding: 8px; background: white; min-height: 20px; font-size: 12px;">${owner.permanentAddress}</div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                  <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Rodné číslo</label>
                  <div style="border: 1px solid #ccc; padding: 8px; background: white; min-height: 20px; font-size: 12px;">${owner.birthNumber}</div>
                </div>
                <div>
                  <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Štátna príslušnosť</label>
                  <div style="border: 1px solid #ccc; padding: 8px; background: white; min-height: 20px; font-size: 12px;">${owner.citizenship}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Signature Area -->
        <div style="margin-top: 50px; display: flex; justify-content: space-between; align-items: end;">
          <div style="width: 40%;">
            <p style="font-size: 12px; margin-bottom: 5px; color: #666;">Dátum a miesto:</p>
            <div style="border-bottom: 1px solid #333; height: 25px; margin-bottom: 30px;"></div>
          </div>
          <div style="width: 40%; text-align: center;">
            <p style="font-size: 12px; margin-bottom: 5px; color: #666;">Podpis žiadateľa:</p>
            <div style="border: 1px solid #333; height: 60px; display: flex; align-items: center; justify-content: center; background: #fafafa;">
              ${signatureDataUrl ? `<img src="${signatureDataUrl}" style="max-height: 50px; max-width: 90%;" />` : '<span style="color: #999; font-size: 11px;">Podpis</span>'}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="position: absolute; bottom: 20px; left: 30px; right: 30px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #666;">
        <div style="display: flex; align-items: center;">
          <div style="width: 20px; height: 20px; background: #1E90FF; border-radius: 50%; margin-right: 8px;"></div>
          <span style="font-weight: bold;">ONEPOS</span>
        </div>
        <span>Strana 1/2</span>
      </div>
    </div>
  `;
};
