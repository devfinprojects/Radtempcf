/**
 * PDF Formatter - Converts radiology templates to PDF format
 * Dependencies: SCHEMA_TEMPLATE_BASE
 * Priority: P1
 */

export interface PdfOptions {
  pageSize?: 'a4' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  includeHeader?: boolean;
  includeFooter?: boolean;
  includePageNumbers?: boolean;
  fontFamily?: string;
  titleFontSize?: number;
  headingFontSize?: number;
  bodyFontSize?: number;
  lineHeight?: number;
  includeWatermark?: string;
}

const defaultPdfOptions: PdfOptions = {
  pageSize: 'letter',
  orientation: 'portrait',
  margins: {
    top: 72,
    right: 72,
    bottom: 72,
    left: 72,
  },
  includeHeader: true,
  includeFooter: true,
  includePageNumbers: true,
  fontFamily: 'Helvetica',
  titleFontSize: 18,
  headingFontSize: 14,
  bodyFontSize: 11,
  lineHeight: 1.5,
  includeWatermark: undefined,
};

/**
 * Generates a PDF report from a template object
 * Note: This returns a base64-encoded PDF. In production, use a library like pdfmake or jsPDF
 */
export function formatPdf(template: any, options?: PdfOptions): string {
  const opts = { ...defaultPdfOptions, ...options };
  
  // Build PDF structure as JSON (for use with pdfmake or similar)
  const pdfStructure = {
    content: buildPdfContent(template, opts),
    styles: buildPdfStyles(opts),
    defaultStyle: {
      font: opts.fontFamily || 'Helvetica',
      fontSize: opts.bodyFontSize || 11,
      lineHeight: opts.lineHeight || 1.5,
    },
    pageSize: opts.pageSize?.toUpperCase() || 'LETTER',
    pageOrientation: opts.orientation || 'portrait',
    pageMargins: [
      opts.margins?.left || 72,
      opts.margins?.top || 72,
      opts.margins?.right || 72,
      opts.margins?.bottom || 72,
    ],
    header: opts.includeHeader ? buildPdfHeader(template, opts) : undefined,
    footer: opts.includeFooter ? buildPdfFooter(opts) : undefined,
    watermark: opts.includeWatermark ? { text: opts.includeWatermark, opacity: 0.1 } : undefined,
  };

  return JSON.stringify(pdfStructure, null, 2);
}

function buildPdfContent(template: any, opts: PdfOptions): any[] {
  const content: any[] = [];

  // Title
  content.push({
    text: template.name || 'Radiology Report',
    style: 'title',
    alignment: 'center',
  });
  content.push({ text: '\n' });

  // Metadata section
  if (template.metadata || template.id || template.modality || template.bodyRegion) {
    content.push({ text: 'EXAMINATION INFORMATION', style: 'heading' });
    content.push({ text: '\n' });
    
    const metadataTable = buildMetadataTable(template);
    content.push(metadataTable);
    content.push({ text: '\n' });
  }

  // Findings section
  if (template.findings) {
    content.push({ text: 'FINDINGS', style: 'heading' });
    content.push({ text: '\n' });
    
    const findingsText = formatFindingsText(template.findings);
    content.push({ text: findingsText, style: 'body' });
    content.push({ text: '\n' });
  }

  // Impression section
  if (template.impression) {
    content.push({ text: 'IMPRESSION', style: 'heading' });
    content.push({ text: '\n' });
    
    const impressionText = typeof template.impression === 'string' 
      ? template.impression 
      : formatFindingsText(template.impression);
    content.push({ text: impressionText, style: 'body' });
    content.push({ text: '\n' });
  }

  // Recommendations section
  if (template.recommendations) {
    content.push({ text: 'RECOMMENDATIONS', style: 'heading' });
    content.push({ text: '\n' });
    
    const recommendationsText = formatRecommendationsText(template.recommendations);
    content.push({ text: recommendationsText, style: 'body' });
    content.push({ text: '\n' });
  }

  return content;
}

