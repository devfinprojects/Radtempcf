/**
 * AI Module Index
 * Export all AI integration components
 */

// Prompts
export { chatGptPrompts, generateChatGptPrompt } from '../prompts/chatgpt';
export { claudePrompts, generateClaudePrompt } from '../prompts/claude';
export { geminiPrompts, generateGeminiPrompt } from '../prompts/gemini';

// NLP
export { findingsExtractionSchema, extractFindingsFromText } from '../nlp/findings';
export { impressionExtractionSchema, extractImpressionFromText, impressionPatterns } from '../nlp/impression';
export { recommendationsExtractionSchema, extractRecommendationsFromText, recommendationPatterns } from '../nlp/recommendations';

// AI Findings
export { generateFindings, generateBatchFindings, type FindingsInput, type FindingsOutput, type AIModel } from './findings';

// AI Validation
export { validateFindings, validateBatchFindings, generateValidationReport, validationRules } from './validation';

// Radiomics
export { radiomicsSchema, standardFeatures, type RadiomicsStudy, type RadiomicsFeature } from './radiomics';

// Voice AI
export { VoiceAIService, VoiceAIWithLLM, radiologyVoiceCommands, defaultVoiceConfig, type VoiceCommand, type VoiceTranscript, type VoiceReportDraft } from './voice';

// CDS Hooks
export { CDSHookServiceFactory, OrderSelectHookService, OrderViewHookService, PatientViewHookService, type CDSHookRequest, type CDSHookResponse, type CDSCard, type CDSRecommendation } from '../cds/hooks';