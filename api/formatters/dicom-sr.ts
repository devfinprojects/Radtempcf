/**
 * DICOM SR Formatter - Converts templates to DICOM SR (Structured Report) XML format
 * Dependencies: SCHEMA_TEMPLATE_BASE
 * DICOM SR: Digital Imaging and Communications in Medicine Structured Report
 */

export interface DicomSrOptions {
  includePatientModule?: boolean;
  includeStudyModule?: boolean;
  includeSeriesModule?: boolean;
  includeSRDocumentModule?: boolean;
  includeXMLDeclaration?: boolean;
  prettyPrint?: boolean;
  sopClassUID?: string;
  sopInstanceUID?: string;
  implementationClassUID?: string;
}

const defaultDicomSrOptions: DicomSrOptions = {
  includePatientModule: true,
  includeStudyModule: true,
  includeSeriesModule: true,
  includeSRDocumentModule: true,
  includeXMLDeclaration: true,
  prettyPrint: true,
  sopClassUID: '1.2.840.10008.5.1.4.1.1.88.11', // Basic Text SR
  sopInstanceUID: generateUID(),
  implementationClassUID: '1.2.3.4.5.6.7.8.9',
};

/**
 * Generates a DICOM SR XML from a template
 */
export function formatDicomSr(template: any, options?: DicomSrOptions): string {
  const opts = { ...defaultDicomSrOptions, ...options };
  const xml = buildDicomSrXml(template, opts);
  return xml;
}

