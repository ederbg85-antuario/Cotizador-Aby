import jsPDF from 'jspdf';

interface PDFQuoteData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  nailLength?: number;
  gelServiceName?: string;
  decorations: Array<{ name: string; nailCount: number; pricePerNail: number; total: number }>;
  extraTones: number;
  additionalServices: Array<{ name: string; quantity: number; price: number; total: number }>;
  subtotal: number;
  total: number;
  notes: string;
  date: string;
}

// Brand colors
const COLORS = {
  pink: { r: 244, g: 114, b: 182 }, // #f472b6
  darkPink: { r: 219, g: 39, b: 119 }, // #db2777
  lightPink: { r: 253, g: 242, b: 248 }, // #fdf2f8
  gold: { r: 212, g: 165, b: 116 }, // #d4a574
  darkText: { r: 74, g: 48, b: 64 }, // #4a3040
  lightText: { r: 120, g: 90, b: 105 }, // #765a69
  white: { r: 255, g: 255, b: 255 },
};

type ColorKey = keyof typeof COLORS;

function setColor(pdf: jsPDF, colorKey: ColorKey) {
  const color = COLORS[colorKey];
  pdf.setTextColor(color.r, color.g, color.b);
}

function setFillColor(pdf: jsPDF, colorKey: ColorKey) {
  const color = COLORS[colorKey];
  pdf.setFillColor(color.r, color.g, color.b);
}

