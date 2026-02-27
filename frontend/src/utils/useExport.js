import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const useExport = () => {
    
    const exportToPDF = async (elementId, filename = 'document.pdf') => {
        const element = document.getElementById(elementId);
        if (!element) {
            alert("Export Error: Document area not found.");
            return;
        }
        
        try {
            // Apply temporary styles for cleaner export
            const originalBackground = element.style.background;
            element.style.background = '#0a0a0a'; // Match Elite Shine Dark
            
            const canvas = await html2canvas(element, {
                scale: 2, // High resolution
                useCORS: true,
                logging: false,
                backgroundColor: '#0a0a0a'
            });
            
            element.style.background = originalBackground;
            
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            
            // Calculate PDF dimensions (A4 size)
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(filename);
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF document.');
        }
    };

    const exportToJPG = async (elementId, filename = 'document.jpg') => {
        const element = document.getElementById(elementId);
        if (!element) {
            alert("Export Error: Document area not found.");
            return;
        }
        
        try {
            const originalBackground = element.style.background;
            element.style.background = '#0a0a0a';
            
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#0a0a0a'
            });
            
            element.style.background = originalBackground;
            
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            
            // Create a temporary link to trigger download
            const link = document.createElement('a');
            link.download = filename;
            link.href = imgData;
            link.click();
            
        } catch (error) {
            console.error('Error generating JPG:', error);
            alert('Failed to generate JPG document.');
        }
    };

    return { exportToPDF, exportToJPG };
};
