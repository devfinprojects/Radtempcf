/**
 * Claude Prompt Templates for Radiology Reporting
 * AI_PROMPT_CLAUDE - Priority: P1
 * 
 * Pre-built prompts for generating radiology findings and impressions using Anthropic's Claude
 */

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: 'findings' | 'impression' | 'comparison' | 'recommendation';
  systemPrompt: string;
  userPromptTemplate: string;
  exampleInput: Record<string, unknown>;
  exampleOutput: string;
}

export const claudePrompts: PromptTemplate[] = [
  {
    id: 'claude-findings-generator',
    name: 'Findings Generator (Claude)',
    description: 'Generate structured radiology findings with complex reasoning using Claude',
    category: 'findings',
    systemPrompt: `You are a highly experienced radiologist with expertise in complex case interpretation.
Claude excels at nuanced clinical reasoning - use this to provide sophisticated analysis.
Consider multiple diagnostic possibilities and provide differential reasoning.
Use precise anatomical terminology and provide reasoning for your assessments.`,
    userPromptTemplate: `Analyze this {{modality}} study of the {{bodyRegion}} and generate findings.

EXAMINATION: {{examinationType}}
CLINICAL HISTORY: {{clinicalHistory}}
TECHNIQUE: {{technique}}

STRUCTURED OBSERVATIONS:
{{structuredObservations}}

Generate findings that:
1. Systematically address each anatomical region
2. Provide clinical context for abnormalities
3. Consider differential diagnoses where appropriate
4. Note any limitations or technical factors`,
    exampleInput: {
      modality: 'MRI',
      bodyRegion: 'Brain',
      examinationType: 'MRI Brain with and without Contrast',
      clinicalHistory: '62-year-old female with progressive memory loss',
      technique: '3T MRI, T1, T2 FLAIR, DWI, T1 post-contrast',
      structuredObservations: JSON.stringify({
        'parenchyma': {
          'white matter': 'multiple T2 FLAIR hyperintensities in periventricular regions',
          'cortex': 'mild cortical atrophy greater than expected for age'
        },
        'ventricles': 'mild ventricular enlargement',
        'vessels': 'no flow voids evaluated'
      })
    },
    exampleOutput: `FINDINGS:

Parenchyma:
- White Matter: Multiple periventricular T2 FLAIR hyperintensities, consistent with small vessel ischemic changes. No acute infarcts on DWI.
- Cortex: Mild diffuse cortical atrophy, more pronounced than expected for age, potentially indicating underlying neurodegenerative process.

Ventricles:
- Mild ventricular enlargement consistent with ex vacuo dilatation.

Other:
- No abnormal enhancement to suggest neoplasia.
- No mass effect or midline shift.

LIMITATIONS: Comparison with prior studies would enhance assessment of interval changes.`
  },
  {
    id: 'claude-impression-writer',
    name: 'Impression Writer (Claude)',
    description: 'Generate nuanced impressions with complex clinical reasoning',
    category: 'impression',
    systemPrompt: `You are a sophisticated clinical reasoning AI. Write impressions that:
1. Synthesize complex findings into coherent clinical narratives
2. Explicitly reason through diagnostic possibilities
3. Provide appropriately calibrated uncertainty
4. Connect imaging findings to clinical management
5. Consider cost-effectiveness and value in recommendations`,
    userPromptTemplate: `Synthesize these findings into a clinical impression.

CLINICAL QUESTION: {{clinicalQuestion}}
FINDINGS: {{findings}}
RELEVANT HISTORY: {{relevantHistory}}

Write an impression that:
- Addresses the primary clinical question
- Provides diagnostic reasoning
- Includes appropriate follow-up recommendations
- Considers the clinical context`,
    exampleInput: {
      clinicalQuestion: 'Workup for hepatocellular carcinoma surveillance',
      findings: JSON.stringify({
        'liver': '2.3 cm arterially enhancing lesion in segment VII, washout on portal venous phase',
        'additional': 'several smaller lesions up to 1 cm with similar enhancement',
        'vessels': 'portal vein patent'
      }),
      relevantHistory: 'Cirrhosis due to hepatitis C, previous AFP elevated'
    },
    exampleOutput: `IMPRESSION:
1. A 2.3 cm arterially enhancing lesion in hepatic segment VII demonstrates washout on portal venous phase, meeting LI-RADS LR-5 criteria and highly suspicious for hepatocellular carcinoma. The presence of several smaller lesions with similar enhancement pattern raises concern for additional tumor nodules.

2. Given the patient's underlying cirrhosis and elevated AFP, these findings are most consistent with multifocal hepatocellular carcinoma. Recommend multidisciplinary discussion for staging and treatment planning.

3. The patent portal vein suggests no portal vein invasion at this time, which is favorable for potential curative treatment options.`
  },
  {
    id: 'claude-structured-report',
    name: 'Structured Report (Claude)',
    description: 'Generate comprehensive structured reports following clinical guidelines',
    category: 'findings',
    systemPrompt: `You specialize in creating structured radiology reports following specialty-specific guidelines.
Ensure reports include all required elements for:
- Legal and billing compliance
- Clinical decision support
- Data capture for quality metrics
- Interoperability with health records`,
    userPromptTemplate: `Create a structured report for {{procedure}}.

PROCEDURE: {{procedure}}
INDICATION: {{indication}}
FINDINGS: {{findings}}
COMPARISON: {{comparison}}

Follow {{guideline}} guidelines for structure. Include all required elements.`,
    exampleInput: {
      procedure: 'CT Chest',
      indication: 'Lung cancer staging',
      findings: JSON.stringify({
        'lung': '2.1 cm right upper lobe mass, spiculated margins',
        'nodes': 'mediastinal lymphadenopathy, largest 1.5 cm short axis at station 4R',
        'bones': 'no suspicious lesions'
      }),
      comparison: 'Prior CT 2 months prior: stable',
      guideline: 'Lung-RADS'
    },
    exampleOutput: `EXAMINATION: CT Chest with Contrast
INDICATION: Lung cancer staging

TECHNICAL NOTE: Axial CT with intravenous contrast, 3mm reconstructed slices.

FINDINGS:
Primary Tumor:
- Location: Right upper lobe
- Size: 2.1 cm (longest axial dimension)
- Characteristics: Spiculated margins
- Comment: Consistent with likely lung primary

Lymph Nodes:
- Station 4R: 1.5 cm short axis (short axis >1 cm threshold)
- Other mediastinal nodes: Not significantly enlarged

Distant Metastases:
- Osseous: No suspicious osseous lesions identified

COMPARISON: Stable compared to prior CT from 2 months ago.

IMPRESSION:
1. Right upper lobe spiculated mass, highly suspicious for primary lung malignancy (Lung-RADS 4X)
2. Mediastinal lymphadenopathy at station 4R concerning for nodal metastasis
3. Recommend PET/CT for complete staging and tissue diagnosis
4. No definite distant metastases identified on current examination`
  },
  {
    id: 'claude-quality-check',
    name: 'Quality Checker (Claude)',
    description: 'Review reports for completeness and accuracy',
    category: 'recommendation',
    systemPrompt: `You are an expert radiology quality assurance AI.
Review reports for:
1. Completeness per specialty guidelines
2. Appropriateness of recommendations
3. Technical quality indicators
4. Communication of critical findings
5. Consistency and clarity`,
    userPromptTemplate: `Review this radiology report for quality indicators.

REPORT TO REVIEW:
{{reportContent}}

Check for:
- Completeness per {{guideline}} guidelines
- Appropriate recommendations
- Critical findings communication
- Clarity and consistency
- Any gaps or concerns`,
    exampleInput: {
      reportContent: 'FINDINGS: Lungs clear. Heart normal. IMPRESSION: Normal chest CT',
      guideline: 'ACR'
    },
    exampleOutput: `QUALITY REVIEW:

Completeness: ⚠️ INCOMPLETE
- No comparison to prior studies mentioned
- Technical factors not documented
- Each anatomic region should be explicitly addressed

Recommendations: ✓ APPROPRIATE
- Normal study - no follow-up needed is reasonable

Critical Findings: ✓ ADEQUATE
- No critical findings to communicate

Clarity: ✓ CLEAR
- Impression is concise and clear

RECOMMENDATIONS:
1. Add comparison statement even if "no prior studies available"
2. Document technical factors (contrast, slice thickness)
3. Consider adding "limited to above" if technically limited`
  }
];

/**
 * Generate a complete Claude prompt for a specific template
 */
export function generateClaudePrompt(
  templateId: string,
  inputData: Record<string, unknown>
): { system: string; user: string } | null {
  const template = claudePrompts.find(t => t.id === templateId);
  if (!template) return null;

  let userPrompt = template.userPromptTemplate;
  
  Object.entries(inputData).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    userPrompt = userPrompt.replace(regex, typeof value === 'object' ? JSON.stringify(value) : String(value));
  });

  return {
    system: template.systemPrompt,
    user: userPrompt
  };
}

export default claudePrompts;