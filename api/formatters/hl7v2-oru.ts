/**
 * HL7 v2 ORU Formatter - Converts templates to HL7 v2 ORU messages
 * Dependencies: SCHEMA_TEMPLATE_BASE
 * HL7 v2: Health Level Seven Version 2.x
 * ORU: Observation Result
 */

export interface Hl7V2Options {
  version?: '2.3' | '2.4' | '2.5' | '2.5.1' | '2.7' | '2.8';
  sendingApplication?: string;
  sendingFacility?: string;
  receivingApplication?: string;
  receivingFacility?: string;
  includeMSH?: boolean;
  includePID?: boolean;
  includeOBR?: boolean;
  includeOBX?: boolean;
  fieldSeparator?: string;
  encodingCharacters?: string;
  includeZSegments?: boolean;
}

const defaultHl7V2Options: Hl7V2Options = {
  version: '2.5.1',
  sendingApplication: 'RADREPORT',
  sendingFacility: 'RADIOLOGY',
  receivingApplication: 'HIS',
  receivingFacility: 'HOSPITAL',
  includeMSH: true,
  includePID: true,
  includeOBR: true,
  includeOBX: true,
  fieldSeparator: '|',
  encodingCharacters: '^~\\&',
  includeZSegments: false,
};

/**
 * Generates an HL7 v2 ORU message from a template
 */
export function formatHl7V2Oru(template: any, options?: Hl7V2Options): string {
  const opts = { ...defaultHl7V2Options, ...options };
  const segments: string[] = [];
  const fs = opts.fieldSeparator || '|';
  const ec = opts.encodingCharacters || '^~\\&';

  // MSH Segment - Message Header
  if (opts.includeMSH) {
    segments.push(buildMSH(template, opts, fs, ec));
  }

  // PID Segment - Patient Information
  if (opts.includePID) {
    segments.push(buildPID(template, opts, fs, ec));
  }

  // OBR Segment - Observation Request
  if (opts.includeOBR) {
    segments.push(buildOBR(template, opts, fs, ec));
  }

  // OBX Segments - Observation Results
  if (opts.includeOBX) {
    const obxSegments = buildOBXSegments(template, opts, fs, ec);
    segments.push(...obxSegments);
  }

  // Z-segments (optional)
  if (opts.includeZSegments) {
    segments.push(...buildZSegments(template, opts, fs));
  }

  return segments.join('\r');
}

function buildMSH(template: any, opts: Hl7V2Options, fs: string, ec: string): string {
  const fields = [
    fs, // Field separator position (empty in MSH)
    '', // Encoding characters (moved to position 2)
    opts.sendingApplication,
    opts.sendingFacility,
    opts.receivingApplication,
    opts.receivingFacility,
    formatDate(new Date()),
    formatTime(new Date()),
    '',
    'ORU^R01', // Message Type
    generateMessageControlId(),
    opts.version,
    '',
  ];
  
  // Position 1 is the field separator, position 2 is encoding characters
  return `MSH${ec}${fields.join(fs)}`.replace(`${fs}${fs}`, fs);
}

function buildPID(template: any, opts: Hl7V2Options, fs: string, ec: string): string {
  const fields = [
    '1', // Set ID
    '', // Patient ID
    '', // Patient Identifier List
    '', // Alternate Patient ID
    template.patientName || 'Patient^John', // Patient Name
    '', // Mother's Maiden Name
    formatDate(template.dateOfBirth || new Date()), // Date of Birth
    template.patientSex || 'M', // Sex
    '', // Patient Alias
    '', // Race
    '', // Patient Address
    '', // County Code
    '', // Phone Number - Home
    '', // Phone Number - Business
    '', // Language
    '', // Marital Status
    '', // Religion
    '', // Patient Account Number
    '', // SSN
    '', // Driver's License
  ];
  
  return `PID${fs}${fields.join(fs)}`;
}

function buildOBR(template: any, opts: Hl7V2Options, fs: string, ec: string): string {
  const fields = [
    '1', // Set ID - OBR
    '', // Placer Order Number
    generateOrderNumber(), // Filler Order Number
    '', // Universal Service ID
    '', // Priority
    '', // Requested Date/Time
    formatDateTime(new Date()), // Observation Date/Time
    '', // Observation End Date/Time
    '', // Collection Volume
    '', // Collection Volume Units
    '', // Specimen Source
    '', // Ordering Provider
    '', // Order Callback Phone Number
    '', // Placer Field 1
    '', // Placer Field 2
    '', // Filler Field 1
    '', // Filler Field 2
    '', // Results Rpt/Status Chng
    formatDateTime(new Date()), // Charge to Practice
    '', // Total Number of Occurrences
    '', // Result Copies To
    '', // Parent Number
    '', // Transportation Mode
    '', // Reason for Study
    template.author || 'Radiologist', // Principal Result Interpreter
    '', // Assistant Result Interpreter
    '', // Technician
    '', // Transcriptionist
    '', // Scheduled Date/Time
    '', // Number of Sample Containers
    '', // Transport Logistics of Collected Sample
    '', // Collector's Comment
    '', // Transport Arrangement Responsibility
    '', // Transport Arranged
    '', // Escort Required
    '', // Planned Patient Transport Comment
    template.technique || '', // Procedure Code
  ];
  
  return `OBR${fs}${fields.join(fs)}`;
}

