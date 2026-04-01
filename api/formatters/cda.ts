/**
 * CDA Formatter - Converts templates to HL7 CDA (Clinical Document Architecture) XML format
 * Dependencies: SCHEMA_TEMPLATE_BASE
 * CDA: HL7 Clinical Document Architecture Level 2
 */

export interface CdaOptions {
  includeXMLDeclaration?: boolean;
  includeHeader?: boolean;
  includeStylesheet?: boolean;
  prettyPrint?: boolean;
  documentId?: string;
  setId?: string;
  versionNumber?: string;
  languageCode?: string;
  realmCode?: string;
}

const defaultCdaOptions: CdaOptions = {
  includeXMLDeclaration: true,
  includeHeader: true,
  includeStylesheet: false,
  prettyPrint: true,
  documentId: generateId(),
  setId: generateId(),
  versionNumber: '1',
  languageCode: 'en-US',
  realmCode: 'UV',
};

/**
 * Generates a CDA XML document from a template
 */
export function formatCda(template: any, options?: CdaOptions): string {
  const opts = { ...defaultCdaOptions, ...options };
  const xml = buildCdaXml(template, opts);
  return xml;
}

function buildCdaXml(template: any, opts: CdaOptions): string {
  const lines: string[] = [];

  // XML Declaration
  if (opts.includeXMLDeclaration) {
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  }

  // Stylesheet
  if (opts.includeStylesheet) {
    lines.push('<?xml-stylesheet type="text/xsl" href="cda.xsl"?>');
  }

  // Clinical Document
  lines.push(`<ClinicalDocument xmlns="urn:hl7-org:v3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`);
  lines.push(`  xmlns:cda="urn:hl7-org:v3"`);
  lines.push(`  xmlns:sdtc="urn:hl7-org:sdtc"`);
  lines.push(`  xsi:schemaLocation="urn:hl7-org:v3 CDA.xsd">`);

  // Realm Code
  lines.push(`  <realmCode code="${opts.realmCode}"/>`);

  // Type ID
  lines.push('  <typeId root="2.16.840.1.113883.1.3" extension="POCD_HD000040"/>');

  // Template IDs
  lines.push('  <templateId root="2.16.840.1.113883.10.20.3"/>');
  lines.push(`  <templateId root="1.2.3.4.5.6.7.8.1" extension="${template.id || 'radiology-report'}"/>`);

  // Document ID
  lines.push(`  <id root="${opts.documentId}" extension="${template.id || 'DOC001'}"/>`);

  // Code (LOINC code for Radiology Report)
  lines.push('  <code code="11502-2" codeSystem="2.16.840.1.113883.6.1"');
  lines.push('    codeSystemName="LOINC" displayName="Radiology Report"/>');

  // Title
  lines.push(`  <title>${escapeXml(template.name || 'Radiology Report')}</title>`);

  // Effective Time
  lines.push(`  <effectiveTime value="${formatCdaDateTime(new Date())}"/>`);

  // Confidentiality Code
  lines.push('  <confidentialityCode code="N" codeSystem="2.16.840.1.113883.5.25"');
  lines.push('    codeSystemName="HL7Confidentiality" displayName="Normal"/>');

  // Language Code
  lines.push(`  <languageCode code="${opts.languageCode}"/>`);

  // Version Number
  lines.push(`  <versionNumber value="${opts.versionNumber}"/>`);

  // Set ID
  lines.push(`  <setId root="${opts.setId}" extension="${template.id || 'SET001'}"/>`);

  // Document Realm
  lines.push(`  <realmCode code="${opts.realmCode}"/>`);

  // Header (Patient, Author, etc.)
  if (opts.includeHeader) {
    lines.push(...buildHeader(template, opts));
  }

  // Body
  lines.push(...buildBody(template, opts));

  lines.push('</ClinicalDocument>');

  return opts.prettyPrint ? lines.join('\n') : lines.join('');
}

