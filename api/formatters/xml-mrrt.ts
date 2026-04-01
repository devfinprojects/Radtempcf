/**
 * XML MRRT Formatter - Converts templates to MRRT (Medical Radiology Report Template) XML format
 * Dependencies: SCHEMA_TEMPLATE_BASE
 * MRRT: IHE Radiology Report Template
 */

export interface XmlMrrtOptions {
  includeXmlDeclaration?: boolean;
  indent?: number;
  includeSchemaLocation?: boolean;
  prettyPrint?: boolean;
}

const defaultXmlMrrtOptions: XmlMrrtOptions = {
  includeXmlDeclaration: true,
  indent: 2,
  includeSchemaLocation: true,
  prettyPrint: true,
};

/**
 * Generates an MRRT XML report from a template
 */
export function formatXmlMrrt(template: any, options?: XmlMrrtOptions): string {
  const opts = { ...defaultXmlMrrtOptions, ...options };
  const xml = buildMrrtXml(template, opts);
  return xml;
}

function buildMrrtXml(template: any, opts: XmlMrrtOptions): string {
  const lines: string[] = [];

  if (opts.includeXmlDeclaration) {
    lines.push("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
  }

  lines.push('<RadiologyReport xmlns="http://medical-radiology-report-template.org/mrrt"');

  if (opts.includeSchemaLocation) {
    lines.push('  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"');
    lines.push('  xsi:schemaLocation="http://medical-radiology-report-template.org/mrrt mrrt-schema.xsd"');
  }

  lines.push('>');

  lines.push('  <ReportMetadata>');
  lines.push(`    <TemplateId>${escapeXml(template.id || 'unknown')}</TemplateId>`);
  lines.push(`    <TemplateName>${escapeXml(template.name || 'Radiology Report')}</TemplateName>`);
  lines.push(`    <Modality>${escapeXml(template.modality || '')}</Modality>`);
  lines.push(`    <BodyRegion>${escapeXml(template.bodyRegion || '')}</BodyRegion>`);
  lines.push(`    <Category>${escapeXml(template.category || '')}</Category>`);
  lines.push(`    <Version>${escapeXml(template.version || '1.0.0')}</Version>`);
  lines.push(`    <Author>${escapeXml(template.author || '')}</Author>`);
  lines.push(`    <LastUpdated>${escapeXml(template.lastUpdated || '')}</LastUpdated>`);
  lines.push('  </ReportMetadata>');

  if (template.examType || template.history) {
    lines.push('  <Preamble>');
    if (template.examType) {
      lines.push(`    <ExamType>${escapeXml(template.examType)}</ExamType>`);
    }
    if (template.history) {
      lines.push(`    <ClinicalHistory>${escapeXml(template.history)}</ClinicalHistory>`);
    }
    if (template.technique) {
      lines.push(`    <Technique>${escapeXml(template.technique)}</Technique>`);
    }
    lines.push('  </Preamble>');
  }

  if (template.findings) {
    lines.push('  <Findings>');
    lines.push(formatFindingsXml(template.findings, '    '));
    lines.push('  </Findings>');
  }

  if (template.impression) {
    lines.push('  <Impression>');
    lines.push(formatImpressionXml(template.impression, '    '));
    lines.push('  </Impression>');
  }

  if (template.recommendations) {
    lines.push('  <Recommendations>');
    lines.push(formatRecommendationsXml(template.recommendations, '    '));
    lines.push('  </Recommendations>');
  }

  if (template.rads) {
    lines.push('  <RADSClassification>');
    lines.push(`    <System>${escapeXml(template.rads)}</System>`);
    if (template.radsCategory) {
      lines.push(`    <Category>${escapeXml(template.radsCategory)}</Category>`);
    }
    if (template.radsScore) {
      lines.push(`    <Score>${escapeXml(template.radsScore)}</Score>`);
    }
    lines.push('  </RADSClassification>');
  }

  lines.push('</RadiologyReport>');
  return lines.join('\n');
}

function formatFindingsXml(findings: any, indent: string): string {
  const lines: string[] = [];

  if (typeof findings === 'string') {
    const paragraphs = findings.split('\n\n');
    for (const para of paragraphs) {
      if (para.trim()) {
        lines.push(`${indent}<Paragraph>${escapeXml(para.trim())}</Paragraph>`);
      }
    }
  } else if (Array.isArray(findings)) {
    for (const finding of findings) {
      if (typeof finding === 'string') {
        lines.push(`${indent}<Item>${escapeXml(finding)}</Item>`);
      } else if (finding.category) {
        lines.push(`${indent}<Section category="${escapeXml(finding.category)}">`);
        for (const item of finding.items || []) {
          lines.push(`${indent}  <Item>${escapeXml(item)}</Item>`);
        }
        lines.push(`${indent}</Section>`);
      }
    }
  }

  return lines.join('\n');
}

function formatImpressionXml(impression: any, indent: string): string {
  const lines: string[] = [];

  if (typeof impression === 'string') {
    const items = impression.split('\n').filter((line: string) => line.trim());
    for (let i = 0; i < items.length; i++) {
      const item = items[i].trim();
      const cleaned = item.replace(/^[\d\.]+\s*[\)]?\s*/, '');
      lines.push(`${indent}<Finding number="${i + 1}">${escapeXml(cleaned)}</Finding>`);
    }
  } else if (Array.isArray(impression)) {
    for (let i = 0; i < impression.length; i++) {
      lines.push(`${indent}<Finding number="${i + 1}">${escapeXml(String(impression[i]))}</Finding>`);
    }
  }

  return lines.join('\n');
}

function formatRecommendationsXml(recommendations: any, indent: string): string {
  const lines: string[] = [];

  if (Array.isArray(recommendations)) {
    for (const rec of recommendations) {
      if (typeof rec === 'string') {
        lines.push(`${indent}<Recommendation>${escapeXml(rec)}</Recommendation>`);
      } else if (rec.priority) {
        lines.push(`${indent}<Recommendation priority="${escapeXml(rec.priority)}">${escapeXml(rec.text)}</Recommendation>`);
      }
    }
  }

  return lines.join('\n');
}

const xmlEscapes: Record<string, string> = {
  '&': '&',
  '<': '<',
  '>': '>',
  '"': '"',
  "'": "'",
};

function escapeXml(str: string): string {
  if (!str) return '';
  let result = '';
  for (const char of String(str)) {
    result += xmlEscapes[char] || char;
  }
  return result;
}

export class XmlMrrtFormatter {
  private options: XmlMrrtOptions;

  constructor(options?: XmlMrrtOptions) {
    this.options = { ...defaultXmlMrrtOptions, ...options };
  }

  format(template: any): string {
    return formatXmlMrrt(template, this.options);
  }

  setOptions(options: Partial<XmlMrrtOptions>): void {
    this.options = { ...this.options, ...options };
  }
}

export default XmlMrrtFormatter;
