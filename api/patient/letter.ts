/**
 * Patient Letter Generation API
 * Generates personalized patient letters from radiology reports
 */

import { generateSummary, type SummaryOptions } from './summary';
import { translateSummary, type LanguageCode } from './translations';
import type { FollowUpRecommendation } from './followup';

export interface LetterOptions {
  patientName: string;
  dateOfBirth?: string;
  includeFollowUps: boolean;
  followUps?: FollowUpRecommendation[];
  readingLevel: 'basic' | 'intermediate' | 'advanced';
  language: LanguageCode;
  includeContactInfo: boolean;
  providerName?: string;
  providerContact?: string;
}

export interface GeneratedLetter {
  id: string;
  generatedAt: string;
  patientName: string;
  subject: string;
  content: string;
  language: LanguageCode;
}

/**
 * Generate a complete patient letter
 */
export function generateLetter(
  reportData: {
    id: string;
    procedure: string;
    clinicalHistory?: string;
    findings?: string;
    impression?: string;
    reportDate: string;
  },
  options: LetterOptions
): GeneratedLetter {
  // Generate summary at appropriate reading level
  const summaryOptions: SummaryOptions = {
    readingLevel: options.readingLevel,
    language: options.language,
    includeFindings: true,
    includeImpression: true,
  };

  const summary = generateSummary(reportData, summaryOptions);

  // Translate if not English
  let finalSummary: typeof summary = summary;
  if (options.language !== 'en') {
    const translated = translateSummary(summary, options.language);
    // Map translated summary back to summary format
    finalSummary = {
      ...summary,
      sections: translated.sections.map(s => ({
        title: s.translatedTitle,
        content: s.translatedContent,
      })),
    };
  }

  // Build letter content
  const letterLines: string[] = [];

  // Header
  letterLines.push(`Dear ${options.patientName},`);
  letterLines.push('');
  letterLines.push(`Date: ${new Date(reportData.reportDate).toLocaleDateString(options.language)}`);
  letterLines.push('');
  letterLines.push(`Re: Your ${reportData.procedure}`);
  letterLines.push('');

  // Summary sections
  for (const section of finalSummary.sections) {
    letterLines.push(`${section.title}:`);
    letterLines.push(section.content);
    letterLines.push('');
  }

  // Follow-up recommendations
  if (options.includeFollowUps && options.followUps && options.followUps.length > 0) {
    const followUpTitle = options.language === 'es' ? 'Próximos pasos' 
      : options.language === 'de' ? 'Nächste Schritte'
      : options.language === 'fr' ? 'Prochaines étapes'
      : options.language === 'zh' ? '下一步'
      : 'Next Steps';

    letterLines.push(`${followUpTitle}:`);
    for (const followUp of options.followUps) {
      const urgencyLabel = getUrgencyLabel(followUp.urgency, options.language);
      letterLines.push(`- [${urgencyLabel}] ${followUp.recommendation} (${followUp.timeframe})`);
    }
    letterLines.push('');
  }

  // Contact information
  if (options.includeContactInfo) {
    const contactTitle = options.language === 'es' ? 'Contacto'
      : options.language === 'de' ? 'Kontakt'
      : options.language === 'fr' ? 'Contact'
      : options.language === 'zh' ? '联系方式'
      : 'Contact';

    letterLines.push(`${contactTitle}:`);
    if (options.providerName) {
      letterLines.push(`  Provider: ${options.providerName}`);
    }
    if (options.providerContact) {
      letterLines.push(`  ${options.providerContact}`);
    }
    letterLines.push('');
  }

  // Closing
  const closing = options.language === 'es' ? 'Atentamente'
    : options.language === 'de' ? 'Mit freundlichen Grüßen'
    : options.language === 'fr' ? 'Cordialement'
    : options.language === 'zh' ? '此致敬礼'
    : 'Sincerely';

  letterLines.push(closing);
  if (options.providerName) {
    letterLines.push(options.providerName);
  }

  return {
    id: `letter-${reportData.id}-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    patientName: options.patientName,
    subject: `Radiology Report: ${reportData.procedure}`,
    content: letterLines.join('\n'),
    language: options.language,
  };
}

/**
 * Get urgency label in target language
 */
function getUrgencyLabel(urgency: string, language: LanguageCode): string {
  const labels: Record<LanguageCode, Record<string, string>> = {
    en: { immediate: 'Immediate', urgent: 'Urgent', routine: 'Routine', optional: 'Optional' },
    es: { immediate: 'Inmediato', urgent: 'Urgente', routine: 'Rutina', optional: 'Opcional' },
    de: { immediate: 'Sofort', urgent: 'Dringend', routine: 'Routine', optional: 'Optional' },
    fr: { immediate: 'Immédiat', urgent: 'Urgent', routine: 'Routine', optional: 'Optionnel' },
    pt: { immediate: 'Imediato', urgent: 'Urgente', routine: 'Rotina', optional: 'Opcional' },
    zh: { immediate: '立即', urgent: '紧急', routine: '常规', optional: '可选' },
    ja: { immediate: '直ち', urgent: '緊急', routine: '通常', optional: '任意' },
    ko: { immediate: '즉시', urgent: '긴급', routine: '통상', optional: '선택' },
    ar: { immediate: 'فوري', urgent: 'عاجل', routine: 'روتيني', optional: 'اختياري' },
    hi: { immediate: 'तुरंत', urgent: 'अत्यावश्यक', routine: 'दैनिक', optional: 'वैकल्पिक' },
    ru: { immediate: 'Немедленно', urgent: 'Срочно', routine: 'Планово', optional: 'По выбору' },
  };
  return labels[language]?.[urgency] || labels.en[urgency];
}

/**
 * Generate plain text version
 */
export function toPlainText(letter: GeneratedLetter): string {
  return letter.content;
}

/**
 * Generate HTML version for email/web
 */
export function toHTML(letter: GeneratedLetter): string {
  const lines = letter.content.split('\n');
  let html = '<html><body>';
  html += '<pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">';
  
  for (const line of lines) {
    if (line.startsWith('- [')) {
      html += `<strong>${line}</strong>\n`;
    } else if (line.endsWith(':')) {
      html += `<h3>${line}</h3>`;
    } else {
      html += `${line}\n`;
    }
  }
  
  html += '</pre></body></html>';
  return html;
}

// Test function
export function test(): string {
  const testReport = {
    id: 'test-001',
    procedure: 'Chest CT Scan',
    clinicalHistory: 'Cough and fever',
    findings: 'No pneumonia detected',
    impression: 'Normal examination',
    reportDate: new Date().toISOString(),
  };

  const letter = generateLetter(testReport, {
    patientName: 'John Doe',
    includeFollowUps: false,
    readingLevel: 'basic',
    language: 'en',
    includeContactInfo: true,
    providerName: 'Dr. Smith',
  });

  const preview = letter.content.substring(0, 100);
  return `Letter API - Generated letter for ${letter.patientName}. Preview: "${preview}..."`;
}