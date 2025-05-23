import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * A utility function to generate a PDF from HTML content
 */
export async function generatePDF(element: HTMLElement, filename: string = 'dara-documentation.pdf'): Promise<void> {
  try {
    // Display a loading indicator or message
    const loadingElement = document.createElement('div');
    loadingElement.style.position = 'fixed';
    loadingElement.style.top = '0';
    loadingElement.style.left = '0';
    loadingElement.style.width = '100%';
    loadingElement.style.height = '100%';
    loadingElement.style.backgroundColor = 'rgba(0,0,0,0.5)';
    loadingElement.style.display = 'flex';
    loadingElement.style.justifyContent = 'center';
    loadingElement.style.alignItems = 'center';
    loadingElement.style.zIndex = '9999';
    loadingElement.style.color = 'white';
    loadingElement.style.fontSize = '24px';
    loadingElement.textContent = 'Generating PDF... Please wait';
    document.body.appendChild(loadingElement);

    const pdf = new jsPDF('p', 'mm', 'a4', true);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margins = 10;
    
    // Clone the element to avoid modifying the original element
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    // Apply styles for PDF generation
    clonedElement.style.width = `${pdfWidth - margins * 2}mm`;
    clonedElement.style.padding = `${margins}mm`;
    clonedElement.style.backgroundColor = 'white';
    clonedElement.style.color = 'black';
    
    // Temporarily append the cloned element to the body but keep it hidden
    clonedElement.style.position = 'absolute';
    clonedElement.style.left = '-9999px';
    document.body.appendChild(clonedElement);
    
    // PDF title and metadata
    pdf.setProperties({
      title: 'DARA Platform Documentation',
      subject: 'Comprehensive documentation for the DARA Crypto Regulatory Compliance Platform',
      author: 'DARA Platform Team',
      keywords: 'DARA, crypto, compliance, regulatory, documentation',
      creator: 'DARA Platform'
    });
    
    // Function to add a header to each page
    const addHeader = (pageNumber: number) => {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('DARA Platform Documentation', margins, margins);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text(`Page ${pageNumber}`, pdfWidth - margins - 15, margins);
      pdf.setDrawColor(220, 220, 220);
      pdf.line(margins, margins + 2, pdfWidth - margins, margins + 2);
      pdf.setFontSize(10);
    };
    
    // Function to process sections of the document
    const processElement = async (element: HTMLElement, startY: number): Promise<number> => {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pdfWidth - margins * 2;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      // Check if the image will fit on the current page
      if (startY + imgHeight > pdfHeight - margins) {
        // Add a new page
        pdf.addPage();
        startY = margins * 2;
        addHeader(pdf.getNumberOfPages());
      }
      
      pdf.addImage(imgData, 'PNG', margins, startY, imgWidth, imgHeight);
      
      // Clean up
      canvas.remove();
      
      return startY + imgHeight + 5; // Return the Y position for the next element with a small gap
    };
    
    // Get all top-level sections from the cloned element
    const sections = Array.from(clonedElement.querySelectorAll('.card'));
    let currentY = margins * 2;
    
    // Add the first header
    addHeader(1);
    
    // Process each section
    for (let i = 0; i < sections.length; i++) {
      currentY = await processElement(sections[i] as HTMLElement, currentY);
    }
    
    // Clean up
    document.body.removeChild(clonedElement);
    document.body.removeChild(loadingElement);
    
    // Save the PDF
    pdf.save(filename);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('There was an error generating the PDF. Please try again.');
    
    // Clean up loading indicator if it exists
    const loadingElement = document.querySelector('[style*="position: fixed"][style*="z-index: 9999"]');
    if (loadingElement && loadingElement.parentNode) {
      loadingElement.parentNode.removeChild(loadingElement);
    }
  }
}

/**
 * Comprehensive PDF generation that captures all documentation tabs
 */
