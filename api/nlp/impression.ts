/**
 * NLP Impression Extraction Schema
 * AI_NLP_IMPRESSIONS - Priority: P1
 * 
 * JSON Schema for extracting structured data from impression sections of radiology reports
 * Enables clinical decision support and data mining from impressions
 */

export interface ImpressionFinding {
  id: string;
  statement: string;
  clinicalSignificance: 'normal' | 'abnormal' | 'critical' | 'recommendation';
  category: 'diagnosis' | 'follow-up' | 'correlation' | 'limitation' | 'comparison';
  diagnoses: {
    primary?: string;
    differential?: string[];
    ruledOut?: string[];
  };
  urgency: 'routine' | 'urgent' | 'emergent';
  recommendations: string[];
  relatedFindings: string[];
  confidence: number;
}

export interface NLPImpressionExtraction {
  reportId: string;
  examination: string;
  impression: string;
  findings: ImpressionFinding[];
  keyPoints: string[];
  nextSteps: string[];
  extractedAt: string;
}

export const impressionExtractionSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://raw.githubusercontent.com/devfinprojects/Radtempcf/main/api/nlp/impression.schema.json",
  "title": "NLP Impression Extraction",
  "description": "Schema for extracting structured data from radiology report impressions",
  "type": "object",
  "required": ["reportId", "impression"],
  "properties": {
    "reportId": {
      "type": "string",
      "description": "Unique identifier for the source report"
    },
    "examination": {
      "type": "string",
      "description": "Examination name"
    },
    "impression": {
      "type": "string",
      "description": "Raw impression text"
    },
    "findings": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["statement", "clinicalSignificance", "urgency", "confidence"],
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier for this impression element"
          },
          "statement": {
            "type": "string",
            "description": "The impression statement"
          },
          "clinicalSignificance": {
            "type": "string",
            "enum": ["normal", "abnormal", "critical", "recommendation"],
            "description": "Classification of clinical significance"
          },
          "category": {
            "type": "string",
            "enum": ["diagnosis", "follow-up", "correlation", "limitation", "comparison"],
            "description": "Category of impression content"
          },
          "diagnoses": {
            "type": "object",
            "properties": {
              "primary": {
                "type": "string",
                "description": "Primary diagnosis or impression"
              },
              "differential": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Differential diagnoses"
              },
              "ruledOut": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Conditions ruled out"
              }
            }
          },
          "urgency": {
            "type": "string",
            "enum": ["routine", "urgent", "emergent"],
            "description": "Urgency level of finding"
          },
          "recommendations": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Recommendations from impression"
          },
          "relatedFindings": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Findings from body related to this impression"
          },
          "confidence": {
            "type": "number",
            "minimum": 0,
            "maximum": 1,
            "description": "Extraction confidence score"
          }
        }
      }
    },
    "keyPoints": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Key clinical points extracted from impression"
    },
    "nextSteps": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Recommended next steps for clinical management"
    },
    "extractedAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp of extraction"
    }
  }
};

/**
 * NLP patterns for impression extraction
 */
export const impressionPatterns = {
  urgencyIndicators: {
    emergent: ['immediate', 'emergent', 'stat', 'critical', 'life-threatening', 'urgent communication'],
    urgent: ['urgent', 'as soon as possible', 'prompt', 'expedited', 'sooner'],
    routine: ['routine', 'as indicated', 'scheduled', 'routine follow-up']
  },
  diagnosisPatterns: [
    { pattern: 'consistent with', type: 'primary' },
    { pattern: 'suggestive of', type: 'differential' },
    { pattern: 'cannot rule out', type: 'differential' },
    { pattern: 'ruled out', type: 'ruledOut' },
    { pattern: 'most likely', type: 'primary' },
    { pattern: 'likely', type: 'differential' }
  ],
  recommendationPatterns: [
    'follow-up',
    'recommend',
    'correlate',
    'consult',
    'consider',
    'additional evaluation'
  ]
};

/**
 * Extract structured impression data from free-text
 */
export function extractImpressionFromText(
  impressionText: string,
  reportId: string
): NLPImpressionExtraction {
  // In production, this would use NLP models
  return {
    reportId,
    examination: 'CT Chest',
    impression: impressionText,
    findings: [],
    keyPoints: [],
    nextSteps: [],
    extractedAt: new Date().toISOString()
  };
}

export default impressionExtractionSchema;