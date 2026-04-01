/**
 * FHIR R4 Formatter - Converts templates to FHIR R4 DiagnosticReport resources
 * Dependencies: SCHEMA_TEMPLATE_BASE
 * FHIR R4: HL7 FHIR Release 4
 */

export interface FhirR4Options {
  includePatient?: boolean;
  includeOrganization?: boolean;
  includePractitioner?: boolean;
  includeMedia?: boolean;
  baseUrl?: string;
  prettyPrint?: boolean;
}

const defaultFhirR4Options: FhirR4Options = {
  includePatient: true,
  includeOrganization: true,
  includePractitioner: true,
  includeMedia: false,
  baseUrl: 'http://hl7.org/fhir/',
  prettyPrint: true,
};

/**
 * Generates a FHIR R4 DiagnosticReport from a template
 */
export function formatFhirR4(template: any, options?: FhirR4Options): string {
  const opts = { ...defaultFhirR4Options, ...options };
  const fhirResource = buildDiagnosticReport(template, opts);
  return opts.prettyPrint
    ? JSON.stringify(fhirResource, null, 2)
    : JSON.stringify(fhirResource);
}

function buildDiagnosticReport(template: any, opts: FhirR4Options): any {
  const resource: any = {
    resourceType: 'DiagnosticReport',
    id: template.id || generateId(),
    meta: {
      profile: ['http://hl7.org/fhir/StructureDefinition/DiagnosticReport'],
      versionId: template.version || '1.0.0',
      lastUpdated: template.lastUpdated || new Date().toISOString(),
    },
    status: 'final',
    category: buildCategory(template),
    code: buildCode(template),
    subject: opts.includePatient ? buildSubject(template) : undefined,
    effectiveDateTime: template.effectiveDateTime || new Date().toISOString(),
    issued: template.issued || new Date().toISOString(),
    performer: opts.includeOrganization ? buildPerformer(template) : undefined,
    result: buildResults(template),
    conclusion: buildConclusion(template),
    imagingStudy: buildImagingStudy(template),
  };

  // Remove undefined values
  return JSON.parse(JSON.stringify(resource));
}

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function buildCategory(template: any): any[] {
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
      system: 'http://hl7.org/fhir/v2/0074',
      code: category,
      display: template.category || 'Radiology',
    }],
  }];
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
  return loincMap[template.name] || '11502-2'; // Default: Radiology report
}

function buildSubject(template: any): any {
  return {
    reference: 'Patient/example',
    display: template.patientName || 'Example Patient',
  };
}

function buildPerformer(template: any): any {
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

function buildImagingStudy(template: any): any[] {
  const study: any = {
    reference: `ImagingStudy/${template.id || 'example'}`,
    display: template.name || 'Radiology Study',
  };

  // Add modality if available
  if (template.modality) {
    study.type = [{
      coding: [{
        system: 'http://dicom.nema.org/resources/ontology/DCM',
        code: getDicomCode(template.modality),
        display: template.modality,
      }],
    }];
  }

  return [study];
}

function getDicomCode(modality: string): string {
  const dicomMap: Record<string, string> = {
    'CT': 'CT',
    'MRI': 'MR',
    'X-ray': 'CR',
    'Ultrasound': 'US',
    'PET': 'PT',
    'Mammography': 'MG',
    'Fluoroscopy': 'RF',
    'Angiography': 'XA',
  };
  return dicomMap[modality] || 'OT';
}

/**
 * FhirR4Formatter class for advanced formatting
 */
export class FhirR4Formatter {
  private options: FhirR4Options;

  constructor(options?: FhirR4Options) {
    this.options = { ...defaultFhirR4Options, ...options };
  }

  format(template: any): string {
    return formatFhirR4(template, this.options);
  }

  setOptions(options: Partial<FhirR4Options>): void {
    this.options = { ...this.options, ...options };
  }

  toBundle(templates: any[]): string {
    const bundle = {
      resourceType: 'Bundle',
      type: 'collection',
      entry: templates.map(t => ({
        resource: buildDiagnosticReport(t, this.options),
      })),
    };
    return this.options.prettyPrint
      ? JSON.stringify(bundle, null, 2)
      : JSON.stringify(bundle);
  }
}

export default FhirR4Formatter;