function buildMetadataTable(template: any): any {
  const rows: any[] = [['Field', 'Value']];
  
  const fields = [
    { key: 'id', label: 'Template ID' },
    { key: 'modality', label: 'Modality' },
    { key: 'bodyRegion', label: 'Body Region' },
    { key: 'category', label: 'Category' },
    { key: 'rads', label: 'RADS System' },
    { key: 'version', label: 'Version' },
    { key: 'author', label: 'Author' },
    { key: 'date', label: 'Date' },
    { key: 'accessionNumber', label: 'Accession #' },
    { key: 'mrn', label: 'MRN' },
    { key: 'patientName', label: 'Patient Name' },
    { key: 'studyDate', label: 'Study Date' },
  ];

  for (const field of fields) {
    const value = template[field.key] || template.metadata?.[field.key] || '';
    if (value) {
      rows.push([field.label, value]);
    }
  }

  return {
    table: {
      headerRows: 1,
      widths: ['*', '*'],
      body: rows,
    },
    layout: 'lightHorizontalLines',
  };
}

function formatFindingsText(findings: any): string {
  if (typeof findings === 'string') {
    return findings;
  }
  
  if (Array.isArray(findings)) {
    return findings.map((f: any) => {
      if (typeof f === 'string') return f;
      if (f.organ) {
        return `${f.organ}: ${f.description || ''} ${f.details || ''}`.trim();
      }
      return JSON.stringify(f);
    }).join('\n\n');
  }
  
  if (typeof findings === 'object') {
    const parts: string[] = [];
    for (const [key, value] of Object.entries(findings)) {
      if (value) {
        parts.push(`${key}: ${JSON.stringify(value)}`);
      }
    }
    return parts.join('\n');
  }
  
  return String(findings);
}

function formatRecommendationsText(recommendations: any): string {
  if (typeof recommendations === 'string') {
    return recommendations;
  }
  
  if (Array.isArray(recommendations)) {
    return recommendations.map((r: any, index: number) => {
      const text = typeof r === 'string' ? r : r.text || r.recommendation || JSON.stringify(r);
      return `${index + 1}. ${text}`;
    }).join('\n');
  }
  
  return String(recommendations);
}

function buildPdfStyles(opts: PdfOptions): any {
  return {
    title: {
      fontSize: opts.titleFontSize || 18,
      bold: true,
      margin: [0, 0, 0, 10],
    },
    heading: {
      fontSize: opts.headingFontSize || 14,
      bold: true,
      margin: [0, 10, 0, 5],
      color: '#333333',
    },
    body: {
      fontSize: opts.bodyFontSize || 11,
      lineHeight: opts.lineHeight || 1.5,
    },
    tableHeader: {
      bold: true,
      fontSize: 10,
      color: '#333333',
    },
  };
}

function buildPdfHeader(template: any, opts: PdfOptions): any {
  return (currentPage: number, pageCount: number, pageSize: any) => {
    return {
      columns: [
        {
          text: template.name || 'Radiology Report',
          alignment: 'left',
          margin: [opts.margins?.left || 72, 10],
        },
        {
          text: new Date().toLocaleDateString(),
          alignment: 'right',
          margin: [0, 10, opts.margins?.right || 72],
        },
      ],
      margin: [0, 0, 0, 10],
    };
  };
}

function buildPdfFooter(opts: PdfOptions): any {
  return (currentPage: number, pageCount: number, pageSize: any) => {
    const footerText = opts.includePageNumbers 
      ? `Page ${currentPage} of ${pageCount}`
      : '';
    
    return {
      text: footerText,
      alignment: 'center',
      margin: [0, 10, 0, 0],
    };
  };
}

/**
 * PDF Formatter class for more complex PDF generation scenarios
 */
export class PdfFormatter {
  private options: PdfOptions;

  constructor(options?: PdfOptions) {
    this.options = { ...defaultPdfOptions, ...options };
  }

  setOptions(options: Partial<PdfOptions>): void {
    this.options = { ...this.options, ...options };
  }

  generate(template: any): string {
    return formatPdf(template, this.options);
  }

  generateBuffer(template: any): Buffer {
    // In production, use pdfmake to generate actual PDF buffer
    const json = this.generate(template);
    return Buffer.from(json);
  }
}

export default PdfFormatter;
