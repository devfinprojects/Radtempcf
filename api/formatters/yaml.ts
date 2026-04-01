/**
 * YAML Formatter - Converts radiology templates to YAML format
 * Dependencies: SCHEMA_TEMPLATE_BASE
 * Priority: P2
 */

export interface YamlOptions {
  includeMetadata?: boolean;
  includeFindings?: boolean;
  includeImpression?: boolean;
  includeRecommendations?: boolean;
  compactMode?: boolean;
  indentSize?: number;
  flowLevel?: number;
  schema?: 'standard' | 'relaxed' | 'json';
}

const defaultYamlOptions: YamlOptions = {
  includeMetadata: true,
  includeFindings: true,
  includeImpression: true,
  includeRecommendations: true,
  compactMode: false,
  indentSize: 2,
  flowLevel: -1,
  schema: 'standard',
};

/**
 * Generates a YAML report from a template object
 */
export function formatYaml(template: any, options?: YamlOptions): string {
  const opts = { ...defaultYamlOptions, ...options };
  const yamlObject = buildYamlObject(template, opts);
  
  return stringifyYaml(yamlObject, opts);
}

function buildYamlObject(template: any, opts: YamlOptions): any {
  const obj: any = {};

  // Template identification
  obj.template = {
    id: template.id || '',
    name: template.name || '',
    version: template.version || '',
    schema: template.schema || 'radiology-report-v1',
  };

  // Metadata section
  if (opts.includeMetadata) {
    obj.metadata = {
      modality: template.modality || '',
      bodyRegion: template.bodyRegion || template.body_region || '',
      category: template.category || '',
      rads: template.rads || template.radsSystem || '',
      author: template.author || '',
      date: template.date || template.lastUpdated || '',
      license: template.license || '',
      tags: template.tags || [],
    };

    // Clinical identifiers
    if (template.accessionNumber || template.mrn || template.patientName) {
      obj.metadata.identifiers = {
        accessionNumber: template.accessionNumber || '',
        mrn: template.mrn || '',
        patientName: template.patientName || '',
        studyDate: template.studyDate || '',
        studyDescription: template.studyDescription || '',
      };
    }
  }

  // Findings section
  if (opts.includeFindings && template.findings) {
    obj.findings = formatFindings(template.findings, opts);
  }

  // Impression section
  if (opts.includeImpression && template.impression) {
    obj.impression = formatImpression(template.impression);
  }

  // Recommendations section
  if (opts.includeRecommendations && template.recommendations) {
    obj.recommendations = formatRecommendations(template.recommendations);
  }

  // Additional structured data
  if (template.technique) {
    obj.technique = template.technique;
  }

  if (template.comparison) {
    obj.comparison = template.comparison;
  }

  if (template.limitations) {
    obj.limitations = template.limitations;
  }

  return obj;
}

function formatFindings(findings: any, opts: YamlOptions): any {
  if (typeof findings === 'string') {
    return findings;
  }

  if (Array.isArray(findings)) {
    return findings.map((finding: any) => {
      if (typeof finding === 'string') {
        return finding;
      }
      return {
        organ: finding.organ || '',
        description: finding.description || '',
        details: finding.details || '',
        severity: finding.severity || '',
        location: finding.location || '',
        measurement: finding.measurement || '',
      };
    });
  }

  if (typeof findings === 'object') {
    return findings;
  }

  return String(findings);
}

function formatImpression(impression: any): any {
  if (typeof impression === 'string') {
    return impression;
  }

  if (Array.isArray(impression)) {
    return impression.map((imp: any) => {
      if (typeof imp === 'string') return imp;
      return {
        text: imp.text || imp.impression || '',
        diagnosis: imp.diagnosis || '',
        confidence: imp.confidence || '',
      };
    });
  }

  return impression;
}

function formatRecommendations(recommendations: any): any {
  if (typeof recommendations === 'string') {
    return recommendations;
  }

  if (Array.isArray(recommendations)) {
    return recommendations.map((rec: any) => {
      if (typeof rec === 'string') return rec;
      return {
        text: rec.text || rec.recommendation || '',
        urgency: rec.urgency || rec.priority || '',
        followup: rec.followup || rec.followUp || '',
        timeframe: rec.timeframe || '',
      };
    });
  }

  return recommendations;
}

/**
 * Simple YAML stringifier (handles basic types)
 */
function stringifyYaml(obj: any, opts: YamlOptions): string {
  const lines: string[] = [];
  const indent = ' '.repeat(opts.indentSize || 2);
  
  stringifyValue(obj, lines, '', indent, 0, opts);
  
  return lines.join('\n');
}