function buildDicomSrXml(template: any, opts: DicomSrOptions): string {
  const lines: string[] = [];

  if (opts.includeXMLDeclaration) {
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  }

  lines.push('<DicomStructuredReport xmlns="http://dicom.org/dicom SR"');
  lines.push('  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"');
  lines.push(`  xsi:schemaLocation="http://dicom.org/dicom SR dicom-sr.xsd">`);

  // Patient Module
  if (opts.includePatientModule) {
    lines.push('  <PatientModule>');
    lines.push(`    <PatientName>${escapeXml(template.patientName || 'Patient^John')}</PatientName>`);
    lines.push(`    <PatientID>${escapeXml(template.patientId || 'PATIENT001')}</PatientID>`);
    lines.push(`    <PatientBirthDate>${formatDicomDate(template.dateOfBirth || new Date())}</PatientBirthDate>`);
    lines.push(`    <PatientSex>${escapeXml(template.patientSex || 'M')}</PatientSex>`);
    lines.push('  </PatientModule>');
  }

  // Study Module
  if (opts.includeStudyModule) {
    lines.push('  <StudyModule>');
    lines.push(`    <StudyInstanceUID>${template.studyInstanceUid || generateUID()}</StudyInstanceUID>`);
    lines.push(`    <StudyDate>${formatDicomDate(new Date())}</StudyDate>`);
    lines.push(`    <StudyTime>${formatDicomTime(new Date())}</StudyTime>`);
    lines.push(`    <StudyDescription>${escapeXml(template.name || 'Radiology Report')}</StudyDescription>`);
    lines.push(`    <AccessionNumber>${escapeXml(template.accessionNumber || '')}</AccessionNumber>`);
    lines.push('  </StudyModule>');
  }

  // Series Module
  if (opts.includeSeriesModule) {
    lines.push('  <SeriesModule>');
    lines.push(`    <SeriesInstanceUID>${template.seriesInstanceUid || generateUID()}</SeriesInstanceUID>`);
    lines.push(`    <SeriesNumber>${template.seriesNumber || '1'}</SeriesNumber>`);
    lines.push(`    <Modality>${escapeXml(template.modality || 'OT')}</Modality>`);
    lines.push(`    <SeriesDescription>${escapeXml(template.category || 'Radiology')}</SeriesDescription>`);
    lines.push('  </SeriesModule>');
  }

  // SR Document Module
  if (opts.includeSRDocumentModule) {
    lines.push('  <SRDocumentModule>');
    lines.push(`    <SOPClassUID>${opts.sopClassUID}</SOPClassUID>`);
    lines.push(`    <SOPInstanceUID>${opts.sopInstanceUID}</SOPInstanceUID>`);
    lines.push(`    <CompletionFlag>${template.completed !== false ? 'COMPLETE' : 'PARTIAL'}</CompletionFlag>`);
    lines.push(`    <VerificationFlag>${template.verified ? 'VERIFIED' : 'UNVERIFIED'}</VerificationFlag>`);
    lines.push(`    <ContentTemplateSequence>`);
    lines.push(`      <MappingResource>ISO IR 192</MappingResource>`);
    lines.push(`      <TemplateIdentifier>2000</TemplateIdentifier>`);
    lines.push(`    </ContentTemplateSequence>`);
    lines.push('  </SRDocumentModule>');
  }

  // Content Sequence
  lines.push('  <ContentSequence>');

  // Procedure Code (Template name)
  lines.push('    <ProcedureCode>');
  lines.push(`      <CodeValue>${getProcedureCode(template)}</CodeValue>`);
  lines.push(`      <CodingSchemeDesignator>LNC</CodingSchemeDesignator>`);
  lines.push(`      <CodeMeaning>${escapeXml(template.name || 'Radiology Report')}</CodeMeaning>`);
  lines.push('    </ProcedureCode>');

  // Findings
  if (template.findings) {
    lines.push('    <FindingsSection>');
    lines.push('      <ConceptNameCode>');
    lines.push('        <CodeValue>18785-6</CodeValue>');
    lines.push('        <CodingSchemeDesignator>LNC</CodingSchemeDesignator>');
    lines.push('        <CodeMeaning>Radiology Findings</CodeMeaning>');
    lines.push('      </ConceptNameCode>');
    lines.push('      <FindingsSequence>');
    
    if (typeof template.findings === 'string') {
      const findings = template.findings.split('\n').filter((f: string) => f.trim());
      for (const finding of findings) {
        lines.push('        <FindingText>');
        lines.push(`          <TextValue>${escapeXml(finding.trim())}</TextValue>`);
        lines.push('        </FindingText>');
      }
    } else if (Array.isArray(template.findings)) {
      for (const finding of template.findings) {
        const text = typeof finding === 'string' ? finding : finding.category;
        if (text) {
          lines.push('        <FindingText>');
          lines.push(`          <TextValue>${escapeXml(text)}</TextValue>`);
          lines.push('        </FindingText>');
        }
      }
    }
    
    lines.push('      </FindingsSequence>');
    lines.push('    </FindingsSection>');
  }

  // Impression
  if (template.impression) {
    lines.push('    <ImpressionSection>');
    lines.push('      <ConceptNameCode>');
    lines.push('        <CodeValue>19005-8</CodeValue>');
    lines.push('        <CodingSchemeDesignator>LNC</CodingSchemeDesignator>');
    lines.push('        <CodeMeaning>Radiology Impression</CodeMeaning>');
    lines.push('      </ConceptNameCode>');
    lines.push('      <ImpressionSequence>');
    
    if (typeof template.impression === 'string') {
      const impressions = template.impression.split('\n').filter((i: string) => i.trim());
      for (let i = 0; i < impressions.length; i++) {
        lines.push('        <ImpressionNumber>');
        lines.push(`          <NumberValue>${i + 1}</NumberValue>`);
        lines.push(`          <TextValue>${escapeXml(impressions[i].trim())}</TextValue>`);
        lines.push('        </ImpressionNumber>');
      }
    } else if (Array.isArray(template.impression)) {
      for (let i = 0; i < template.impression.length; i++) {
        lines.push('        <ImpressionNumber>');
        lines.push(`          <NumberValue>${i + 1}</NumberValue>`);
        lines.push(`          <TextValue>${escapeXml(String(template.impression[i]))}</TextValue>`);
        lines.push('        </ImpressionNumber>');
      }
    }
    
    lines.push('      </ImpressionSequence>');
    lines.push('    </ImpressionSection>');
  }

  // Recommendations
  if (template.recommendations) {
    lines.push('    <RecommendationsSection>');
    lines.push('      <ConceptNameCode>');
    lines.push('        <CodeValue>18785-6</CodeValue>');
    lines.push('        <CodingSchemeDesignator>LNC</CodingSchemeDesignator>');
    lines.push('        <CodeMeaning>Recommendation</CodeMeaning>');
    lines.push('      </ConceptNameCode>');
    lines.push('      <RecommendationsSequence>');
    
    if (Array.isArray(template.recommendations)) {
      for (const rec of template.recommendations) {
        const text = typeof rec === 'string' ? rec : rec.text;
        const priority = typeof rec === 'string' ? '' : (rec.priority || '');
        if (text) {
          lines.push('        <RecommendationItem>');
          lines.push(`          <TextValue>${escapeXml(text)}</TextValue>`);
          if (priority) {
            lines.push(`          <Priority>${escapeXml(priority)}</Priority>`);
          }
          lines.push('        </RecommendationItem>');
        }
      }
    }
    
    lines.push('      </RecommendationsSequence>');
    lines.push('    </RecommendationsSection>');
  }

  // RADS Classification
  if (template.rads) {
    lines.push('    <RADSClassification>');
    lines.push('      <ConceptNameCode>');
    lines.push('        <CodeValue>97504</CodeValue>');
    lines.push('        <CodingSchemeDesignator>99RAD</CodingSchemeDesignator>');
    lines.push('        <CodeMeaning>RADS Classification</CodeMeaning>');
    lines.push('      </ConceptNameCode>');
    lines.push(`      <Value>${escapeXml(template.rads)}</Value>`);
    if (template.radsScore) {
      lines.push(`      <Score>${escapeXml(String(template.radsScore))}</Score>`);
    }
    lines.push('    </RADSClassification>');
  }

  lines.push('  </ContentSequence>');

  // Preamble (Clinical History)
  if (template.history) {
    lines.push('  <ClinicalHistory>');
    lines.push(`    <TextValue>${escapeXml(template.history)}</TextValue>`);
    lines.push('  </ClinicalHistory>');
  }

  // Technique
  if (template.technique) {
    lines.push('  <TechniqueDescription>');
    lines.push(`    <TextValue>${escapeXml(template.technique)}</TextValue>`);
    lines.push('  </TechniqueDescription>');
  }

  // Performer
  lines.push('  <PerformerModule>');
  lines.push(`    <PerformerName>${escapeXml(template.author || 'Radiologist')}</PerformerName>`);
  lines.push(`    <OrganizationName>${escapeXml(template.institution || 'Radiology Department')}</OrganizationName>`);
  lines.push('  </PerformerModule>');

  lines.push('</DicomStructuredReport>');

  return opts.prettyPrint ? lines.join('\n') : lines.join('');
}

function escapeXml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateUID(): string {
  const now = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `1.2.3.4.5.${now}.${random}`;
}

function formatDicomDate(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

function formatDicomTime(date: Date): string {
  return date.toISOString().slice(11, 19).replace(/:/g, '');
}

function getProcedureCode(template: any): string {
  const codeMap: Record<string, string> = {
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
  return codeMap[template.name] || '11502-2';
}

/**
 * DicomSrFormatter class for advanced formatting
 */
export class DicomSrFormatter {
  private options: DicomSrOptions;

  constructor(options?: DicomSrOptions) {
    this.options = { ...defaultDicomSrOptions, ...options };
  }

  format(template: any): string {
    return formatDicomSr(template, this.options);
  }

  setOptions(options: Partial<DicomSrOptions>): void {
    this.options = { ...this.options, ...options };
  }

  setPatientInfo(patientName: string, patientId: string, dateOfBirth?: Date, sex?: string): void {
    this.options = { 
      ...this.options,
    };
    // Store in template-like object for formatting
    (this.options as any).patientName = patientName;
    (this.options as any).patientId = patientId;
    (this.options as any).dateOfBirth = dateOfBirth;
    (this.options as any).patientSex = sex;
  }
}

export default DicomSrFormatter;
