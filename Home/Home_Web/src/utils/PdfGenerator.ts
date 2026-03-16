import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logoUrl from '../assets/interface_logo.jpeg';

// Add type declaration for jspdf-autotable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: any;
    }
}

export const generateConstructionReport = async (data: any, area: number, unit: string) => {
    const doc = new jsPDF();
    
    // Add Branding
    await drawBranding(doc);
    
    let y = 50;
    
    // Report Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("CONSTRUCTION COST REPORT", 20, y);
    y += 15;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, y);
    y += 10;
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 20, y);
    y += 10;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Built-up Area: ${area} ${unit}`, 20, y);
    y += 8;
    doc.text(`Total Estimated Cost: ₹${data.totalOptimizedCost?.toLocaleString('en-IN') || 0}`, 20, y);
    y += 15;
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Material Breakdown", 20, y);
    y += 10;
    
    const tableData = Object.entries(data.breakdown || {}).map(([name, mat]: [string, any]) => [
        name.replace(/_/g, ' ').toUpperCase(),
        `${mat.quantity || 0} ${mat.unit || ''}`,
        `₹${(mat.cost || 0).toLocaleString('en-IN')}`
    ]);
    
    doc.autoTable({
        startY: y,
        head: [['Material', 'Quantity', 'Cost']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillStyle: '#2563EB' }
    });
    
    doc.save('Construction_Report.pdf');
};

export const generateInteriorReport = async (data: any, packageType: string) => {
    const doc = new jsPDF();
    
    // Add Branding
    await drawBranding(doc);
    
    let y = 50;
    
    // Report Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("INTERIOR COST REPORT", 20, y);
    y += 15;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, y);
    y += 8;
    doc.text(`Package: ${packageType.toUpperCase()}`, 20, y);
    y += 12;
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 20, y);
    y += 10;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Grand Total: ₹${(data.overall_grand_total || 0).toLocaleString('en-IN')}`, 20, y);
    y += 15;
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Room-wise Breakdown", 20, y);
    y += 10;
    
    const tableData: any[] = [];
    data.rooms.forEach((room: any) => {
        tableData.push([
            { content: room.room_name, styles: { fontStyle: 'bold', fillColor: '#F8FAFC' } },
            { content: `₹${(room.room_total_cost || 0).toLocaleString('en-IN')}`, styles: { fontStyle: 'bold', fillColor: '#F8FAFC' } }
        ]);
        
        if (room.items) {
            room.items.forEach((item: any) => {
                tableData.push([
                    `  - ${item.work_name}`,
                    `₹${(item.item_cost || 0).toLocaleString('en-IN')}`
                ]);
            });
        }
    });
    
    doc.autoTable({
        startY: y,
        head: [['Work Description', 'Cost']],
        body: tableData,
        theme: 'plain',
        headStyles: { fillStyle: '#2563EB', textColor: '#FFFFFF' },
        columnStyles: {
            0: { cellWidth: 140 },
            1: { cellWidth: 40, halign: 'right' }
        }
    });
    
    doc.save('Interior_Report.pdf');
};

const generateDataUrl = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/jpeg'));
        };
        img.onerror = reject;
        img.src = url;
    });
};

const drawBranding = async (doc: jsPDF) => {
    try {
        const dataUrl = await generateDataUrl(logoUrl);
        doc.addImage(dataUrl, 'JPEG', 20, 15, 15, 15);
    } catch (e) {
        console.error('Failed to load logo for PDF:', e);
    }
    
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 86, 214); // #2556D6
    doc.text("HomeBuild Planner", 40, 25);
    
    // Separator Line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, 190, 35);
    
    doc.setTextColor(0, 0, 0); // Reset
};
