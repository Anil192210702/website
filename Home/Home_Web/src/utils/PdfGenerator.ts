import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoUrl from '../assets/interface_logo.jpeg';

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
    
    autoTable(doc, {
        startY: y,
        head: [['Material', 'Quantity', 'Cost']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: '#2556D6' }
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
    
    autoTable(doc, {
        startY: y,
        head: [['Work Description', 'Cost']],
        body: tableData,
        theme: 'plain',
        headStyles: { fillColor: '#2556D6', textColor: '#FFFFFF' },
        columnStyles: {
            0: { cellWidth: 140 },
            1: { cellWidth: 40, halign: 'right' }
        }
    });
    
    doc.save('Interior_Report.pdf');
};

const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
            console.warn('Failed to load image:', url);
            reject(new Error(`Failed to load image at ${url}`));
        };
        img.src = url;
    });
};

const drawBranding = async (doc: jsPDF) => {
    try {
        const img = await loadImage(logoUrl);
        doc.addImage(img, 'JPEG', 20, 15, 15, 15);
    } catch (e) {
        console.error('Failed to load logo for PDF:', e);
        // Continue without logo if it fails, don't break the whole report
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
