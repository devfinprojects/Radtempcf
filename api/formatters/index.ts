/**
 * Format Generator - Main export for all format converters
 * Provides: Markdown, JSON, XML/MRRT, FHIR R4/R5, HL7 v2, DICOM SR, CDA, PDF, CSV, YAML
 */

export { MarkdownRenderer, formatMarkdown, FormatOptions as MarkdownOptions } from './markdown.js';
export { JsonApiFormatter, formatJsonApi } from './json-api.js';
export { JsonSchemaFormatter, formatJsonSchema } from './json-schema.js';
export { XmlMrrtFormatter, formatXmlMrrt } from './xml-mrrt.js';
export { FhirR4Formatter, formatFhirR4 } from './fhir-r4.js';
export { FhirR5Formatter, formatFhirR5 } from './fhir-r5.js';
export { Hl7V2OruFormatter, formatHl7V2Oru } from './hl7v2-oru.js';
export { DicomSrFormatter, formatDicomSr } from './dicom-sr.js';
export { CdaFormatter, formatCda } from './cda.js';
export { PdfFormatter, formatPdf } from './pdf.js';
export { CsvFormatter, formatCsv } from './csv.js';
export { YamlFormatter, formatYaml } from './yaml.js';

// Re-export all formatters as unified API
export const formatReport = async (template: any, format: string, options?: any): Promise<string> => {
  const formatters: Record<string, (template: any, options?: any) => Promise<string> | string> = {
    'markdown': formatMarkdown,
    'json': formatJsonApi,
    'json-schema': formatJsonSchema,
    'xml': formatXmlMrrt,
    'mrrt': formatXmlMrrt,
    'fhir': formatFhirR4,
    'fhir-r4': formatFhirR4,
    'fhir-r5': formatFhirR5,
    'hl7v2': formatHl7V2Oru,
    'hl7': formatHl7V2Oru,
    'dicom': formatDicomSr,
    'dicom-sr': formatDicomSr,
    'cda': formatCda,
    'pdf': formatPdf,
    'csv': formatCsv,
    'yaml': formatYaml,
  };

  const formatter = formatters[format];
  if (!formatter) {
    throw new Error(`Unsupported format: ${format}. Supported formats: ${Object.keys(formatters).join(', ')}`);
  }

  return formatter(template, options);
};

// Export format metadata for UI
export const formatMetadata = {
  markdown: { name: 'Markdown', extension: '.md', mime: 'text/markdown', priority: 'P1' },
  json: { name: 'JSON API', extension: '.json', mime: 'application/json', priority: 'P1' },
  'json-schema': { name: 'JSON Schema', extension: '.schema.json', mime: 'application/schema+json', priority: 'P1' },
  xml: { name: 'XML (MRRT)', extension: '.xml', mime: 'application/xml', priority: 'P1' },
  fhir: { name: 'FHIR R4', extension: '.fhir.json', mime: 'application/fhir+json', priority: 'P1' },
  'fhir-r5': { name: 'FHIR R5', extension: '.fhir-r5.json', mime: 'application/fhir+json', priority: 'P2' },
  hl7v2: { name: 'HL7 v2 ORU', extension: '.hl7', mime: 'x-application/hl7-v2.5', priority: 'P2' },
  dicom: { name: 'DICOM SR', extension: '.dcm', mime: 'application/dicom', priority: 'P2' },
  cda: { name: 'CDA Document', extension: '.xml', mime: 'application/xml+cda', priority: 'P2' },
  pdf: { name: 'PDF', extension: '.pdf', mime: 'application/pdf', priority: 'P1' },
  csv: { name: 'CSV', extension: '.csv', mime: 'text/csv', priority: 'P2' },
  yaml: { name: 'YAML', extension: '.yaml', mime: 'text/yaml', priority: 'P2' },
};

export type SupportedFormat = keyof typeof formatMetadata;
