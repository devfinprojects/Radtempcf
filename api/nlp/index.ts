/**
 * NLP Schemas Index
 * Export all NLP extraction schemas for AI integration
 */

export { findingsExtractionSchema, extractFindingsFromText } from './findings';
export type { NLPFinding, NLPFindingsExtraction } from './findings';

export { impressionExtractionSchema, extractImpressionFromText, impressionPatterns } from './impression';
export type { ImpressionFinding, NLPImpressionExtraction } from './impression';

export { recommendationsExtractionSchema, extractRecommendationsFromText, recommendationPatterns } from './recommendations';
export type { Recommendation, NLPRecommendationsExtraction } from './recommendations';