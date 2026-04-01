/**
 * Patient Summary Generation API
 * Converts radiology reports to patient-friendly language summaries
 * Supports multiple reading levels: basic, intermediate, advanced
 */

export interface SummaryOptions {
  readingLevel: 'basic' | 'intermediate' | 'advanced';
  language: string;
  includeFindings: boolean;
  includeImpression: boolean;
}

export interface PatientSummary {
  id: string;
  reportId: string;
  generatedAt: string;
  readingLevel: string;
  language: string;
  sections: {
    title: string;
    content: string;
  }[];
}

// Medical term simplifications for basic reading level
const BASIC_SIMPLIFICATIONS: Record<string, string> = {
  'myocardial infarction': 'heart attack',
  'pneumonia': 'lung infection',
  'fracture': 'broken bone',
  'malignancy': 'cancer',
  'neoplasm': 'tumor',
  'carcinoma': 'cancer',
  'hemorrhage': 'bleeding',
  'edema': 'swelling',
  'inflammation': 'swelling',
  'biopsy': 'tissue sample',
  'ct scan': 'CT scan',
  'mri': 'MRI scan',
  'ultrasound': 'ultrasound',
  'x-ray': 'x-ray',
  'radiograph': 'x-ray',
  'anterior': 'front',
  'posterior': 'back',
  'superior': 'upper',
  'inferior': 'lower',
  'lateral': 'side',
  'medial': 'middle',
  'proximal': 'near',
  'distal': 'far',
  'acute': 'sudden',
  'chronic': 'long-term',
  'benign': 'not cancer',
  'malignant': 'cancerous',
  'significant': 'important',
  'moderate': 'medium',
  'severe': 'serious',
  'mild': 'mild',
  'minimal': 'very small',
  'prominent': 'noticeable',
  'unremarkable': 'normal',
};

// Medical term simplifications for intermediate reading level
const INTERMEDIATE_SIMPLIFICATIONS: Record<string, string> = {
  'myocardial infarction': 'heart attack',
  'cerebrovascular accident': 'stroke',
  'pulmonary embolism': 'blood clot in lung',
  'pneumonia': 'lung infection',
  'fracture': 'broken bone',
  'malignancy': 'cancer',
  'neoplasm': 'tumor',
  'carcinoma': 'cancer',
  'hemorrhage': 'bleeding',
  'edema': 'swelling',
  'inflammation': 'swelling',
  'atherosclerosis': 'hardening of arteries',
  'stenosis': 'narrowing',
  'occlusion': 'blockage',
  'thrombosis': 'blood clot',
  'embolism': 'clot travel',
  'ischemia': 'reduced blood flow',
  'necrosis': 'tissue death',
  'fibrosis': 'scarring',
  'atrophy': 'shrinking',
  'hypertrophy': 'enlargement',
  'anomaly': 'abnormality',
  'lesion': 'abnormal area',
  'mass': 'growth',
  'nodule': 'small lump',
  'cyst': 'fluid-filled sac',
  'ulcer': 'open sore',
  'erosion': 'surface damage',
};

/**
 * Simplifies medical terminology based on reading level
 */
function simplifyText(text: string, level: 'basic' | 'intermediate' | 'advanced'): string {
  let simplified = text;
  const simplifications = level === 'basic' ? BASIC_SIMPLIFICATIONS 
    : level === 'intermediate' ? INTERMEDIATE_SIMPLIFICATIONS 
    : {};

  for (const [medical, simple] of Object.entries(simplifications)) {
    const regex = new RegExp(medical, 'gi');
    simplified = simplified.replace(regex, simple);
  }

  return simplified;
}

/**
 * Calculates Flesch-Kincaid reading level score
 */
function calculateReadingLevel(text: string): number {
  const words = text.split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).length;
  const syllables = text.split(/[aeiouy]+/).length - 1;

  if (words === 0 || sentences === 0) return 0;

  const avgWordsPerSentence = words / sentences;
  const avgSyllablesPerWord = syllables / words;

  return 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
}

/**
 * Converts a clinical finding to plain language
 */
