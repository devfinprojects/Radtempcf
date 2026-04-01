/**
 * NLP Recommendations Extraction Schema
 * AI_NLP_RECOMMENDATIONS - Priority: P1
 * 
 * JSON Schema for extracting structured follow-up and management recommendations
 * from radiology reports. Enables tracking and analytics of recommendation compliance.
 */

export interface Recommendation {
  id: string;
  statement: string;
  type: 'imaging' | 'clinical' | 'laboratory' | 'referral' | 'procedure';
  modality?: string;
  timeframe: {
    value: number;
    unit: 'days' | 'weeks' | 'months' | 'years';
  };
  urgency: 'routine' | 'urgent' | 'emergent';
  rationale: string;
  linkedFinding?: string;
  status: 'pending' | 'ordered' | 'completed' | 'not_applicable';
  guideline?: string;
  confidence: number;
}

export interface NLPRecommendationsExtraction {
  reportId: string;
  examination: string;
  recommendations: Recommendation[];
  allRecommendationsComplete: boolean;
  criticalRecommendations: string[];
  followUpRequired: boolean;
  extractedAt: string;
}

export const recommendationsExtractionSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://raw.githubusercontent.com/devfinprojects/Radtempcf/main/api/nlp/recommendations.schema.json",
  "title": "NLP Recommendations Extraction",
  "description": "Schema for extracting structured recommendations from radiology reports",
  "type": "object",
  "required": ["reportId", "recommendations"],
  "properties": {
    "reportId": {
      "type": "string",
      "description": "Unique identifier for the source report"
    },
    "examination": {
      "type": "string",
      "description": "Examination name"
    },
    "recommendations": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["statement", "type", "urgency", "confidence"],
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier for this recommendation"
          },
          "statement": {
            "type": "string",
            "description": "The recommendation text"
          },
          "type": {
            "type": "string",
            "enum": ["imaging", "clinical", "laboratory", "referral", "procedure"],
            "description": "Type of recommended action"
          },
          "modality": {
            "type": "string",
            "description": "If imaging, the modality recommended"
          },
          "timeframe": {
            "type": "object",
            "properties": {
              "value": {
                "type": "number",
                "description": "Numeric value for timeframe"
              },
              "unit": {
                "type": "string",
                "enum": ["days", "weeks", "months", "years"],
                "description": "Unit of timeframe"
              }
            }
          },
          "urgency": {
            "type": "string",
            "enum": ["routine", "urgent", "emergent"],
            "description": "Urgency level"
          },
          "rationale": {
            "type": "string",
            "description": "Clinical rationale for recommendation"
          },
          "linkedFinding": {
            "type": "string",
            "description": "Finding that prompted this recommendation"
          },
          "status": {
            "type": "string",
            "enum": ["pending", "ordered", "completed", "not_applicable"],
            "description": "Current status of recommendation",
            "default": "pending"
          },
          "guideline": {
            "type": "string",
            "description": "Clinical guideline reference (e.g., Lung-RADS, LI-RADS)"
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
    "allRecommendationsComplete": {
      "type": "boolean",
      "description": "Whether all recommendations in the report have been captured"
    },
    "criticalRecommendations": {
      "type": "array",
      "items": { "type": "string" },
      "description": "List of critical/urgent recommendations requiring immediate action"
    },
    "followUpRequired": {
      "type": "boolean",
      "description": "Whether any follow-up imaging or action is recommended"
    },
    "extractedAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp of extraction"
    }
  }
};

/**
 * Regex patterns for extracting recommendations from text
 */
export const recommendationPatterns = {
  imaging: /(CT|MRI|PET|ULTRASOUND|X-RAY|MAMMOGRAPHY|ANGIOGRAPHY)\s+(of|with|without)?\s+([\w\s]+)/gi,
  timeframe: /(\d+)\s+(day|week|month|year)s?/gi,
  urgency: {
    emergent: /immediate|emergent|stat|critical/i,
    urgent: /urgent|urgent|asap|soon/i,
    routine: /routine|recommended|follow-up/i
  },
  guideline: /(Lung-RADS|LI-RADS|BI-RADS|PI-RADS|ThyROID-RADS|RADS)\s+(\d+|[A-Z])/gi
};

/**
 * Extract structured recommendations from free-text
 */
export function extractRecommendationsFromText(
  reportText: string,
  reportId: string
): NLPRecommendationsExtraction {
  // In production, this would use NLP models
  const recommendations: Recommendation[] = [];
  const criticalRecommendations: string[] = [];
  
  // Extract timeframe patterns
  const timeframeMatches = reportText.match(/(\d+)\s+(day|week|month|year)s?/gi) || [];
  
  // Check for critical/urgent keywords
  const hasCritical = /immediate|emergent|critical|urgent communication/i.test(reportText);
  const hasUrgent = /urgent|asap/i.test(reportText);
  
  if (hasCritical) {
    criticalRecommendations.push('Critical finding requiring immediate communication');
  }
  
  return {
    reportId,
    examination: 'CT Chest',
    recommendations,
    allRecommendationsComplete: false,
    criticalRecommendations,
    followUpRequired: timeframeMatches.length > 0,
    extractedAt: new Date().toISOString()
  };
}

export default recommendationsExtractionSchema;