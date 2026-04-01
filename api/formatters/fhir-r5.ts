/**
 * FHIR R5 Formatter - Converts templates to FHIR R5 DiagnosticReport resources
 * Dependencies: FORMAT_FHIR_R4
 * FHIR R5: HL7 FHIR Release 5 (latest)
 */

export interface FhirR5Options {
  includePatient?: boolean;
  includeOrganization?: boolean;
  includePractitioner?: boolean;
  includeMedia?: boolean;
  baseUrl?: string;
  prettyPrint?: boolean;
  // R5-specific options
  useR5Narrative?: boolean;
  useR5Composition?: boolean;
}

const defaultFhirR5Options: FhirR5Options = {
  includePatient: true,
  includeOrganization: true,
  includePractitioner: true,
  includeMedia: false,
  baseUrl: 'http://hl7.org/fhir/',
  prettyPrint: true,
  useR5Narrative: true,
  useR5Composition: false,
};

/**
 * Generates a FHIR R5 DiagnosticReport from a template
 */
export function formatFhirR5(template: any, options?: FhirR5Options): string {
  const opts = { ...defaultFhirR5Options, ...options };
  
  let fhirResource: any;
  
  if (opts.useR5Composition) {
    // Use R5 Composition pattern for structured reports
    fhirResource = buildComposition(template, opts);
  } else {
    // Use R5 DiagnosticReport (same as R4 but with R5 enhancements)
    fhirResource = buildDiagnosticReportR5(template, opts);
  }
  
  return opts.prettyPrint
    ? JSON.stringify(fhirResource, null, 2)
    : JSON.stringify(fhirResource);
}

function buildDiagnosticReportR5(template: any, opts: FhirR5Options): any {
  const resource: any = {
    resourceType: 'DiagnosticReport',
    id: template.id || generateId(),
    meta: {
      profile: ['http://hl7.org/fhir/StructureDefinition/DiagnosticReport'],
      versionId: template.version || '1.0.0',
      lastUpdated: template.lastUpdated || new Date().toISOString(),
    },
    // R5 uses 'status' with same values but supports more
    status: 'final',
    // R5 adds category with different structure
    category: buildCategoryR5(template),
    code: buildCode(template),
    subject: opts.includePatient ? buildSubject(template) : undefined,
    encounter: undefined, // R5 adds encounter reference
    effectivePeriod: {
      start: template.effectiveDateTime || new Date().toISOString(),
    },
    issued: template.issued || new Date().toISOString(),
    performer: opts.includeOrganization ? buildPerformer(template) : undefined,
    // R5 results as separate resource array
    result: buildResults(template),
    // R5 adds support for multiple conclusions
    conclusion: buildConclusion(template),
    // R5 adds media array with different structure
    media: opts.includeMedia ? buildMedia(template) : undefined,
    // R5 adds supportingInfo
    supportingInfo: buildSupportingInfo(template),
    // R5 adds note as Annotation array
    note: buildNotes(template),
  };

  // R5-specific: Add narrative for human readability
  if (opts.useR5Narrative) {
    resource.text = buildNarrative(template);
  }

  return JSON.parse(JSON.stringify(resource));
}

function buildComposition(template: any, opts: FhirR5Options): any {
  return {
    resourceType: 'Composition',
    id: template.id || generateId(),
    meta: {
      profile: ['http://hl7.org/fhir/StructureDefinition/Composition'],
      versionId: template.version || '1.0.0',
    },
    status: 'final',
    type: {
      coding: [{
        system: 'http://loinc.org',
        code: getLoincCode(template),
        display: template.name || 'Radiology Report',
      }],
    },
    category: buildCategoryR5(template),
    subject: opts.includePatient ? buildSubject(template) : undefined,
    date: template.effectiveDateTime || new Date().toISOString(),
    author: opts.includePractitioner ? buildAuthor(template) : undefined,
    title: template.name || 'Radiology Report',
    section: buildSections(template),
  };
}

function buildCategoryR5(template: any): any[] {
  const categoryMap: Record<string, string> = {
    'Neuroradiology': 'RN',
    'Chest': 'RAD',
    'Abdominal': 'RAD',
    'Musculoskeletal': 'OR',
    'Cardiac': 'CARD',
    'Vascular': 'VASC',
    'Nuclear': 'NUC',
    'Pediatric': 'PED',
    'Breast': 'BR',
    'Interventional': 'IR',
  };

  const category = categoryMap[template.category] || 'RAD';

  return [{
    coding: [{
      system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
      code: category,
      display: template.category || 'Radiology',
    }],
  }];
}

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getLoincCode(template: any): string {
  const loincMap: Record<string, string> = {
    'CT Brain': '24531-1',
    'MRI Brain': '24531-1',
    'CT Chest': '36643-5',
    'CT Abdomen': '29556-3',
    'X-ray': '37028-7',
    'Ultrasound': '27898-7',
    'Mammography': '48304-5',
    'MRI Spine': '24531-1',
    'CT Angiography': '29644-7',
  };
  return loincMap[template.name] || '11502-2';
}

function buildCode(template: any): any {
  return {
    coding: [{
      system: 'http://loinc.org',
      code: getLoincCode(template),
      display: template.name || 'Radiology Report',
    }],
    text: template.name || 'Radiology Report',
  };
}

function buildSubject(template: any): any {
  return {
    reference: 'Patient/example',
    display: template.patientName || 'Example Patient',
  };
}