function buildHeader(template: any, opts: CdaOptions): string[] {
  const lines: string[] = [];

  lines.push('  <!-- Header -->');
  lines.push('  <recordTarget>');
  lines.push('    <patientRole>');
  
  // Patient ID
  lines.push(`      <id root="2.16.840.1.113883.4.1" extension="${template.patientId || 'PAT001'}"/>`);
  
  // Patient Name
  lines.push('      <patient>');
  const patientName = template.patientName || 'Patient^John';
  const nameParts = patientName.split('^');
  lines.push(`        <name use="L">`);
  lines.push(`          <family>${escapeXml(nameParts[0] || '')}</family>`);
  lines.push(`          <given>${escapeXml(nameParts[1] || '')}</given>`);
  lines.push(`        </name>`);
  lines.push(`        <administrativeGenderCode code="${template.patientSex === 'F' ? 'F' : 'M'}"`);
  lines.push('          codeSystem="2.16.840.1.113883.5.1" codeSystemName="AdministrativeGender"/>');
  lines.push(`        <birthTime value="${formatCdaDate(template.dateOfBirth || new Date())}"/>`);
  lines.push('      </patient>');
  
  // Address
  lines.push('      <addr use="HP">');
  lines.push('        <streetAddressLine>123 Medical Center Dr</streetAddressLine>');
  lines.push('        <city>Boston</city>');
  lines.push('        <state>MA</state>');
  lines.push('        <postalCode>02114</postalCode>');
  lines.push('        <country>USA</country>');
  lines.push('      </addr>');
  
  lines.push('    </patientRole>');
  lines.push('  </recordTarget>');

  // Author
  lines.push('  <author>');
  lines.push(`    <time value="${formatCdaDateTime(new Date())}"/>`);
  lines.push('    <assignedAuthor>');
  lines.push(`      <id root="2.16.840.1.113883.4.6" extension="${template.authorId || 'AUTH001'}"/>`);
  lines.push('      <assignedPerson>');
  lines.push('        <name use="L">');
  lines.push(`          <family>${escapeXml((template.author || 'Radiologist').split('^')[0])}</family>`);
  lines.push('        </name>');
  lines.push('      </assignedPerson>');
  lines.push('      <representedOrganization>');
  lines.push(`        <id root="2.16.840.1.113883.19.5" extension="ORG001"/>`);
  lines.push('        <name>Radiology Department</name>');
  lines.push('      </representedOrganization>');
  lines.push('    </assignedAuthor>');
  lines.push('  </author>');

  // Data Enterer
  lines.push('  <dataEnterer>');
  lines.push('    <assignedEntity>');
  lines.push(`      <id root="2.16.840.1.113883.4.6" extension="ENTER001"/>`);
  lines.push('    </assignedEntity>');
  lines.push('  </dataEnterer>');

  // Informant
  lines.push('  <informant>');
  lines.push('    <assignedEntity>');
  lines.push(`      <id root="2.16.840.1.113883.4.6" extension="INFO001"/>`);
  lines.push('    </assignedEntity>');
  lines.push('  </informant>');

  // Custodian
  lines.push('  <custodian>');
  lines.push('    <assignedCustodian>');
  lines.push('      <representedCustodianOrganization>');
  lines.push(`        <id root="2.16.840.1.113883.19.5" extension="ORG001"/>`);
  lines.push('        <name>Radiology Department</name>');
  lines.push('      </representedCustodianOrganization>');
  lines.push('    </assignedCustodian>');
  lines.push('  </custodian>');

  // Legal Authenticator
  lines.push('  <legalAuthenticator>');
  lines.push(`    <time value="${formatCdaDateTime(new Date())}"/>`);
  lines.push('    <signatureCode code="S"/>');
  lines.push('    <assignedEntity>');
  lines.push(`      <id root="2.16.840.1.113883.4.6" extension="${template.authorId || 'AUTH001'}"/>`);
  lines.push('      <assignedPerson>');
  lines.push('        <name use="L">');
  lines.push(`          <family>${escapeXml((template.author || 'Radiologist').split('^')[0])}</family>`);
  lines.push('        </name>');
  lines.push('      </assignedPerson>');
  lines.push('    </assignedEntity>');
  lines.push('  </legalAuthenticator>');

  // Documentation Of (Service Event)
  lines.push('  <documentationOf>');
  lines.push('    <serviceEvent classCode="PROC" moodCode="EVN">');
  lines.push(`      <code code="${getProcedureCode(template)}" codeSystem="2.16.840.1.113883.6.1"`);
  lines.push(`        displayName="${escapeXml(template.name || 'Radiology Study')}"/>`);
  lines.push(`      <effectiveTime value="${formatCdaDateTime(new Date())}"/>`);
  lines.push('    </serviceEvent>');
  lines.push('  </documentationOf>');

  // In Fulfillment Of (Order)
  if (template.orderId || template.accessionNumber) {
    lines.push('  <inFulfillmentOf>');
    lines.push('    <order>');
    lines.push(`      <id root="2.16.840.1.113883.4.3" extension="${template.orderId || 'ORD001'}"/>`);
    if (template.accessionNumber) {
      lines.push(`      <id root="1.2.3.4.5" extension="${template.accessionNumber}"/>`);
    }
    lines.push('    </order>');
    lines.push('  </inFulfillmentOf>');
  }

  return lines;
}

