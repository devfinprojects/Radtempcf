/**
 * Patient API Index
 * Exports all patient-centric features
 */

// Re-export with explicit naming to avoid test function conflicts
export { 
  generateSummary, 
  getRecommendedReadingLevel, 
  validateReadability,
  type SummaryOptions,
  type PatientSummary
} from './summary';

export { 
  translateSummary, 
  getLanguageName, 
  isRTL, 
  getAvailableLanguages,
  type LanguageCode,
  type TranslationOptions,
  type TranslatedSummary
} from './translations';

export { 
  trackFollowUp, 
  completeFollowUp, 
  getUrgencyColor, 
  getUrgencyPriority, 
  sortByUrgency, 
  filterFollowUps, 
  calculateComplianceRate, 
  getOverdueFollowUps,
  type FollowUpUrgency,
  type FollowUpRecommendation,
  type FollowUpTrackingOptions
} from './followup';

export { 
  generateLetter, 
  toPlainText, 
  toHTML,
  type LetterOptions,
  type GeneratedLetter
} from './letter';