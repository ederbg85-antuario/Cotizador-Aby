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

const BRAND = 'Nails by Aby';
const TAGLINE = 'Estudio profesional de uñas';

// Paleta del PDF (sincronizada con la web)
const C = {
  petal:        [200, 66, 90]   as [number, number, number], // #c8425a — primario
  petalDark:    [139, 36, 58]   as [number, number, number], // #8b243a
  petalSoft:    [251, 229, 232] as [number, number, number], // #fbe5e8
  cream:        [253, 249, 244] as [number, number, number], // #fdf9f4
  creamWarm:    [247, 237, 224] as [number, number, number], // #f7ede0
  champagne:    [210, 159, 48]  as [number, number, number], // #d29f30
  champagneSoft:[253, 248, 236] as [number, number, number], // #fdf8ec
  stone800:     [26, 24, 16]    as [number, number, number], // #1a1810
  stone700:     [47, 43, 32]    as [number, number, number], // #2f2b20
  stone500:     [115, 107, 86]  as [number, number, number], // #736b56
  stone400:     [156, 148, 127] as [number, number, number], // #9c947f
  stone200:     [232, 227, 216] as [number, number, number], // #e8e3d8
  white:        [255, 255, 255] as [number, number, number],
};

const setFill = (pdf: jsPDF, c: [number, number, number]) => pdf.setFillColor(c[0], c[1], c[2]);
const setText = (pdf: jsPDF, c: [number, number, number]) => pdf.setTextColor(c[0], c[1], c[2]);
const setDraw = (pdf: jsPDF, c: [number, number, number]) => pdf.setDrawColor(c[0], c[1], c[2]);

function fmt(n: number): string {
  return `$${n.toFixed(0)} MXN`;
}