function convertToPlainLanguage(clinicalText: string, level: 'basic' | 'intermediate' | 'advanced'): string {
  let plainText = clinicalText;

  // Remove parenthetical abbreviations
  plainText = plainText.replace(/\s*\([^)]*\)/g, '');

  // Simplify based on reading level
  plainText = simplifyText(plainText, level);

  // Adjust sentence complexity based on level
  if (level === 'basic') {
    // Shorten sentences, use simpler words
    plainText = plainText.replace(/, /g, '. ');
  }

  return plainText.trim();
}

/**
 * Generate patient summary from radiology report data
 */
export function generateSummary(
  reportData: {
    findings?: string;
    impression?: string;
    procedure?: string;
    clinicalHistory?: string;
    id: string;
  },
  options: SummaryOptions
): PatientSummary {
  const { readingLevel, language, includeFindings, includeImpression } = options;
  const sections: PatientSummary['sections'] = [];

  // Add procedure info
  if (reportData.procedure) {
    const procedureText = readingLevel === 'basic' 
      ? `You had a ${reportData.procedure.toLowerCase()}.`
      : readingLevel === 'intermediate'
      ? `The procedure performed was: ${reportData.procedure}.`
      : reportData.procedure;
    sections.push({
      title: 'Procedure',
      content: procedureText,
    });
  }

  // Add clinical history
  if (reportData.clinicalHistory) {
    const historyText = convertToPlainLanguage(reportData.clinicalHistory, readingLevel);
    sections.push({
      title: 'Reason for Test',
      content: historyText,
    });
  }

  // Add findings
  if (includeFindings && reportData.findings) {
    const findingsText = convertToPlainLanguage(reportData.findings, readingLevel);
    sections.push({
      title: 'What We Found',
      content: findingsText,
    });
  }

  // Add impression
  if (includeImpression && reportData.impression) {
    const impressionText = convertToPlainLanguage(reportData.impression, readingLevel);
    sections.push({
      title: 'What It Means',
      content: impressionText,
    });
  }

  return {
    id: `summary-${reportData.id}`,
    reportId: reportData.id,
    generatedAt: new Date().toISOString(),
    readingLevel,
    language,
    sections,
  };
}

/**
 * Get recommended reading level based on patient profile
 */
export function getRecommendedReadingLevel(patientAge?: number, educationLevel?: string): 'basic' | 'intermediate' | 'advanced' {
  if (educationLevel) {
    const edu = educationLevel.toLowerCase();
    if (edu.includes('high school') || edu.includes('elementary')) {
      return 'basic';
    }
    if (edu.includes('college') || edu.includes('university')) {
      return 'advanced';
    }
  }

  if (patientAge !== undefined) {
    if (patientAge < 18 || patientAge > 65) {
      return 'basic';
    }
  }

  return 'intermediate';
}

/**
 * Validate summary readability
 */
export function validateReadability(summary: PatientSummary): {
  passed: boolean;
  score: number;
  recommendations: string[];
} {
  const fullText = summary.sections.map(s => s.content).join(' ');
  const score = calculateReadingLevel(fullText);
  const recommendations: string[] = [];

  if (summary.readingLevel === 'basic' && score > 80) {
    recommendations.push('Consider simplifying further for basic reading level');
  } else if (summary.readingLevel === 'intermediate' && (score < 50 || score > 80)) {
    recommendations.push('Adjust complexity for intermediate reading level');
  } else if (summary.readingLevel === 'advanced' && score < 50) {
    recommendations.push('Consider adding more detail for advanced reading level');
  }

  return {
    passed: recommendations.length === 0,
    score,
    recommendations,
  };
}

// Test function
// export function test(): string {
//   const testReport = {
//     id: 'test-001',
//     procedure: 'CT Scan of Chest',
//     clinicalHistory: 'History of pneumonia',
//     findings: 'There is a prominent infiltrate in the left lower lobe consistent with pneumonia.',
//     impression: 'Left lower lobe pneumonia.',
//   };
//
//   const basicSummary = generateSummary(testReport, {
//     readingLevel: 'basic',
//     language: 'en',
//     includeFindings: true,
//     includeImpression: true,
//   });
//
//   const validation = validateReadability(basicSummary);
//
//   return `Patient Summary API - Generated ${basicSummary.sections.length} sections at ${basicSummary.readingLevel} level. Readability score: ${validation.score.toFixed(1)}`;
// }