function buildBody(template: any, opts: CdaOptions): string[] {
  const lines: string[] = [];

  lines.push('  <!-- Body -->');
  lines.push('  <component>');
  lines.push('    <structuredBody>');

  // History of Present Illness / Clinical History
  if (template.history) {
    lines.push(...buildSection('HISTORY', 'History of Present Illness', template.history, '11502-2'));
  }

  // Procedure Description
  if (template.technique || template.examType) {
    lines.push(...buildSection('PROCEDURE', 'Procedure Description', template.technique || template.examType, '59776-0'));
  }

  // Findings
  if (template.findings) {
    lines.push(...buildSection('FINDINGS', 'Findings', template.findings, '29545-1'));
  }

  // Impression
  if (template.impression) {
    lines.push(...buildSection('IMPRESSION', 'Impression', template.impression, '19005-8'));
  }

  // Recommendations
  if (template.recommendations) {
    lines.push(...buildSection('RECOMMENDATIONS', 'Recommendations', template.recommendations, '18785-6'));
  }

  // RADS Classification
  if (template.rads) {
    lines.push(...buildSectionWithCode('RADS', 'RADS Classification', template.rads, template.radsScore));
  }

  lines.push('    </structuredBody>');
  lines.push('  </component>');

  return lines;
}

function buildSection(code: string, title: string, content: any, loincCode: string): string[] {
  const lines: string[] = [];
  
  lines.push(`      <component>`);
  lines.push(`        <section>`);
  lines.push(`          <code code="${loincCode}" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"/>`);
  lines.push(`          <title>${escapeXml(title)}</title>`);
  lines.push(`          <text>`);
  
  const contentText = typeof content === 'string' ? content : JSON.stringify(content);
  const paragraphs = contentText.split('\n').filter((p: string) => p.trim());
  
  for (const para of paragraphs) {
    lines.push(`            <paragraph>${escapeXml(para.trim())}</paragraph>`);
  }
  
  lines.push(`          </text>`);
  lines.push(`        </section>`);
  lines.push(`      </component>`);
  
  return lines;
}

function buildSectionWithCode(code: string, title: string, value: string, score?: string): string[] {
  const lines: string[] = [];
  
  lines.push(`      <component>`);
  lines.push(`        <section>`);
  lines.push(`          <code code="97504" codeSystem="2.16.840.1.113883.6.1" codeSystemName="Local"/>`);
  lines.push(`          <title>${escapeXml(title)}</title>`);
  lines.push(`          <text>`);
  lines.push(`            <paragraph>${escapeXml(value)}</paragraph>`);
  if (score) {
    lines.push(`            <paragraph>Score: ${escapeXml(String(score))}</paragraph>`);
  }
  lines.push(`          </text>`);
  lines.push(`          <entry>`);
  lines.push(`            <observation classCode="OBS" moodCode="EVN">`);
  lines.push(`              <code code="97504" codeSystem="2.16.840.1.113883.6.1" displayName="${escapeXml(value)}"/>`);
  lines.push(`              <value xsi:type="CD" code="${escapeXml(value)}"/>`);
  lines.push(`            </observation>`);
  lines.push(`          </entry>`);
  lines.push(`        </section>`);
  lines.push(`      </component>`);
  
  return lines;
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

function generateId(): string {
  return `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.replace(/x/g, () => 
    Math.floor(Math.random() * 16).toString(16)
  );
}

function formatCdaDate(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

function formatCdaDateTime(date: Date): string {
  return date.toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '');
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
 * CdaFormatter class for advanced formatting
 */
export class CdaFormatter {
  private options: CdaOptions;

  constructor(options?: CdaOptions) {
    this.options = { ...defaultCdaOptions, ...options };
  }

  format(template: any): string {
    return formatCda(template, this.options);
  }

  setOptions(options: Partial<CdaOptions>): void {
    this.options = { ...this.options, ...options };
  }
}

export default CdaFormatter;