function buildOBXSegments(template: any, opts: Hl7V2Options, fs: string, ec: string): string[] {
  const segments: string[] = [];
  let sequence = 1;

  // OBX for Findings
  if (template.findings) {
    const findingsText = typeof template.findings === 'string' 
      ? template.findings 
      : JSON.stringify(template.findings);
    
    segments.push(buildOBX(
      sequence++,
      'FT',
      'GGF.FINDINGS',
      findingsText,
      template,
      opts,
      fs,
      ec
    ));
  }

  // OBX for Impression
  if (template.impression) {
    const impressionText = typeof template.impression === 'string'
      ? template.impression
      : template.impression.join('\n');
    
    segments.push(buildOBX(
      sequence++,
      'FT',
      'GGF.IMPRESSION',
      impressionText,
      template,
      opts,
      fs,
      ec
    ));
  }

  // OBX for Recommendations
  if (template.recommendations) {
    const recText = Array.isArray(template.recommendations)
      ? template.recommendations.join('\n')
      : template.recommendations;
    
    segments.push(buildOBX(
      sequence++,
      'FT',
      'GGF.RECOMMENDATIONS',
      recText,
      template,
      opts,
      fs,
      ec
    ));
  }

  // OBX for RADS Classification
  if (template.rads) {
    segments.push(buildOBX(
      sequence++,
      'CE',
      'GGF.RADS',
      template.rads,
      template,
      opts,
      fs,
      ec
    ));

    if (template.radsScore) {
      segments.push(buildOBX(
        sequence++,
        'NM',
        'GGF.RADSSCORE',
        String(template.radsScore),
        template,
        opts,
        fs,
        ec
      ));
    }
  }

  // OBX for Modality
  if (template.modality) {
    segments.push(buildOBX(
      sequence++,
      'CE',
      'GGF.MODALITY',
      template.modality,
      template,
      opts,
      fs,
      ec
    ));
  }

  // OBX for Body Region
  if (template.bodyRegion) {
    segments.push(buildOBX(
      sequence++,
      'CE',
      'GGF.BODYREGION',
      template.bodyRegion,
      template,
      opts,
      fs,
      ec
    ));
  }

  return segments;
}

function buildOBX(
  sequence: number,
  valueType: string,
  identifier: string,
  value: string,
  template: any,
  opts: Hl7V2Options,
  fs: string,
  ec: string
): string {
  const fields = [
    String(sequence), // Set ID - OBX
    valueType, // Value Type
    '', // Observation Identifier (Components)
    identifier, // Observation Sub-ID
    value, // Observation Value
    '', // Units
    '', // Reference Range
    '', // Abnormal Flags
    '', // Probability
    '', // Nature of Abnormal Test
    formatDateTime(new Date()), // Date/Time of Observation
    template.author || 'RADREPORT', // Producer ID
    '', // Responsible Observer
    '', // Observation Method
    '', // Equipment Instance Identifier
    '', // Date/Time of Analysis
    '', // Date/Time of Assembly
    '', // Reserved
    template.id || '', // Reserved
    template.id || '', // Reserved
  ];
  
  return `OBX${fs}${fields.join(fs)}`;
}

function buildZSegments(template: any, opts: Hl7V2Options, fs: string): string[] {
  const segments: string[] = [];

  // ZFA - Follow-up Action
  if (template.recommendations) {
    const fields = [
      '1', // Sequence
      'RECOMMEND', // Follow-up Type
      Array.isArray(template.recommendations) 
        ? template.recommendations.join('; ')
        : template.recommendations,
    ];
    segments.push(`ZFA${fs}${fields.join(fs)}`);
  }

  // ZIS - Image Storage
  if (template.studyInstanceUid) {
    const fields = [
      template.studyInstanceUid, // Study Instance UID
      template.seriesInstanceUid || '', // Series Instance UID
      template.modality || '', // Modality
    ];
    segments.push(`ZIS${fs}${fields.join(fs)}`);
  }

  return segments;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

function formatTime(date: Date): string {
  return date.toISOString().slice(11, 19).replace(/:/g, '');
}

function formatDateTime(date: Date): string {
  return formatDate(date) + formatTime(date);
}

function generateMessageControlId(): string {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

function generateOrderNumber(): string {
  return `ORD${Date.now()}`;
}

/**
 * Hl7V2OruFormatter class for advanced formatting
 */
export class Hl7V2OruFormatter {
  private options: Hl7V2Options;

  constructor(options?: Hl7V2Options) {
    this.options = { ...defaultHl7V2Options, ...options };
  }

  format(template: any): string {
    return formatHl7V2Oru(template, this.options);
  }

  setOptions(options: Partial<Hl7V2Options>): void {
    this.options = { ...this.options, ...options };
  }

  toBatch(templates: any[]): string {
    const segments: string[] = [];
    
    // FHS - File Header
    segments.push(`FHS^~\\&${this.options.sendingApplication}^${this.options.sendingFacility}`);
    
    // BHS - Batch Header
    segments.push(`BHS^~\\&${this.options.sendingApplication}^${this.options.sendingFacility}`);
    
    // Process each template
    for (const template of templates) {
      segments.push(this.format(template));
    }
    
    // BTS - Batch Trailer
    segments.push(`BTS${this.options.fieldSeparator}${templates.length}`);
    
    // FTS - File Trailer
    segments.push(`FTS${this.options.fieldSeparator}1`);
    
    return segments.join('\r');
  }
}

export default Hl7V2OruFormatter;
