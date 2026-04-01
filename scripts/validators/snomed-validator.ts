/**
 * SNOMED CT Code Validation Test
 * Verifies that SNOMED CT codes in mappings are valid and properly formatted
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Valid SNOMED CT numeric codes (7-18 digits, first digit non-zero)
const SNOMED_CODE_PATTERN = /^[1-9]\d{6,17}$/;

interface SNOMEDMapping {
  term: string;
  snomedCtId: string;
  snomedTerm: string;
  semanticTag: string;
}

interface SNOMEDMappingFile {
  templateId: string;
  mappings: SNOMEDMapping[];
  version: string;
  lastUpdated: string;
}

function validateSNOMEDCodes(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Find and process snomed-mappings.json
  const mappingPath = join(__dirname, '../../mappings/snomed-mappings.json');
  
  try {
    const data = JSON.parse(readFileSync(mappingPath, 'utf-8')) as SNOMEDMappingFile;
    
    for (const mapping of data.mappings) {
      // Check if SNOMED ID is a valid number string
      if (!SNOMED_CODE_PATTERN.test(mapping.snomedCtId)) {
        errors.push(`Invalid SNOMED CT ID for "${mapping.term}": ${mapping.snomedCtId} (must be 7-18 digits, starting with non-zero)`);
        continue;
      }
      
      // Validate semantic tag is not empty
      if (!mapping.semanticTag || mapping.semanticTag.trim() === '') {
        errors.push(`Missing semantic tag for "${mapping.term}": ${mapping.snomedCtId}`);
      }
      
      // Check semantic tag is a known type
      const validTags = new Set([
        'anatomical structure',
        'procedure',
        'finding',
        'morphologic abnormality',
        'disorder',
        'specimen',
        'substance',
        'device',
        'event'
      ]);
      
      if (!validTags.has(mapping.semanticTag)) {
        errors.push(`Unknown semantic tag "${mapping.semanticTag}" for "${mapping.term}": ${mapping.snomedCtId}`);
      }
    }
  } catch (error) {
    errors.push(`Failed to read snomed-mappings.json: ${error instanceof Error ? error.message : error}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// CLI execution
if (process.argv[1]?.includes('snomed-validator')) {
  const result = validateSNOMEDCodes();
  
  if (!result.valid) {
    console.error('SNOMED CT validation failed:');
    result.errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }
  
  console.log('✓ SNOMED CT codes validated successfully');
  process.exit(0);
}

export { validateSNOMEDCodes };