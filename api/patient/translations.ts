/**
 * Patient Summary Translations API
 * Handles multi-language translations for patient summaries
 * Supports: Spanish, German, French, Portuguese, Chinese, Japanese, Korean, Arabic, Hindi, Russian, English
 */

export type LanguageCode = 'es' | 'de' | 'fr' | 'pt' | 'zh' | 'ja' | 'ko' | 'ar' | 'hi' | 'ru' | 'en';

export interface TranslationOptions {
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  includeOriginalText: boolean;
}

export interface TranslatedSummary {
  id: string;
  originalId: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  translatedAt: string;
  sections: {
    originalTitle: string;
    translatedTitle: string;
    originalContent: string;
    translatedContent: string;
  }[];
}

// Translation dictionaries for medical terms
const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {},
  es: {
    'Procedure': 'Procedimiento',
    'Reason for Test': 'Razón del examen',
    'What We Found': 'Lo que encontramos',
    'What It Means': 'Lo que significa',
    'normal': 'normal',
    'abnormal': 'anormal',
    'findings': 'hallazgos',
    'impression': 'impresión',
    'heart attack': 'ataque al corazón',
    'lung infection': 'infección pulmonar',
    'broken bone': 'hueso roto',
    'cancer': 'cáncer',
    'tumor': 'tumor',
    'bleeding': 'sangrado',
    'swelling': 'hinchazón',
  },
  de: {
    'Procedure': 'Verfahren',
    'Reason for Test': 'Grund für die Untersuchung',
    'What We Found': 'Was wir gefunden haben',
    'What It Means': 'Was es bedeutet',
    'normal': 'normal',
    'abnormal': 'abnormal',
    'findings': 'Befunde',
    'impression': 'Eindruck',
    'heart attack': 'Herzinfarkt',
    'lung infection': 'Lungeninfektion',
    'broken bone': 'Knochenbruch',
    'cancer': 'Krebs',
    'tumor': 'Tumor',
    'bleeding': 'Blutung',
    'swelling': 'Schwellung',
  },
  fr: {
    'Procedure': 'Procédure',
    'Reason for Test': 'Raison de l\'examen',
    'What We Found': 'Ce que nous avons trouvé',
    'What It Means': 'Ce que cela signifie',
    'normal': 'normal',
    'abnormal': 'anormal',
    'findings': 'résultats',
    'impression': 'impression',
    'heart attack': 'crise cardiaque',
    'lung infection': 'infection pulmonaire',
    'broken bone': 'os cassé',
    'cancer': 'cancer',
    'tumor': 'tumeur',
    'bleeding': 'saignement',
    'swelling': 'gonflement',
  },
  pt: {
    'Procedure': 'Procedimento',
    'Reason for Test': 'Motivo do exame',
    'What We Found': 'O que encontramos',
    'What It Means': 'O que significa',
    'normal': 'normal',
    'abnormal': 'anormal',
    'findings': 'achados',
    'impression': 'impressão',
    'heart attack': 'ataque cardíaco',
    'lung infection': 'infecção pulmonar',
    'broken bone': 'osso quebrado',
    'cancer': 'câncer',
    'tumor': 'tumor',
    'bleeding': 'sangramento',
    'swelling': 'inchaço',
  },
  zh: {
    'Procedure': '检查程序',
    'Reason for Test': '检查原因',
    'What We Found': '我们的发现',
    'What It Means': '这意味着什么',
    'normal': '正常',
    'abnormal': '异常',
    'findings': '发现',
    'impression': '诊断意见',
    'heart attack': '心脏病发作',
    'lung infection': '肺部感染',
    'broken bone': '骨折',
    'cancer': '癌症',
    'tumor': '肿瘤',
    'bleeding': '出血',
    'swelling': '肿胀',
  },
  ja: {
    'Procedure': '検査手順',
    'Reason for Test': '検査の理由',
    'What We Found': '発見された内容',
    'What It Means': '意味すること',
    'normal': '正常',
    'abnormal': '異常',
    'findings': '所見',
    'impression': '診断',
    'heart attack': '心臓発作',
    'lung infection': '肺感染症',
    'broken bone': '骨折',
    'cancer': 'がん',
    'tumor': '腫瘍',
    'bleeding': '出血',
    'swelling': '腫れ',
  },
  ko: {
    'Procedure': '검사 절차',
    'Reason for Test': '검사 이유',
    'What We Found': '발견된 내용',
    'What It Means': '의미하는 바',
    'normal': '정상',
    'abnormal': '이상',
    'findings': '소견',
    'impression': '판정',
    'heart attack': '심장 발작',
    'lung infection': '폐 감염',
    'broken bone': '골절',
    'cancer': '암',
    'tumor': '종양',
    'bleeding': '출혈',
    'swelling': '부종',
  },
  ar: {
    'Procedure': 'الإجراء',
    'Reason for Test': 'سبب الفحص',
    'What We Found': 'ما وجدناه',
    'What It Means': 'ما يعنيه',
    'normal': 'طبيعي',
    'abnormal': 'غير طبيعي',
    'findings': 'النتائج',
    'impression': 'الانطباع',
    'heart attack': 'نوبة قلبية',
    'lung infection': 'عدوى رئوية',
    'broken bone': 'كسر في العظم',
    'cancer': 'سرطان',
    'tumor': 'ورم',
    'bleeding': 'نزيف',
    'swelling': 'تورم',
  },
  hi: {
    'Procedure': 'प्रक्रिया',
    'Reason for Test': 'परीक्षण का कारण',
    'What We Found': 'हमें क्या मिला',
    'What It Means': 'इसका क्या मतलब है',
    'normal': 'सामान्य',
    'abnormal': 'असामान्य',
    'findings': 'निष्कर्ष',
    'impression': 'प्रभाव',
    'heart attack': 'दिल का दौरा',
    'lung infection': 'फेसфельा संक्रमण',
    'broken bone': 'हड्डी टूटी',
    'cancer': 'कैंसर',
    'tumor': 'ट्यूमर',
    'bleeding': 'रक्तस्राव',
    'swelling': 'सूजन',
  },
  ru: {
    'Procedure': 'Процедура',
    'Reason for Test': 'Причина обследования',
    'What We Found': 'Что мы обнаружили',
    'What It Means': 'Что это означает',
    'normal': 'нормально',
    'abnormal': 'ненормально',
    'findings': 'результаты',
    'impression': 'заключение',
    'heart attack': 'сердечный приступ',
    'lung infection': 'лёгочная инфекция',
    'broken bone': 'перелом кости',
    'cancer': 'рак',
    'tumor': 'опухоль',
    'bleeding': 'кровотечение',
    'swelling': 'отёк',
  },
};