export async function generateSimplePDF(filename: string = 'dara-documentation.pdf'): Promise<void> {
  try {
    // Display a loading indicator or message
    const loadingElement = document.createElement('div');
    loadingElement.style.position = 'fixed';
    loadingElement.style.top = '0';
    loadingElement.style.left = '0';
    loadingElement.style.width = '100%';
    loadingElement.style.height = '100%';
    loadingElement.style.backgroundColor = 'rgba(0,0,0,0.5)';
    loadingElement.style.display = 'flex';
    loadingElement.style.justifyContent = 'center';
    loadingElement.style.alignItems = 'center';
    loadingElement.style.zIndex = '9999';
    loadingElement.style.color = 'white';
    loadingElement.style.fontSize = '24px';
    loadingElement.innerHTML = 'Generating PDF... <br/>This may take a minute, please wait';
    document.body.appendChild(loadingElement);
    
    // Get the documentation content element
    const docContainer = document.querySelector('.md\\:col-span-4') as HTMLElement;
    if (!docContainer) {
      throw new Error('Documentation content not found');
    }
    
    // Create a new PDF
    const pdf = new jsPDF('p', 'mm', 'a4', true);
    
    // Set PDF properties
    pdf.setProperties({
      title: 'DARA Platform Documentation',
      subject: 'Comprehensive documentation for the DARA Crypto Regulatory Compliance Platform',
      author: 'DARA Platform Team',
      keywords: 'DARA, crypto, compliance, regulatory, documentation',
      creator: 'DARA Platform'
    });
    
    // Add a cover page
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DARA Platform', 105, 80, { align: 'center' });
    pdf.text('Documentation', 105, 95, { align: 'center' });
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Comprehensive guide to the DARA Crypto Regulatory Compliance Platform', 105, 110, { align: 'center' });
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 120, { align: 'center' });
    
    // Get all tab triggers to know which tabs to activate
    const tabTriggers = Array.from(docContainer.querySelectorAll('[role="tab"]'));
    
    // Store original active tab to restore it later
    const originalActiveTab = docContainer.querySelector('[role="tab"][data-state="active"]');
    
    // For each tab, activate it and process its content
    for (let tabIndex = 0; tabIndex < tabTriggers.length; tabIndex++) {
      // Activate this tab to make its content visible
      const tabTrigger = tabTriggers[tabIndex] as HTMLElement;
      const tabValue = tabTrigger.getAttribute('data-value') || '';
      
      // First add a section divider page
      pdf.addPage();
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      
      // Get the tab text content
      const tabName = tabTrigger.textContent || `Section ${tabIndex + 1}`;
      pdf.text(tabName, 105, 100, { align: 'center' });
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('DARA Platform Documentation', 105, 115, { align: 'center' });
      
      // Click the tab to make its content visible in the DOM
      tabTrigger.click();
      
      // Force a small delay to ensure the tab content is rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Now find the content associated with this tab
      const tabContent = docContainer.querySelector(`[role="tabpanel"][data-state="active"]`) as HTMLElement;
      
      if (tabContent) {
        // Get all cards in this tab
        const cards = Array.from(tabContent.querySelectorAll('.card'));
        
        for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
          const card = cards[cardIndex] as HTMLElement;
          
          // Add a new page for each card
          pdf.addPage();
          
          // Add header
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`DARA Platform Documentation - ${tabName}`, 10, 10);
          pdf.text(`Page ${pdf.getNumberOfPages() - 2}`, 180, 10, { align: 'right' });
          pdf.line(10, 12, 200, 12);
          
          try {
            // Get card title for debugging
            const cardTitle = card.querySelector('.card-title')?.textContent || `Card ${cardIndex}`;
            console.log(`Processing card: ${cardTitle} in tab: ${tabName}`);
            
            // Make sure any accordion items are expanded for PDF capture
            const accordionItems = card.querySelectorAll('[data-state="closed"]');
            accordionItems.forEach(item => {
              // Force open any closed accordion items
              const trigger = item.querySelector('[data-orientation="vertical"]');
              if (trigger) {
                (trigger as HTMLElement).click();
              }
            });
            
            // Allow time for accordion animations to complete
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Capture the card as an image
            const canvas = await html2canvas(card, {
              scale: 1.5, // Higher scale for better quality
              useCORS: true,
              logging: false,
              allowTaint: true,
              backgroundColor: '#ffffff'
            });
            
            // Calculate dimensions to fit on PDF page
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margins = 15;
            
            const availableWidth = pdfWidth - (margins * 2);
            const availableHeight = pdfHeight - margins - 15; // Account for header
            
            // Calculate scaled dimensions to fit page while maintaining aspect ratio
            const aspectRatio = canvas.width / canvas.height;
            let imgWidth = availableWidth;
            let imgHeight = imgWidth / aspectRatio;
            
            // If image is too tall, scale based on height
            if (imgHeight > availableHeight) {
              imgHeight = availableHeight;
              imgWidth = imgHeight * aspectRatio;
            }
            
            // Add the image to the PDF
            pdf.addImage(imgData, 'PNG', margins, 15, imgWidth, imgHeight);
          } catch (cardError) {
            console.error('Error processing card:', cardError);
            pdf.text('Error rendering this section', 105, 100, { align: 'center' });
          }
        }
      }
    }
    
    // Restore the original active tab
    if (originalActiveTab) {
      (originalActiveTab as HTMLElement).click();
    }
    
    // Remove loading indicator
    document.body.removeChild(loadingElement);
    
    // Save the PDF
    pdf.save(filename);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('There was an error generating the PDF. Please try again.');
    
    // Clean up loading indicator if it exists
    const loadingElement = document.querySelector('[style*="position: fixed"][style*="z-index: 9999"]');
    if (loadingElement && loadingElement.parentNode) {
      loadingElement.parentNode.removeChild(loadingElement);
    }
  }
}