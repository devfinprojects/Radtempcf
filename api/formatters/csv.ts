/**
 * CSV Formatter - Converts radiology templates to CSV format
 * Dependencies: SCHEMA_TEMPLATE_BASE
 * Priority: P2
 */

export interface CsvOptions {
  delimiter?: string;
  includeHeaders?: boolean;
  includeMetadata?: boolean;
  includeFindings?: boolean;
  includeImpression?: boolean;
  includeRecommendations?: boolean;
  flattenFindings?: boolean;
  encoding?: string;
}

const defaultCsvOptions: CsvOptions = {
  delimiter: ',',
  includeHeaders: true,
  includeMetadata: true,
  includeFindings: true,
  includeImpression: true,
  includeRecommendations: true,
  flattenFindings: true,
  encoding: 'utf-8',
};

/**
 * Generates a CSV report from a template object
 */
export function formatCsv(template: any, options?: CsvOptions): string {
  const opts = { ...defaultCsvOptions, ...options };
  const rows: string[][] = [];

  // Build header row
  const headers = buildHeaders(template, opts);
  if (opts.includeHeaders) {
    rows.push(headers);
  }

  // Build data row
  const dataRow = buildDataRow(template, opts, headers);
  rows.push(dataRow);

  // Convert to CSV string
  return rows.map(row => 
    row.map(cell => escapeCsvCell(cell, opts.delimiter || ',')).join(opts.delimiter || ',')
  ).join('\n');
}

function buildHeaders(template: any, opts: CsvOptions): string[] {
  const headers: string[] = [];

  // Metadata headers
  if (opts.includeMetadata) {
    headers.push(
      'template_id',
      'template_name',
      'modality',
      'body_region',
      'category',
      'rads_system',
      'version',
      'author',
      'date',
      'accession_number',
      'mrn',
      'patient_name',
      'study_date',
      'study_description',
      'license'
    );
  }

  // Findings headers
  if (opts.includeFindings) {
    if (opts.flattenFindings) {
      headers.push('findings_organ', 'findings_description', 'findings_details');
    } else {
      headers.push('findings');
    }
  }

  // Impression headers
  if (opts.includeImpression) {
    headers.push('impression');
  }

  // Recommendations headers
  if (opts.includeRecommendations) {
    if (opts.flattenFindings) {
      headers.push('recommendations_text', 'recommendations_urgency', 'recommendations_followup');
    } else {
      headers.push('recommendations');
    }
  }

  // Add custom fields from template
  if (template.customFields) {
    for (const field of Object.keys(template.customFields)) {
      headers.push(`custom_${field}`);
    }
  }

  return headers;
}

function buildDataRow(template: any, opts: CsvOptions, headers: string[]): string[] {
  const row: string[] = [];

  // Metadata data
  if (opts.includeMetadata) {
    row.push(
      getValue(template.id, ''),
      getValue(template.name, ''),
      getValue(template.modality, ''),
      getValue(template.bodyRegion, ''),
      getValue(template.category, ''),
      getValue(template.rads, ''),
      getValue(template.version, ''),
      getValue(template.author, ''),
      getValue(template.date, ''),
      getValue(template.accessionNumber, ''),
      getValue(template.mrn, ''),
      getValue(template.patientName, ''),
      getValue(template.studyDate, ''),
      getValue(template.studyDescription, ''),
      getValue(template.license, '')
    );
  }

  // Findings data
  if (opts.includeFindings) {
    if (opts.flattenFindings && Array.isArray(template.findings)) {
      // Flatten findings - take first finding or combine
      const firstFinding = template.findings[0] || {};
      row.push(
        getValue(firstFinding.organ, ''),
        getValue(firstFinding.description, ''),
        getValue(firstFinding.details, '')
      );
    } else {
      row.push(getValue(template.findings, ''));
    }
  }

  // Impression data
  if (opts.includeImpression) {
    row.push(getValue(template.impression, ''));
  }

  // Recommendations data
  if (opts.includeRecommendations) {
    if (opts.flattenFindings && Array.isArray(template.recommendations)) {
      const firstRec = template.recommendations[0] || {};
      row.push(
        getValue(firstRec.text || firstRec.recommendation, ''),
        getValue(firstRec.urgency, ''),
        getValue(firstRec.followup, '')
      );
    } else {
      row.push(getValue(template.recommendations, ''));
    }
  }

  // Custom fields data
  if (template.customFields) {
    for (const key of Object.keys(template.customFields || {})) {
      row.push(getValue(template.customFields[key], ''));
    }
  }

  return row;
}

