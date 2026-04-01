/**
 * JSON API Formatter - Outputs templates in JSON API format
 * Dependencies: SCHEMA_TEMPLATE_BASE
 */

export interface JsonApiOptions {
  includeMetadata?: boolean;
  includeRelationships?: boolean;
  prettyPrint?: boolean;
  indent?: number;
}

const defaultJsonApiOptions: JsonApiOptions = {
  includeMetadata: true,
  includeRelationships: true,
  prettyPrint: true,
  indent: 2,
};

/**
 * Generates a JSON API formatted report from a template
 */
export function formatJsonApi(template: any, options?: JsonApiOptions): string {
  const opts = { ...defaultJsonApiOptions, ...options };

  const jsonApiResponse = {
    data: buildResourceObject(template, opts),
    meta: opts.includeMetadata ? buildMetaObject(template) : undefined,
    jsonapi: { version: '1.0' },
  };

  // Remove undefined values
  const cleaned = JSON.parse(JSON.stringify(jsonApiResponse));
  
  return opts.prettyPrint 
    ? JSON.stringify(cleaned, null, opts.indent)
    : JSON.stringify(cleaned);
}

function buildResourceObject(template: any, opts: JsonApiOptions): any {
  const resource: any = {
    type: 'radiology-report',
    id: template.id || 'unknown',
    attributes: {
      name: template.name,
      modality: template.modality,
      bodyRegion: template.bodyRegion,
      category: template.category,
      findings: template.findings,
      impression: template.impression,
      recommendations: template.recommendations,
    },
  };

  // Add relationships if requested
  if (opts.includeRelationships) {
    resource.relationships = buildRelationships(template);
  }

  return resource;
}

function buildRelationships(template: any): any {
  const relationships: any = {};

  if (template.modality) {
    relationships.modality = {
      data: { type: 'modality', id: template.modality.toLowerCase() }
    };
  }

  if (template.bodyRegion) {
    relationships.bodyRegion = {
      data: { type: 'body-region', id: template.bodyRegion.toLowerCase().replace(/\s+/g, '-') }
    };
  }

  if (template.rads) {
    relationships.rads = {
      data: { type: 'rads-system', id: template.rads.toLowerCase() }
    };
  }

  return relationships;
}

function buildMetaObject(template: any): any {
  return {
    generatedAt: new Date().toISOString(),
    generator: 'RadReport Format Generator',
    version: template.version || '1.0.0',
    license: template.license || 'MIT',
    author: template.author,
  };
}

export class JsonApiFormatter {
  private options: JsonApiOptions;

  constructor(options?: JsonApiOptions) {
    this.options = { ...defaultJsonApiOptions, ...options };
  }

  format(template: any): string {
    return formatJsonApi(template, this.options);
  }

  setOptions(options: Partial<JsonApiOptions>): void {
    this.options = { ...this.options, ...options };
  }
}

export default JsonApiFormatter;
