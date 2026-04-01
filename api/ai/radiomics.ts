/**
 * Radiomics Data Schema
 * AI_RADIOMICS_SCHEMA - Priority: P2
 * 
 * JSON Schema for radiomics data extraction and standardization
 * Supports quantitative imaging features for AI/ML analysis
 */

export interface RadiomicsFeature {
  name: string;
  category: 'shape' | 'intensity' | 'texture' | 'wavelet' | 'log';
  value: number;
  unit?: string;
  description: string;
}

export interface RadiomicsRegion {
  id: string;
  name: string;
  location: {
    laterality?: 'left' | 'right' | 'midline';
    region: string;
    coordinates?: {
      x: number;
      y: number;
      z: number;
    };
  };
  volume?: number;
  boundingBox?: {
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    depth: number;
  };
}

export interface RadiomicsStudy {
  id: string;
  patientId: string;
  examination: {
    modality: string;
    bodyRegion: string;
    seriesDate: string;
    seriesDescription: string;
  };
  segmentation: {
    method: string;
    tool?: string;
   SliceThickness?: number;
    label?: string;
  };
  features: RadiomicsFeature[];
  regions: RadiomicsRegion[];
  extractionParameters: {
    binCount?: number;
    interpolations?: string;
    resamplingMethod?: string;
  };
  metadata: {
    scanner: string;
    softwareVersion?: string;
    processingTime: string;
  };
}

export const radiomicsSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://raw.githubusercontent.com/devfinprojects/Radtempcf/main/api/ai/radiomics.schema.json",
  "title": "Radiomics Data Schema",
  "description": "Schema for storing radiomics features extracted from medical imaging",
  "type": "object",
  "required": ["id", "patientId", "examination", "features"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for this radiomics extraction"
    },
    "patientId": {
      "type": "string",
      "description": "Patient identifier"
    },
    "examination": {
      "type": "object",
      "required": ["modality", "bodyRegion", "seriesDate"],
      "properties": {
        "modality": {
          "type": "string",
          "enum": ["CT", "MRI", "PET", "US"],
          "description": "Imaging modality"
        },
        "bodyRegion": {
          "type": "string",
          "description": "Anatomical region"
        },
        "seriesDate": {
          "type": "string",
          "format": "date",
          "description": "Series acquisition date"
        },
        "seriesDescription": {
          "type": "string",
          "description": "Series description"
        }
      }
    },
    "segmentation": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "Segmentation method (manual, auto, semi-auto)"
        },
        "tool": {
          "type": "string",
          "description": "Tool used for segmentation"
        },
        "sliceThickness": {
          "type": "number",
          "description": "Slice thickness in mm"
        },
        "label": {
          "type": "string",
          "description": "Region label"
        }
      }
    },
    "features": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "category", "value", "description"],
        "properties": {
          "name": {
            "type": "string",
            "description": "Feature name (e.g., firstorder_Mean, glcm_Contrast)"
          },
          "category": {
            "type": "string",
            "enum": ["shape", "intensity", "texture", "wavelet", "log"],
            "description": "Feature category"
          },
          "value": {
            "type": "number",
            "description": "Feature value"
          },
          "unit": {
            "type": "string",
            "description": "Unit of measurement"
          },
          "description": {
            "type": "string",
            "description": "Feature description"
          }
        }
      }
    },
    "regions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "location": {
            "type": "object",
            "properties": {
              "laterality": { "type": "string", "enum": ["left", "right", "midline"] },
              "region": { "type": "string" },
              "coordinates": {
                "type": "object",
                "properties": {
                  "x": { "type": "number" },
                  "y": { "type": "number" },
                  "z": { "type": "number" }
                }
              }
            }
          },
          "volume": { "type": "number" }
        }
      }
    },
    "extractionParameters": {
      "type": "object",
      "properties": {
        "binCount": { "type": "number" },
        "interpolations": { "type": "string" },
        "resamplingMethod": { "type": "string" }
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "scanner": { "type": "string" },
        "softwareVersion": { "type": "string" },
        "processingTime": { "type": "string" }
      }
    }
  }
};

/**
 * Standard radiomics feature definitions
 */
export const standardFeatures = {
  shape: [
    { name: 'shape_Volume', description: 'Volume of the region in mm³' },
    { name: 'shape_SurfaceArea', description: 'Surface area in mm²' },
    { name: 'shape_Sphericity', description: 'Sphericity measure (0-1)' },
    { name: 'shape_Compactness', description: 'Compactness measure' },
    { name: 'shape_MajorAxis', description: 'Major axis length in mm' },
    { name: 'shape_MinorAxis', description: 'Minor axis length in mm' }
  ],
  intensity: [
    { name: 'firstorder_Mean', description: 'Mean intensity value' },
    { name: 'firstorder_Median', description: 'Median intensity value' },
    { name: 'firstorder_Std', description: 'Standard deviation' },
    { name: 'firstorder_Skewness', description: 'Skewness of intensity distribution' },
    { name: 'firstorder_Kurtosis', description: 'Kurtosis of intensity distribution' },
    { name: 'firstorder_Energy', description: 'Total energy' },
    { name: 'firstorder_Entropy', description: 'Intensity entropy' }
  ],
  texture: [
    { name: 'glcm_Contrast', description: 'GLCM contrast' },
    { name: 'glcm_Dissimilarity', description: 'GLCM dissimilarity' },
    { name: 'glcm_Homogeneity', description: 'GLCM homogeneity' },
    { name: 'glcm_Energy', description: 'GLCM energy (ASM)' },
    { name: 'glcm_Correlation', description: 'GLCM correlation' },
    { name: 'glrlm_RunEntropy', description: 'GLRLM run entropy' },
    { name: 'glrlm_RunPercentage', description: 'GLRLM run percentage' },
    { name: 'gldm_DependenceEntropy', description: 'GLDM dependence entropy' }
  ]
};

export default radiomicsSchema;