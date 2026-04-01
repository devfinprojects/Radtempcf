/**
 * NLP Findings Extraction Schema
 * AI_NLP_FINDINGS - Priority: P1
 * 
 * JSON Schema for extracting structured findings from free-text radiology reports
 * Implements NLP extraction patterns for findings sections
 */

export interface NLPFinding {
  location: string;
  organSystem: string;
  finding: string;
  attributes: {
    size?: string;
    laterality?: 'left' | 'right' | 'bilateral' | 'midline';
    number?: number | string;
    characterization?: string[];
    density?: string;
    enhancement?: string;
  };
  assessment: 'normal' | 'abnormal' | 'incidental' | 'critical';
  confidence: number;
}

export interface NLPFindingsExtraction {
  reportId: string;
  examination: string;
  modality: string;
  bodyRegion: string;
  findings: NLPFinding[];
  technique: string;
  comparison: string;
  limitations: string[];
  extractedAt: string;
}

export const findingsExtractionSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://raw.githubusercontent.com/devfinprojects/Radtempcf/main/api/nlp/findings.schema.json",
  "title": "NLP Findings Extraction",
  "description": "Schema for extracting structured findings from free-text radiology reports",
  "type": "object",
  "required": ["reportId", "findings"],
  "properties": {
    "reportId": {
      "type": "string",
      "description": "Unique identifier for the source report"
    },
    "examination": {
      "type": "string",
      "description": "Examination name"
    },
    "modality": {
      "type": "string",
      "enum": ["CT", "MRI", "US", "X-Ray", "Mammography", "PET", "Nuclear Medicine", "Fluoroscopy", "Intervention"],
      "description": "Imaging modality"
    },
    "bodyRegion": {
      "type": "string",
      "description": "Body region examined"
    },
    "findings": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["location", "organSystem", "finding", "assessment", "confidence"],
        "properties": {
          "location": {
            "type": "string",
            "description": "Specific anatomical location of finding"
          },
          "organSystem": {
            "type": "string",
            "enum": ["cardiovascular", "respiratory", "gastrointestinal", "genitourinary", "musculoskeletal", "neurologic", "integumentary", "endocrine", "lymphatic", "other"],
            "description": "Organ system category"
          },
          "finding": {
            "type": "string",
            "description": "Description of the finding"
          },
          "attributes": {
            "type": "object",
            "properties": {
              "size": {
                "type": "string",
                "description": "Size measurement (e.g., '2.3 cm', '5mm')"
              },
              "laterality": {
                "type": "string",
                "enum": ["left", "right", "bilateral", "midline"],
                "description": "Laterality of finding"
              },
              "number": {
                "type": ["number", "string"],
                "description": "Number of findings or lesions"
              },
              "characterization": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Characterization attributes (e.g., solid, cystic, calcified)"
              },
              "density": {
                "type": "string",
                "description": "Density characteristics (e.g., groundglass, solid)"
              },
              "enhancement": {
                "type": "string",
                "description": "Contrast enhancement pattern"
              }
            }
          },
          "assessment": {
            "type": "string",
            "enum": ["normal", "abnormal", "incidental", "critical"],
            "description": "Classification of finding"
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
    "technique": {
      "type": "string",
      "description": "Technical details of the examination"
    },
    "comparison": {
      "type": "string",
      "description": "Comparison to prior studies"
    },
    "limitations": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Study limitations or artifacts"
    },
    "extractedAt": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp of extraction"
    }
  }
};

/**
 * Extract findings from a free-text report using the defined schema
 * This is a placeholder for actual NLP processing
 */
export function extractFindingsFromText(
  reportText: string,
  reportId: string
): NLPFindingsExtraction {
  // In production, this would use NLP/ML models to extract structured data
  // For now, return schema with placeholder data
  return {
    reportId,
    examination: 'CT Chest',
    modality: 'CT',
    bodyRegion: 'Chest',
    findings: [],
    technique: '',
    comparison: '',
    limitations: [],
    extractedAt: new Date().toISOString()
  };
}

export default findingsExtractionSchema;