function stringifyValue(
  value: any,
  lines: string[],
  key: string,
  indent: string,
  depth: number,
  opts: YamlOptions
): void {
  const currentIndent = indent.repeat(depth);
  const keyPrefix = key ? `${key}: ` : '';

  if (value === null || value === undefined) {
    lines.push(`${currentIndent}${keyPrefix}null`);
    return;
  }

  if (typeof value === 'boolean') {
    lines.push(`${currentIndent}${keyPrefix}${value}`);
    return;
  }

  if (typeof value === 'number') {
    lines.push(`${currentIndent}${keyPrefix}${value}`);
    return;
  }

  if (typeof value === 'string') {
    if (needsQuoting(value)) {
      lines.push(`${currentIndent}${keyPrefix}"${escapeString(value)}"`);
    } else {
      lines.push(`${currentIndent}${keyPrefix}${value}`);
    }
    return;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      lines.push(`${currentIndent}${keyPrefix}[]`);
      return;
    }
    
    if (opts.compactMode && value.every(v => typeof v !== 'object')) {
      lines.push(`${currentIndent}${keyPrefix}[${value.join(', ')}]`);
      return;
    }

    lines.push(`${currentIndent}${keyPrefix}`);
    for (const item of value) {
      if (typeof item === 'object' && item !== null) {
        lines.push(`${currentIndent}${indent}-`);
        stringifyObject(item, lines, indent, depth + 1, opts);
      } else {
        lines.push(`${currentIndent}${indent}- ${formatValue(item, opts)}`);
      }
    }
    return;
  }

  if (typeof value === 'object') {
    if (Object.keys(value).length === 0) {
      lines.push(`${currentIndent}${keyPrefix}{}`);
      return;
    }
    
    lines.push(`${currentIndent}${keyPrefix}`);
    stringifyObject(value, lines, indent, depth, opts);
    return;
  }

  lines.push(`${currentIndent}${keyPrefix}${String(value)}`);
}

function stringifyObject(
  obj: any,
  lines: string[],
  indent: string,
  depth: number,
  opts: YamlOptions
): void {
  const currentIndent = indent.repeat(depth);
  const innerIndent = indent.repeat(depth + 1);
  
  for (const [key, value] of Object.entries(obj)) {
    // Skip empty values in compact mode
    if (opts.compactMode && (value === null || value === undefined || value === '')) {
      continue;
    }
    
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        lines.push(`${innerIndent}${key}:`);
        for (const item of value) {
          if (typeof item === 'object' && item !== null) {
            lines.push(`${innerIndent}${indent}-`);
            stringifyObject(item, lines, indent, depth + 2, opts);
          } else {
            lines.push(`${innerIndent}${indent}- ${formatValue(item, opts)}`);
          }
        }
      } else {
        lines.push(`${innerIndent}${key}:`);
        stringifyObject(value, lines, indent, depth + 1, opts);
      }
    } else {
      lines.push(`${innerIndent}${key}: ${formatValue(value, opts)}`);
    }
  }
}

function formatValue(value: any, opts: YamlOptions): string {
  if (value === null || value === undefined) {
    return 'null';
  }
  if (typeof value === 'boolean') {
    return String(value);
  }
  if (typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'string') {
    if (needsQuoting(value)) {
      return `"${escapeString(value)}"`;
    }
    return value;
  }
  return String(value);
}

function needsQuoting(str: string): boolean {
  // Check if string needs quoting
  if (str === '' || str === 'true' || str === 'false' || str === 'null') {
    return true;
  }
  if (/^[\d\.\-\+eE]+$/.test(str)) {
    return true;
  }
  if (/[:{}\[\],#&*!|>'"%@`]/.test(str)) {
    return true;
  }
  if (str.includes('\n')) {
    return true;
  }
  return false;
}

function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * YAML Formatter class for more complex YAML generation scenarios
 */
export class YamlFormatter {
  private options: YamlOptions;

  constructor(options?: YamlOptions) {
    this.options = { ...defaultYamlOptions, ...options };
  }

  setOptions(options: Partial<YamlOptions>): void {
    this.options = { ...this.options, ...options };
  }

  generate(template: any): string {
    return formatYaml(template, this.options);
  }

  generateMultiple(templates: any[]): string {
    const results: string[] = [];
    for (const template of templates) {
      results.push(this.generate(template));
    }
    return results.join('\n---\n\n');
  }
}

export default YamlFormatter;