export function generateQuotePDF(data: PDFQuoteData): jsPDF {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // ===== HEADER =====
  // Decorative top pink bar
  setFillColor(pdf, 'darkPink');
  pdf.rect(0, 0, pageWidth, 8, 'F');

  // Title
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  setColor(pdf, 'darkPink');
  pdf.text('Cotizador de Aby', pageWidth / 2, 20, { align: 'center' });

  // Subtitle
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  setColor(pdf, 'lightText');
  pdf.text('Cotización de Servicios', pageWidth / 2, 27, { align: 'center' });

  // Date
  pdf.setFontSize(10);
  setColor(pdf, 'lightText');
  pdf.text(`Fecha: ${data.date}`, pageWidth / 2, 33, { align: 'center' });

  yPosition = 38;

  // Decorative line
  setFillColor(pdf, 'pink');
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 0.8, 'F');
  yPosition += 3;

  // ===== CLIENT INFO SECTION =====
  setFillColor(pdf, 'lightPink');
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 24, 'F');

  setColor(pdf, 'darkPink');
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INFORMACIÓN DEL CLIENTE', margin + 4, yPosition + 5);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  setColor(pdf, 'darkText');
  pdf.text(`Nombre: ${data.clientName}`, margin + 4, yPosition + 11);
  pdf.text(`Email: ${data.clientEmail}`, margin + 4, yPosition + 16);
  pdf.text(`Teléfono: ${data.clientPhone}`, margin + 4, yPosition + 21);

  yPosition += 28;

  // ===== SERVICE DETAILS =====
  setColor(pdf, 'darkPink');
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DETALLES DEL SERVICIO', margin, yPosition);

  yPosition += 6;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  setColor(pdf, 'darkText');
  const serviceText = data.nailLength
    ? `${data.serviceType} - ${data.nailLength}mm${data.gelServiceName ? ` (${data.gelServiceName})` : ''}`
    : `${data.serviceType}${data.gelServiceName ? ` (${data.gelServiceName})` : ''}`;
  pdf.text(serviceText, margin, yPosition);

  yPosition += 8;

  // ===== DECORATIONS TABLE =====
  if (data.decorations.length > 0) {
    setColor(pdf, 'darkPink');
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');

    // Table headers
    const col1 = margin;
    const col2 = margin + 85;
    const col3 = margin + 100;
    const col4 = margin + 125;

    setFillColor(pdf, 'pink');
    pdf.rect(col1 - 2, yPosition - 3, pageWidth - 2 * margin + 4, 5, 'F');

    setColor(pdf, 'white');
    pdf.text('Decoración', col1, yPosition + 0.5);
    pdf.text('Uñas', col2, yPosition + 0.5);
    pdf.text('Precio/Uña', col3, yPosition + 0.5);
    pdf.text('Total', col4, yPosition + 0.5);

    yPosition += 6;

    // Table rows
    setColor(pdf, 'darkText');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);

    data.decorations.forEach((decoration, index) => {
      if (index % 2 === 0) {
        setFillColor(pdf, 'lightPink');
        pdf.rect(col1 - 2, yPosition - 3, pageWidth - 2 * margin + 4, 4.5, 'F');
      }
      setColor(pdf, 'darkText');
      pdf.text(decoration.name, col1, yPosition);
      pdf.text(decoration.nailCount.toString(), col2, yPosition);
      pdf.text(`$${decoration.pricePerNail.toFixed(2)}`, col3, yPosition);
      pdf.text(`$${decoration.total.toFixed(2)}`, col4, yPosition);
      yPosition += 4.5;
    });
  }

  yPosition += 2;

  // Extra tones
  if (data.extraTones > 0) {
    setColor(pdf, 'darkText');
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Extra Tonos (más de 2): $${data.extraTones.toFixed(2)}`, margin, yPosition);
    yPosition += 5;
  }

  // ===== ADDITIONAL SERVICES =====
  if (data.additionalServices.length > 0) {
    setColor(pdf, 'darkPink');
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SERVICIOS ADICIONALES', margin, yPosition);
    yPosition += 5;

    // Table headers
    const col1 = margin;
    const col2 = margin + 100;
    const col3 = margin + 125;

    setFillColor(pdf, 'pink');
    pdf.rect(col1 - 2, yPosition - 3, pageWidth - 2 * margin + 4, 5, 'F');

    setColor(pdf, 'white');
    pdf.text('Servicio', col1, yPosition + 0.5);
    pdf.text('Cantidad', col2, yPosition + 0.5);
    pdf.text('Subtotal', col3, yPosition + 0.5);

    yPosition += 6;

    // Table rows
    setColor(pdf, 'darkText');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);

    data.additionalServices.forEach((service, index) => {
      if (index % 2 === 0) {
        setFillColor(pdf, 'lightPink');
        pdf.rect(col1 - 2, yPosition - 3, pageWidth - 2 * margin + 4, 4.5, 'F');
      }
      setColor(pdf, 'darkText');
      pdf.text(service.name, col1, yPosition);
      pdf.text(service.quantity.toString(), col2, yPosition);
      pdf.text(`$${service.total.toFixed(2)}`, col3, yPosition);
      yPosition += 4.5;
    });

    yPosition += 2;
  }

  // ===== TOTALS SECTION =====
  yPosition += 3;

  // Subtotal line
  setColor(pdf, 'darkText');
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Subtotal:', margin + 100, yPosition);
  setColor(pdf, 'darkPink');
  pdf.text(`$${data.subtotal.toFixed(2)}`, margin + 140, yPosition, { align: 'right' });

  yPosition += 7;

  // Total line with background
  setFillColor(pdf, 'pink');
  pdf.rect(margin + 80, yPosition - 5, 50, 10, 'F');

  setColor(pdf, 'white');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOTAL:', margin + 85, yPosition + 0.5);
  pdf.text(`$${data.total.toFixed(2)}`, margin + 140, yPosition + 0.5, { align: 'right' });

  yPosition += 15;

  // ===== NOTES SECTION =====
  if (data.notes) {
    setFillColor(pdf, 'lightPink');
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 15, 'F');

    setColor(pdf, 'darkPink');
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('NOTAS:', margin + 3, yPosition + 4);

    setColor(pdf, 'darkText');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    const noteLines = pdf.splitTextToSize(data.notes, pageWidth - 2 * margin - 6);
    pdf.text(noteLines, margin + 3, yPosition + 8);

    yPosition = pageHeight - 35;
  } else {
    yPosition = pageHeight - 30;
  }

  // ===== FOOTER =====
  // Decorative line
  setFillColor(pdf, 'pink');
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 0.8, 'F');

  yPosition += 4;

  // Thanks message
  setColor(pdf, 'darkPink');
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('¡Gracias por tu preferencia!', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 6;

  // Contact info
  setColor(pdf, 'lightText');
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Cotizador de Aby', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 3.5;
  pdf.text('Cotización profesional', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 5;

  // Important notes
  setColor(pdf, 'darkPink');
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  const disclaimerLines = [
    'Esta cotización es válida por 7 días',
    'Cualquier técnica incluye 2 tonos lisos a elegir',
  ];
  disclaimerLines.forEach((line, index) => {
    pdf.text(line, pageWidth / 2, yPosition + index * 2.5, { align: 'center' });
  });

  return pdf;
}

// Helper to download the PDF
export function downloadQuotePDF(data: PDFQuoteData) {
  const pdf = generateQuotePDF(data);
  pdf.save(`cotizacion-${data.clientName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`);
}

// Helper to get blob for sharing
export function getQuotePDFBlob(data: PDFQuoteData): Blob {
  const pdf = generateQuotePDF(data);
  return pdf.output('blob');
}
