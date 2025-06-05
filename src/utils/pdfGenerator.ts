
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