export function generateQuotePDF(data: PDFQuoteData): jsPDF {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  const M = 18; // margen lateral
  const contentW = W - M * 2;
  let y = 0;

  // =================================================================
  // HEADER — banda superior con marca
  // =================================================================
  setFill(pdf, C.petalDark);
  pdf.rect(0, 0, W, 48, 'F');

  // Acento champagne lateral
  setFill(pdf, C.champagne);
  pdf.rect(0, 48, W, 1.2, 'F');

  // Logo circle "A"
  setFill(pdf, C.white);
  pdf.circle(M + 7, 24, 7, 'F');
  setText(pdf, C.petalDark);
  pdf.setFont('times', 'bolditalic');
  pdf.setFontSize(18);
  pdf.text('A', M + 7, 27.5, { align: 'center' });

  // Marca
  setText(pdf, C.white);
  pdf.setFont('times', 'italic');
  pdf.setFontSize(22);
  pdf.text(BRAND, M + 18, 23);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  setText(pdf, C.petalSoft);
  pdf.text(TAGLINE.toUpperCase(), M + 18, 30, { charSpace: 1.2 });

  // Bloque derecho — fecha y folio
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  setText(pdf, C.petalSoft);
  pdf.text('COTIZACIÓN', W - M, 19, { align: 'right', charSpace: 1.5 });

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  setText(pdf, C.white);
  pdf.text(data.date, W - M, 26, { align: 'right' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  setText(pdf, C.petalSoft);
  const folio = `Folio #${Date.now().toString().slice(-6)}`;
  pdf.text(folio, W - M, 32, { align: 'right' });

  y = 62;

  // =================================================================
  // TÍTULO DE SECCIÓN
  // =================================================================
  pdf.setFont('times', 'italic');
  pdf.setFontSize(26);
  setText(pdf, C.stone700);
  pdf.text('Cotización personalizada', M, y);

  y += 6;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  setText(pdf, C.stone500);
  pdf.text('Detalle completo de servicios y precios', M, y);

  y += 12;

  // =================================================================
  // CLIENTE — card suave
  // =================================================================
  setFill(pdf, C.petalSoft);
  pdf.roundedRect(M, y, contentW, 28, 3, 3, 'F');

  setText(pdf, C.petalDark);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.text('CLIENTE', M + 6, y + 7, { charSpace: 1.5 });

  // Grid de info
  const colX = [M + 6, M + contentW / 2];
  setText(pdf, C.stone700);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text(data.clientName || 'Cliente', colX[0], y + 15);

  setText(pdf, C.stone500);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  if (data.clientEmail) pdf.text(data.clientEmail, colX[0], y + 22);
  if (data.clientPhone) pdf.text(data.clientPhone, colX[1], y + 22);

  y += 38;

  // =================================================================
  // SERVICIO PRINCIPAL
  // =================================================================
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  setText(pdf, C.stone400);
  pdf.text('SERVICIO PRINCIPAL', M, y, { charSpace: 1.5 });

  y += 6;

  setText(pdf, C.stone700);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  const serviceLabel = data.gelServiceName
    ? `${data.serviceType} — ${data.gelServiceName}`
    : data.serviceType;
  pdf.text(serviceLabel, M, y);

  y += 8;

  // línea separadora suave
  setDraw(pdf, C.stone200);
  pdf.setLineWidth(0.3);
  pdf.line(M, y, M + contentW, y);
  y += 8;

  // =================================================================
  // TABLA DE DECORACIONES
  // =================================================================
  if (data.decorations.length > 0) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    setText(pdf, C.stone400);
    pdf.text('DECORACIONES', M, y, { charSpace: 1.5 });
    y += 6;

    // header columnas
    const colName = M;
    const colQty  = M + contentW - 60;
    const colPer  = M + contentW - 40;
    const colTot  = M + contentW;

    setText(pdf, C.stone500);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.text('Detalle', colName, y, { charSpace: 0.8 });
    pdf.text('Uñas', colQty, y, { align: 'right' });
    pdf.text('Precio', colPer, y, { align: 'right' });
    pdf.text('Subtotal', colTot, y, { align: 'right' });

    y += 3;
    setDraw(pdf, C.stone200);
    pdf.line(M, y, M + contentW, y);
    y += 5;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);

    data.decorations.forEach((d, i) => {
      if (i % 2 === 0) {
        setFill(pdf, C.cream);
        pdf.rect(M - 2, y - 4, contentW + 4, 7.5, 'F');
      }
      setText(pdf, C.stone700);
      pdf.text(d.name, colName, y);
      pdf.text(d.nailCount.toString(), colQty, y, { align: 'right' });
      pdf.text(`$${d.pricePerNail}`, colPer, y, { align: 'right' });
      pdf.setFont('helvetica', 'bold');
      setText(pdf, C.petalDark);
      pdf.text(`$${d.total.toFixed(0)}`, colTot, y, { align: 'right' });
      pdf.setFont('helvetica', 'normal');
      y += 7.5;
    });

    y += 6;
  }

  // =================================================================
  // TONOS EXTRA
  // =================================================================
  if (data.extraTones > 0) {
    setFill(pdf, C.champagneSoft);
    pdf.roundedRect(M, y, contentW, 12, 2, 2, 'F');
    setText(pdf, C.stone700);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Tonos extra (${data.extraTones})`, M + 5, y + 8);
    pdf.setFont('helvetica', 'bold');
    setText(pdf, C.petalDark);
    pdf.text(fmt(data.extraTones * 5), M + contentW - 5, y + 8, { align: 'right' });
    y += 18;
  }

  // =================================================================
  // SERVICIOS ADICIONALES
  // =================================================================
  if (data.additionalServices.length > 0) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    setText(pdf, C.stone400);
    pdf.text('SERVICIOS ADICIONALES', M, y, { charSpace: 1.5 });
    y += 6;

    const colName = M;
    const colQty  = M + contentW - 50;
    const colTot  = M + contentW;

    setText(pdf, C.stone500);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.text('Servicio', colName, y);
    pdf.text('Cantidad', colQty, y, { align: 'right' });
    pdf.text('Subtotal', colTot, y, { align: 'right' });

    y += 3;
    setDraw(pdf, C.stone200);
    pdf.line(M, y, M + contentW, y);
    y += 5;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    data.additionalServices.forEach((s, i) => {
      if (i % 2 === 0) {
        setFill(pdf, C.cream);
        pdf.rect(M - 2, y - 4, contentW + 4, 7.5, 'F');
      }
      setText(pdf, C.stone700);
      pdf.text(s.name, colName, y);
      pdf.text(s.quantity.toString(), colQty, y, { align: 'right' });
      pdf.setFont('helvetica', 'bold');
      setText(pdf, C.petalDark);
      pdf.text(`$${s.total.toFixed(0)}`, colTot, y, { align: 'right' });
      pdf.setFont('helvetica', 'normal');
      y += 7.5;
    });

    y += 6;
  }

  // =================================================================
  // TOTAL — card en gradiente petal
  // =================================================================
  // Asegurar espacio inferior antes del total
  if (y > H - 80) {
    pdf.addPage();
    y = M;
  }

  y += 4;
  setFill(pdf, C.petalDark);
  pdf.roundedRect(M, y, contentW, 28, 3, 3, 'F');

  setText(pdf, C.petalSoft);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text('TOTAL A PAGAR', M + 6, y + 9, { charSpace: 1.8 });

  setText(pdf, C.white);
  pdf.setFont('times', 'bold');
  pdf.setFontSize(28);
  pdf.text(`$${data.total.toFixed(0)}`, M + contentW - 6, y + 19, { align: 'right' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  setText(pdf, C.petalSoft);
  pdf.text('MXN', M + contentW - 6, y + 25, { align: 'right' });

  y += 38;

  // =================================================================
  // NOTAS
  // =================================================================
  if (data.notes) {
    setFill(pdf, C.cream);
    pdf.setDrawColor(232, 227, 216);
    pdf.setLineWidth(0.3);
    const lines = pdf.splitTextToSize(data.notes, contentW - 12);
    const noteH = 8 + lines.length * 4.5;
    pdf.roundedRect(M, y, contentW, noteH, 2, 2, 'FD');

    setText(pdf, C.stone400);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.text('NOTAS', M + 5, y + 5, { charSpace: 1.5 });

    setText(pdf, C.stone700);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(lines, M + 5, y + 10);

    y += noteH + 6;
  }

  // =================================================================
  // FOOTER fijo en la parte baja
  // =================================================================
  const footerY = H - 22;

  setDraw(pdf, C.stone200);
  pdf.setLineWidth(0.3);
  pdf.line(M, footerY - 6, M + contentW, footerY - 6);

  setText(pdf, C.petalDark);
  pdf.setFont('times', 'italic');
  pdf.setFontSize(11);
  pdf.text('¡Gracias por tu preferencia!', W / 2, footerY, { align: 'center' });

  setText(pdf, C.stone400);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.text(
    'Esta cotización es válida por 7 días · Cualquier técnica incluye 2 tonos lisos a elegir',
    W / 2,
    footerY + 5,
    { align: 'center' }
  );

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  setText(pdf, C.stone500);
  pdf.text(BRAND, W / 2, footerY + 10, { align: 'center', charSpace: 0.8 });

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
