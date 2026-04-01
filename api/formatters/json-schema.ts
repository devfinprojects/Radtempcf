/**
 * JSON Schema Formatter - Outputs JSON Schema from template structure
 * Dependencies: FORMAT_JSON_API
 */

export interface JsonSchemaOptions {
  schemaVersion?: string;
  idPrefix?: string;
  includeExamples?: boolean;
  prettyPrint?: boolean;
  indent?: number;
}

const defaultJsonSchemaOptions: JsonSchemaOptions = {
  schemaVersion: 'http://json-schema.org/draft-07/schema#',
  idPrefix: 'radiology-report',
  includeExamples: true,
  prettyPrint: true,
  indent: 2,
};

/**
 * Generates a JSON Schema from a template
 */
export function formatJsonSchema(template: any, options?: JsonSchemaOptions): string {
  const opts = { ...defaultJsonSchemaOptions, ...options };

  const schema = buildJsonSchema(template, opts);

  return opts.prettyPrint
    ? JSON.stringify(schema, null, opts.indent)
    : JSON.stringify(schema);
}

function buildJsonSchema(template: any, opts: JsonSchemaOptions): any {
  const schema: any = {
    $schema: opts.schemaVersion,
    $id: `${opts.idPrefix}-${template.id || 'template'}.schema.json`,
    title: template.name || 'Radiology Report',
    description: `Radiology report template for ${template.category || 'general imaging'}`,
    type: 'object',
    required: [],
    properties: {},
  };

  // Add metadata properties
  if (template.id) {
    schema.properties.id = { type: 'string', description: 'Unique template identifier' };
    schema.required.push('id');
  }

  if (template.name) {
    schema.properties.name = { type: 'string', description: 'Template name' };
    schema.required.push('name');
  }

  if (template.modality) {
    schema.properties.modality = {
      type: 'string',
      enum: getModalityEnums(template.modality),
      description: 'Imaging modality',
    };
  }

  if (template.bodyRegion) {
    schema.properties.bodyRegion = { type: 'string', description: 'Body region examined' };
  }

  if (template.category) {
    schema.properties.category = { type: 'string', description: 'Template category' };
  }

  // Findings section
  if (template.findings) {
    schema.properties.findings = buildFindingsSchema(template.findings);
    schema.required.push('findings');
  }

  // Impression section
  if (template.impression) {
    schema.properties.impression = buildImpressionSchema(template.impression);
    schema.required.push('impression');
  }

  // Recommendations
  if (template.recommendations) {
    schema.properties.recommendations = {
      type: 'array',
      items: { type: 'string' },
      description: 'Follow-up recommendations',
    };
  }

  // Add metadata
  schema.properties.version = { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+$' };
  schema.properties.lastUpdated = { type: 'string', format: 'date' };
  schema.properties.author = { type: 'string' };
  schema.properties.license = { type: 'string', enum: ['MIT', 'CC0', 'Apache-2.0', 'proprietary'] };

  // Add examples if requested
  if (opts.includeExamples) {
    schema.examples = [buildExample(template)];
  }

  return schema;
}

function getModalityEnums(modality: string): string[] {
  const knownModalities = ['CT', 'MRI', 'X-ray', 'Ultrasound', 'PET', 'SPECT', 'Fluoroscopy', 'Mammography', 'Angiography'];
  const result = [...knownModalities];
  if (!result.includes(modality)) {
    result.push(modality);
  }
  return result;
}

function buildFindingsSchema(findings: any): any {
  if (typeof findings === 'string') {
    return {
      type: 'string',
      description: 'Findings in free-text format',
    };
  }

  if (Array.isArray(findings)) {
    return {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          items: { type: 'array', items: { type: 'string' } },
        },
      },
      description: 'Structured findings by category',
    };
  }

  return { type: 'string' };
}

function buildImpressionSchema(impression: any): any {
  if (typeof impression === 'string') {
    return {
      type: 'string',
      description: 'Impression in numbered list format',
    };
  }

  if (Array.isArray(impression)) {
    return {
      type: 'array',
      items: { type: 'string' },
      description: 'Impression as array of findings',
    };
  }

  return { type: 'string' };
}

function buildExample(template: any): any {
  return {
    id: template.id || 'example-id',
    name: template.name || 'Example Report',
    modality: template.modality || 'CT',
    bodyRegion: template.bodyRegion || 'Brain',
    category: template.category || 'Neuroradiology',
    findings: template.findings || 'Example findings text...',
    impression: template.impression || '1. Normal study.\n2. No acute findings.',
    recommendations: template.recommendations || ['None'],
    version: template.version || '1.0.0',
    author: template.author || 'RadReport Team',
    license: template.license || 'MIT',
  };
}

export class JsonSchemaFormatter {
  private options: JsonSchemaOptions;

  constructor(options?: JsonSchemaOptions) {
    this.options = { ...defaultJsonSchemaOptions, ...options };
  }

  format(template: any): string {
    return formatJsonSchema(template, this.options);
  }

  setOptions(options: Partial<JsonSchemaOptions>): void {
    this.options = { ...this.options, ...options };
  }
}

export default JsonSchemaFormatter;
