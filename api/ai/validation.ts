/**
 * AI Findings Validation
 * AI_FINDINGS_VALIDATE - Priority: P1
 * 
 * Validation logic for AI-generated findings to ensure quality and accuracy
 */

import { FindingsOutput } from './findings';

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  check: (findings: string) => boolean;
  severity: 'error' | 'warning' | 'info';
  message: string;
}

export interface ValidationResult {
  passed: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  info: ValidationInfo[];
  score: number;
}

export interface ValidationError {
  rule: string;
  message: string;
  severity: 'error';
}

export interface ValidationWarning {
  rule: string;
  message: string;
  severity: 'warning';
}

export interface ValidationInfo {
  rule: string;
  message: string;
  severity: 'info';
}

/**
 * Validation rules for AI-generated findings
 */
export const validationRules: ValidationRule[] = [
  {
    id: 'length-check',
    name: 'Findings Length',
    description: 'Findings should be at least 50 characters',
    check: (findings: string) => findings.length >= 50,
    severity: 'warning',
    message: 'Findings appear too short. Consider adding more detail.'
  },
  {
    id: 'anatomical-terms',
    name: 'Anatomical Terminology',
    description: 'Findings should include anatomical terms',
    check: (findings: string) => {
      const anatomicalTerms = [
        'lung', 'liver', 'kidney', 'brain', 'spine', 'chest', 'abdomen',
        'pelvis', 'heart', 'vessel', 'artery', 'vein', 'bone', 'joint',
        'lymph', 'node', 'bowel', 'stomach', 'pancreas', 'spleen'
      ];
      const lowerFindings = findings.toLowerCase();
      return anatomicalTerms.some(term => lowerFindings.includes(term));
    },
    severity: 'warning',
    message: 'No anatomical terms detected. Findings may be too generic.'
  },
  {
    id: 'measurements',
    name: 'Measurements',
    description: 'Findings should include measurements when describing abnormalities',
    check: (findings: string) => {
      // Check for common measurement patterns
      const measurementPatterns = /\d+(\.\d+)?\s*(cm|mm|cm²|cm3)/gi;
      const matches = findings.match(measurementPatterns);
      return matches !== null && matches.length > 0;
    },
    severity: 'info',
    message: 'No measurements found. Consider adding size information for lesions.'
  },
  {
    id: 'laterality',
    name: 'Laterality',
    description: 'Findings should specify laterality when applicable',
    check: (findings: string) => {
      const lateralityTerms = /left|right|bilateral|midline/gi;
      const lowerFindings = findings.toLowerCase();
      
      // If findings contain anatomical structures that typically have laterality
      const pairedStructures = /lung|liver|kidney|kidney|node|extremity|hemisphere/gi;
      if (pairedStructures.test(lowerFindings)) {
        return lateralityTerms.test(lowerFindings);
      }
      return true; // Not applicable
    },
    severity: 'warning',
    message: 'Paired anatomical structures should specify laterality (left/right/bilateral).'
  },
  {
    id: 'no-contradiction',
    name: 'Internal Consistency',
    description: 'Findings should not contradict each other',
    check: (findings: string) => {
      const lower = findings.toLowerCase();
      // Check for common contradictions
      const contradictions = [
        /no.*abnormal.*and.*abnormal/gi,
        /normal.*but.*abnormal/gi,
        /unremarkable.*however.*finding/gi
      ];
      return !contradictions.some(pattern => pattern.test(lower));
    },
    severity: 'error',
    message: 'Potential internal contradiction detected in findings.'
  },
  {
    id: 'complete-sentences',
    name: 'Complete Sentences',
    description: 'Findings should be in complete sentences',
    check: (findings: string) => {
      // Check that most lines are complete sentences (end with period)
      const sentences = findings.split(/[.!?]/).filter(s => s.trim().length > 0);
      const completeRatio = sentences.length > 0 ? 
        (sentences.length / findings.split('\n').length) : 0;
      return completeRatio >= 0.5;
    },
    severity: 'warning',
    message: 'Findings should be written in complete sentences for clarity.'
  },
  {
    id: 'clinical-relevance',
    name: 'Clinical Relevance',
    description: 'Findings should address the clinical question',
    check: (findings: string) => {
      // This is a placeholder - in production would compare to clinical indication
      return findings.length > 100; // Basic check
    },
    severity: 'info',
    message: 'Consider ensuring findings directly address the clinical indication.'
  },
  {
    id: 'no-ai-disclosure',
    name: 'AI Disclosure',
    description: 'Findings should not contain AI self-reference',
    check: (findings: string) => {
      const aiTerms = /as an AI|I am an AI|AI-generated|artificial intelligence|language model/gi;
      return !aiTerms.test(findings);
    },
    severity: 'error',
    message: 'Findings should not contain AI self-referential language.'
  }
];

/**
 * Validate AI-generated findings
 */
export function validateFindings(findings: FindingsOutput): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const info: ValidationInfo[] = [];
  
  // Validate the generated findings text
  for (const rule of validationRules) {
    const passed = rule.check(findings.findings);
    
    if (!passed) {
      const item = {
        rule: rule.id,
        message: rule.message,
        severity: rule.severity
      };
      
      if (rule.severity === 'error') {
        errors.push(item as ValidationError);
      } else if (rule.severity === 'warning') {
        warnings.push(item as ValidationWarning);
      } else {
        info.push(item as ValidationInfo);
      }
    }
  }
  
  // Calculate overall score (0-100)
  const totalRules = validationRules.length;
  const failedCount = errors.length + warnings.length + info.length;
  const passedCount = totalRules - failedCount;
  const score = Math.round((passedCount / totalRules) * 100);
  
  // Determine overall pass/fail
  const passed = errors.length === 0;
  
  return {
    passed,
    errors,
    warnings,
    info,
    score
  };
}

/**
 * Validate multiple findings at once
 */
export function validateBatchFindings(results: FindingsOutput[]): ValidationResult[] {
  return results.map(result => validateFindings(result));
}

/**
 * Generate a validation report
 */
export function generateValidationReport(result: ValidationResult): string {
  let report = '=== AI Findings Validation Report ===\n\n';
  
  report += `Overall Status: ${result.passed ? 'PASSED' : 'FAILED'}\n`;
  report += `Quality Score: ${result.score}/100\n\n`;
  
  if (result.errors.length > 0) {
    report += 'ERRORS:\n';
    result.errors.forEach(e => report += `  - [${e.rule}] ${e.message}\n`);
    report += '\n';
  }
  
  if (result.warnings.length > 0) {
    report += 'WARNINGS:\n';
    result.warnings.forEach(w => report += `  - [${w.rule}] ${w.message}\n`);
    report += '\n';
  }
  
  if (result.info.length > 0) {
    report += 'RECOMMENDATIONS:\n';
    result.info.forEach(i => report += `  - [${i.rule}] ${i.message}\n`);
  }
  
  return report;
}

export default {
  validateFindings,
  validateBatchFindings,
  generateValidationReport,
  validationRules
};