function buildAuthor(template: any): any[] {
  return [{
    reference: 'Practitioner/example',
    display: template.author || 'Radiologist',
  }];
}

function buildPerformer(template: any): any[] {
  return [{
    reference: 'Organization/example',
    display: template.author || 'Radiology Department',
  }];
}

function buildResults(template: any): any[] {
  const results: any[] = [];

  if (template.findings) {
    results.push({
      reference: 'Observation/findings',
      display: 'Findings',
    });
  }

  if (template.impression) {
    results.push({
      reference: 'Observation/impression',
      display: 'Impression',
    });
  }

  if (template.recommendations) {
    results.push({
      reference: 'Observation/recommendations',
      display: 'Recommendations',
    });
  }

  return results;
}

function buildConclusion(template: any): string {
  if (typeof template.impression === 'string') {
    return template.impression;
  }
  if (Array.isArray(template.impression)) {
    return template.impression.join('\n');
  }
  return '';
}

function buildMedia(template: any): any[] {
  return [];
}

function buildSupportingInfo(template: any): any[] {
  const info: any[] = [];

  if (template.history) {
    info.push({
      reference: 'Observation/clinical-history',
      display: 'Clinical History',
    });
  }

  if (template.technique) {
    info.push({
      reference: 'Observation/technique',
      display: 'Technique',
    });
  }

  return info;
}

function buildNotes(template: any): any[] {
  const notes: any[] = [];

  if (template.footer) {
    notes.push({
      text: template.footer,
    });
  }

  return notes;
}

function buildNarrative(template: any): any {
  const content = `
## ${template.name || 'Radiology Report'}

**Modality:** ${template.modality || 'N/A'}
**Body Region:** ${template.bodyRegion || 'N/A'}
**Category:** ${template.category || 'N/A'}

### Findings
${formatFindingsForNarrative(template.findings)}

### Impression
${formatImpressionForNarrative(template.impression)}

### Recommendations
${formatRecommendationsForNarrative(template.recommendations)}
  `.trim();

  return {
    status: 'generated',
    div: `<div xmlns="http://www.w3.org/1999/xhtml">${content.replace(/\n/g, '<br/>')}</div>`,
  };
}

function formatFindingsForNarrative(findings: any): string {
  if (!findings) return 'No findings recorded.';
  if (typeof findings === 'string') return findings;
  if (Array.isArray(findings)) {
    return findings.map(f => typeof f === 'string' ? f : f.category).join('\n');
  }
  return '';
}

function formatImpressionForNarrative(impression: any): string {
  if (!impression) return 'No impression recorded.';
  if (typeof impression === 'string') return impression;
  if (Array.isArray(impression)) return impression.join('\n');
  return '';
}

function formatRecommendationsForNarrative(recommendations: any): string {
  if (!recommendations) return 'No recommendations.';
  if (Array.isArray(recommendations)) {
    return recommendations.map(r => typeof r === 'string' ? r : `[${r.priority}] ${r.text}`).join('\n');
  }
  return '';
}

function buildSections(template: any): any[] {
  const sections: any[] = [];

  if (template.history || template.technique) {
    sections.push({
      title: 'Clinical Information',
      code: {
        coding: [{
          system: 'http://loinc.org',
          code: '11329-0',
          display: 'History',
        }],
      },
      text: {
        status: 'generated',
        div: `<div>${template.history || ''} ${template.technique || ''}</div>`,
      },
    });
  }

  if (template.findings) {
    sections.push({
      title: 'Findings',
      code: {
        coding: [{
          system: 'http://loinc.org',
          code: '29545-1',
          display: 'Finding',
        }],
      },
      text: {
        status: 'generated',
        div: `<div>${formatFindingsForNarrative(template.findings)}</div>`,
      },
    });
  }

  if (template.impression) {
    sections.push({
      title: 'Impression',
      code: {
        coding: [{
          system: 'http://loinc.org',
          code: '19005-8',
          display: 'Impression',
        }],
      },
      text: {
        status: 'generated',
        div: `<div>${formatImpressionForNarrative(template.impression)}</div>`,
      },
    });
  }

  if (template.recommendations) {
    sections.push({
      title: 'Recommendations',
      code: {
        coding: [{
          system: 'http://loinc.org',
          code: '18785-6',
          display: 'Plan',
        }],
      },
      text: {
        status: 'generated',
        div: `<div>${formatRecommendationsForNarrative(template.recommendations)}</div>`,
      },
    });
  }

  return sections;
}

/**
 * FhirR5Formatter class for advanced formatting
 */
export class FhirR5Formatter {
  private options: FhirR5Options;

  constructor(options?: FhirR5Options) {
    this.options = { ...defaultFhirR5Options, ...options };
  }

  format(template: any): string {
    return formatFhirR5(template, this.options);
  }

  setOptions(options: Partial<FhirR5Options>): void {
    this.options = { ...this.options, ...options };
  }

  toBundle(templates: any[]): string {
    const bundle = {
      resourceType: 'Bundle',
      type: 'collection',
      entry: templates.map(t => ({
        resource: this.options.useR5Composition 
          ? buildComposition(t, this.options)
          : buildDiagnosticReportR5(t, this.options),
      })),
    };
    return this.options.prettyPrint
      ? JSON.stringify(bundle, null, 2)
      : JSON.stringify(bundle);
  }
}

export default FhirR5Formatter;