function getValue(value: any, defaultValue: string = ''): string {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return String(value);
}

function escapeCsvCell(cell: string, delimiter: string): string {
  // If cell contains delimiter, newline, or quote, wrap in quotes and escape internal quotes
  if (cell.includes(delimiter) || cell.includes('\n') || cell.includes('"')) {
    return `"${cell.replace(/"/g, '""')}"`;
  }
  return cell;
}

/**
 * Generate multiple rows for array-based templates (bulk export)
 */
export function formatCsvBulk(templates: any[], options?: CsvOptions): string {
  if (!templates || templates.length === 0) {
    return '';
  }

  const opts = { ...defaultCsvOptions, ...options };
  const rows: string[][] = [];

  // Build headers from first template
  const headers = buildHeaders(templates[0], opts);
  if (opts.includeHeaders) {
    rows.push(headers);
  }

  // Build data rows for all templates
  for (const template of templates) {
    const dataRow = buildDataRow(template, opts, headers);
    rows.push(dataRow);
  }

  // Convert to CSV string
  return rows.map(row =>
    row.map(cell => escapeCsvCell(cell, opts.delimiter || ',')).join(opts.delimiter || ',')
  ).join('\n');
}

/**
 * Generate CSV with nested/tabular findings (one row per finding)
 */
export function formatCsvFindings(templates: any[], options?: CsvOptions): string {
  const opts = { ...defaultCsvOptions, ...options };
  const rows: string[][] = [];

  // Fixed headers for findings format
  const headers = [
    'template_id',
    'template_name',
    'modality',
    'body_region',
    'finding_index',
    'finding_organ',
    'finding_description',
    'finding_details',
    'finding_severity',
    'impression',
    'recommendations',
  ];
  
  rows.push(headers);

  // Build one row per finding
  for (const template of templates) {
    const findings = Array.isArray(template.findings) ? template.findings : [template.findings];
    
    for (let i = 0; i < findings.length; i++) {
      const finding = findings[i];
      const row = [
        getValue(template.id, ''),
        getValue(template.name, ''),
        getValue(template.modality, ''),
        getValue(template.bodyRegion, ''),
        String(i + 1),
        getValue(finding?.organ, ''),
        getValue(finding?.description, ''),
        getValue(finding?.details, ''),
        getValue(finding?.severity, ''),
        getValue(template.impression, ''),
        getValue(template.recommendations, ''),
      ];
      rows.push(row);
    }
    
    // If no findings, still add a row
    if (findings.length === 0 || !template.findings) {
      const row = [
        getValue(template.id, ''),
        getValue(template.name, ''),
        getValue(template.modality, ''),
        getValue(template.bodyRegion, ''),
        '0',
        '',
        '',
        '',
        '',
        getValue(template.impression, ''),
        getValue(template.recommendations, ''),
      ];
      rows.push(row);
    }
  }

  // Convert to CSV string
  return rows.map(row =>
    row.map(cell => escapeCsvCell(cell, opts.delimiter || ',')).join(opts.delimiter || ',')
  ).join('\n');
}

/**
 * CSV Formatter class for more complex CSV generation scenarios
 */
export class CsvFormatter {
  private options: CsvOptions;

  constructor(options?: CsvOptions) {
    this.options = { ...defaultCsvOptions, ...options };
  }

  setOptions(options: Partial<CsvOptions>): void {
    this.options = { ...this.options, ...options };
  }

  generate(template: any): string {
    return formatCsv(template, this.options);
  }

  generateBulk(templates: any[]): string {
    return formatCsvBulk(templates, this.options);
  }

  generateFindings(templates: any[]): string {
    return formatCsvFindings(templates, this.options);
  }
}

export default CsvFormatter;