/**
 * Get language display name
 */
export function getLanguageName(code: LanguageCode): string {
  const names: Record<LanguageCode, string> = {
    en: 'English',
    es: 'Español',
    de: 'Deutsch',
    fr: 'Français',
    pt: 'Português',
    zh: '中文',
    ja: '日本語',
    ko: '한국어',
    ar: 'العربية',
    hi: 'हिन्दी',
    ru: 'Русский',
  };
  return names[code];
}

/**
 * Check if language supports RTL (Right-to-Left)
 */
export function isRTL(code: LanguageCode): boolean {
  return code === 'ar';
}

/**
 * Translate a summary to target language
 */
export function translateSummary(
  summary: {
    id: string;
    sections: { title: string; content: string }[];
  },
  targetLanguage: LanguageCode,
  options?: Partial<TranslationOptions>
): TranslatedSummary {
  const translatedSections = summary.sections.map(section => {
    const translations = TRANSLATIONS[targetLanguage] || {};
    
    let translatedTitle = translations[section.title] || section.title;
    let translatedContent = section.content;

    // Translate known terms in content
    for (const [english, translated] of Object.entries(translations)) {
      const regex = new RegExp(english, 'gi');
      translatedContent = translatedContent.replace(regex, translated);
    }

    return {
      originalTitle: section.title,
      translatedTitle,
      originalContent: section.content,
      translatedContent,
    };
  });

  return {
    id: `translated-${summary.id}-${targetLanguage}`,
    originalId: summary.id,
    sourceLanguage: 'en',
    targetLanguage,
    translatedAt: new Date().toISOString(),
    sections: translatedSections,
  };
}

/**
 * Get all available languages
 */
export function getAvailableLanguages(): { code: LanguageCode; name: string; rtl: boolean }[] {
  const languages: LanguageCode[] = ['en', 'es', 'de', 'fr', 'pt', 'zh', 'ja', 'ko', 'ar', 'hi', 'ru'];
  return languages.map(code => ({
    code,
    name: getLanguageName(code),
    rtl: isRTL(code),
  }));
}

// Test function
// export function test(): string {
//   const testSummary = {
//     id: 'test-001',
//     sections: [
//       { title: 'Procedure', content: 'CT Scan of Chest' },
//       { title: 'What We Found', content: 'Normal chest x-ray' },
//       { title: 'What It Means', content: 'No abnormal findings' },
//     ],
//   };
//
//   const languages = getAvailableLanguages();
//   return `Translation API - Supports ${languages.length} languages: ${languages.map(l => l.name).join(', ')}`;
// }