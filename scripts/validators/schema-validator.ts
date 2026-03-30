import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize Ajv with formats
const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);

// Load schemas
const templateSchema = JSON.parse(readFileSync(join(__dirname, '../../docs/schemas/template.schema.json'), 'utf-8'));
const metadataSchema = JSON.parse(readFileSync(join(__dirname, '../../docs/schemas/metadata.schema.json'), 'utf-8'));
const findingsSchema = JSON.parse(readFileSync(join(__dirname, '../../docs/schemas/findings.schema.json'), 'utf-8'));
const radsSchema = JSON.parse(readFileSync(join(__dirname, '../../docs/schemas/rads.schema.json'), 'utf-8'));
const aiSchema = JSON.parse(readFileSync(join(__dirname, '../../docs/schemas/ai.schema.json'), 'utf-8'));

// Add schemas to Ajv instance
ajv.addSchema(templateSchema, 'template');
ajv.addSchema(metadataSchema, 'metadata');
ajv.addSchema(findingsSchema, 'findings');
ajv.addSchema(radsSchema, 'rads');
ajv.addSchema(aiSchema, 'ai');

// Export validator functions
export function validateTemplate(data: unknown): ValidateFunction {
  return ajv.getSchema('template')!;
}

export function validateMetadata(data: unknown): ValidateFunction {
  return ajv.getSchema('metadata')!;
}

export function validateFindings(data: unknown): ValidateFunction {
  return ajv.getSchema('findings')!;
}

export function validateRads(data: unknown): ValidateFunction {
  return ajv.getSchema('rads')!;
}

export function validateAi(data: unknown): ValidateFunction {
  return ajv.getSchema('ai')!;
}

// CLI validation
if (process.argv[1]?.includes('schema-validator')) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: node schema-validator.ts <template-file>');
    process.exit(1);
  }

  try {
    const templateData = JSON.parse(readFileSync(filePath, 'utf-8'));
    const validate = validateTemplate(templateData);
    const valid = validate(templateData);
    
    if (!valid) {
      console.error('Validation failed:');
      console.error(JSON.stringify(validate.errors, null, 2));
      process.exit(1);
    }
    
    console.log('Template is valid!');
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
