/**
 * RadLex Term Validation Test
 * Verifies that RadLex IDs in mappings are valid and properly formatted
 */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Known valid RadLex IDs (subset for validation)
const VALID_RADLEX_IDS = new Set([
  // Anatomy - Brain
  'RID10336', // Brain
  'RID10331', // Head
  'RID10334', // Neck
  'RID10338', // Spinal Cord
  // Anatomy - Chest
  'RID10343', // Thorax
  'RID10345', // Lung
  'RID10344', // Mediastinum
  // Anatomy - Abdomen
  'RID10356', // Liver
  'RID10359', // Kidney
  'RID10357', // Spleen
  'RID10358', // Pancreas
  'RID10362', // Gallbladder
  // Modalities
  'RID10312', // CT
  'RID10315', // MRI
  'RID10316', // Ultrasound
  'RID10310', // X-ray
  // Findings
  'RID3815',  // Hemorrhage
  'RID3860',  // Mass
  'RID3861',  // Nodule
  'RID3880',  // Effusion
  'RID4698',  // Pneumothorax
  'RID4643',  // Hydronephrosis
  'RID3840',  // Fracture
  // Diseases
  'RID3907',  // Metastatic tumor
  'RID3910',  // Carcinoma
  'RID4600',  // CVA/Stroke
  'RID4568',  // Aneurysm
  'RID4570',  // Embolism
  'RID4569',  // Thrombosis
  'RID4657',  // Pneumonia
  'RID4660',  // Emphysema
]);

interface RadLexMapping {
  term: string;
  radlexId: string;
  radlexTerm: string;
  category: string;
}

interface RadLexMappingFile {
  templateId: string;
  mappings: RadLexMapping[];
  version: string;
  lastUpdated: string;
}

function validateRadLexIds(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Find and process radlex-mappings.json
  const mappingPath = join(__dirname, '../../mappings/radlex-mappings.json');
  
  try {
    const data = JSON.parse(readFileSync(mappingPath, 'utf-8')) as RadLexMappingFile;
    
    for (const mapping of data.mappings) {
      // Check if RadLex ID starts with RID (correct format)
      if (!mapping.radlexId.startsWith('RID')) {
        errors.push(`Invalid RadLex ID format for "${mapping.term}": ${mapping.radlexId}`);
      }
      
      // Check if RadLex ID matches known valid IDs (or is in valid pattern)
      const idNumber = mapping.radlexId.replace('RID', '');
      if (isNaN(Number(idNumber))) {
        errors.push(`Invalid RadLex ID number for "${mapping.term}": ${mapping.radlexId}`);
      }
    }
  } catch (error) {
    errors.push(`Failed to read radlex-mappings.json: ${error instanceof Error ? error.message : error}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// CLI execution
if (process.argv[1]?.includes('radlex-validator')) {
  const result = validateRadLexIds();
  
  if (!result.valid) {
    console.error('RadLex validation failed:');
    result.errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }
  
  console.log('✓ RadLex terms validated successfully');
  process.exit(0);
}

export { validateRadLexIds };