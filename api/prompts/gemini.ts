/**
 * Gemini Prompt Templates for Radiology Reporting
 * AI_PROMPT_GEMINI - Priority: P1
 * 
 * Pre-built prompts for generating radiology reports using Google's Gemini
 * Optimized for multimodal analysis and structured output generation
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

export const geminiPrompts: PromptTemplate[] = [
  {
    id: 'gemini-structured-report',
    name: 'Structured Report Generator',
    description: 'Generate fully structured radiology reports using Gemini',
    category: 'findings',
    systemPrompt: `You are a radiology AI optimized for structured output generation.
Generate reports in precise JSON format following clinical standards.
Use standardized terminology from RadLex where applicable.
Ensure all required elements are present for interoperability.`,
    userPromptTemplate: `Generate a structured {{modality}} report for {{bodyRegion}}.

# EXAMINATION DETAILS
- Modality: {{modality}}
- Body Region: {{bodyRegion}}
- Exam Type: {{examType}}
- Clinical Indication: {{clinicalIndication}}

# FINDINGS DATA
{{findingsData}}

# OUTPUT FORMAT
Provide structured output with these sections:
- Findings: Organized by anatomical region
- Impression: Clinical synthesis
- Recommendations: Follow-up if applicable`,
    exampleInput: {
      modality: 'CT',
      bodyRegion: 'Abdomen/Pelvis',
      examType: 'CT Abdomen/Pelvis with Contrast',
      clinicalIndication: 'Abdominal pain, rule out appendicitis',
      findingsData: JSON.stringify({
        appendix: 'Dilated, 12mm, periappendiceal fat stranding',
        liver: 'No focal lesions, normal echotexture',
        kidneys: 'No hydronephrosis, normal corticomedullary differentiation',
        bowel: 'No bowel wall thickening or obstruction',
        pelvis: 'No free fluid'
      })
    },
    exampleOutput: `{
  "findings": {
    "appendix": "Dilated tubular structure in the right lower quadrant measuring up to 12mm in diameter with surrounding periappendiceal fat stranding. Compatible with acute appendicitis.",
    "liver": "No focal hepatic lesions. Homogeneous parenchymal echotexture.",
    "kidneys": "No evidence of hydronephrosis. Normal corticomedullary differentiation bilaterally.",
    "bowel": "No mural thickening or luminal dilatation to suggest obstruction or inflammation.",
    "pelvis": "No free fluid identified."
  },
  "impression": "Acute appendicitis. No complicated features such as perforation or abscess at this time.",
  "recommendations": "Clinical correlation with surgical consultation. Consider ultrasound for further characterization if clinically indicated."
}`
  },
  {
    id: 'gemini-multimodal-findings',
    name: 'Multimodal Findings',
    description: 'Generate findings integrating multiple imaging sequences',
    category: 'findings',
    systemPrompt: `You are optimized for multimodal imaging analysis.
Synthesize findings from multiple sequences and modalities.
Cross-correlate findings across different weightings and sequences.
Provide unified findings that integrate all available imaging information.`,
    userPromptTemplate: `Synthesize findings from multiple sequences for {{bodyRegion}}.

MODALITY: {{modality}}
SEQUENCES: {{sequences}}

FINDINGS BY SEQUENCE:
{{sequenceFindings}}

Provide unified findings integrating all sequences.`,
    exampleInput: {
      modality: 'MRI',
      bodyRegion: 'Knee',
      sequences: 'T1, T2 FS, PD, T1+C',
      sequenceFindings: JSON.stringify({
        'T1': 'hypointense abnormality in posterior horn medial meniscus',
        'T2 FS': 'hyperintense signal in posterior horn medial meniscus',
        'PD': 'linear high signal reaching articular surface'
      })
    },
    exampleOutput: `FINDINGS:

Meniscus:
- Posterior horn medial meniscus: Linear high signal intensity on PD and T2-weighted images extending to the articular surface, consistent with a complex tear involving the posterior horn. The tear appears to propagate into the body region.

Ligaments:
- ACL: Intact
- PCL: Intact
- MCL: Normal
- LCL: Normal

Other:
- Quadriceps and patellar tendons: Intact
- No joint effusion
- Bone marrow: No abnormal signal`
  },
  {
    id: 'gemini-ai-detection-summary',
    name: 'AI Detection Summary',
    description: 'Synthesize AI detection findings into structured report',
    category: 'findings',
    systemPrompt: `You are optimized for synthesizing AI detection results into clinical reports.
Integrate AI findings with human interpretation.
Use appropriate confidence language for AI-detected findings.
Cross-verify AI detections with underlying imaging when possible.`,
    userPromptTemplate: `Synthesize AI detection findings with human interpretation.

CLINICAL QUESTION: {{clinicalQuestion}}
AI DETECTIONS: {{aiDetections}}
HUMAN OVERRIDE: {{humanOverride}}

Integrate AI findings, noting confidence levels and any human modifications.`,
    exampleInput: {
      clinicalQuestion: 'Lung cancer screening',
      aiDetections: JSON.stringify([
        { location: 'RUL', size: '9mm', confidence: 0.89, type: 'solid nodule' },
        { location: 'LUL', size: '5mm', confidence: 0.72, type: 'groundglass' }
      ]),
      humanOverride: 'Confirm AI findings, add additional 3mm nodule in RLL not detected by AI'
    },
    exampleOutput: `FINDINGS:

AI-Detected Findings:
- Right upper lobe: Solid nodule measuring 9mm. AI confidence: 89%. This correlates with the prior study showing growth from 7mm.
- Left upper lobe: Groundglass nodule measuring 5mm. AI confidence: 72%. Recommend continued surveillance.

Additional Findings (Human):
- Right lower lobe: Additional 3mm solid nodule not detected by AI, likely due to size threshold.

IMPRESSION:
1. Dominant right upper lobe nodule (9mm) - Lung-RADS 3, recommend 6-month follow-up
2. Small left upper lobe groundglass nodule (5mm) - Lung-RADS 2, recommend 12-month follow-up
3. Incidental 3mm right lower lobe nodule - Lung-RADS 1, annual screening`
  },
  {
    id: 'gemini-followup-recommendations',
    name: 'Follow-up Recommendations',
    description: 'Generate guideline-based follow-up recommendations',
    category: 'recommendation',
    systemPrompt: `You specialize in guideline-based follow-up recommendations.
Apply appropriate scoring systems (Lung-RADS, LI-RADS, BI-RADS, etc.)
Provide time-appropriate follow-up intervals.
Include specific action items in recommendations.`,
    userPromptTemplate: `Generate follow-up recommendations based on findings and scoring system.

FINDINGS: {{findings}}
SCORING SYSTEM: {{scoringSystem}}
PREVIOUS SCORE: {{previousScore}}

Apply {{scoringSystem}} guidelines to determine appropriate follow-up.`,
    exampleInput: {
      findings: JSON.stringify({
        'right upper lobe nodule': '12mm solid, spiculated',
        'left upper lobe nodule': '6mm groundglass'
      }),
      scoringSystem: 'Lung-RADS',
      previousScore: 'Lung-RADS 2'
    },
    exampleOutput: `RECOMMENDATIONS (Lung-RADS):

1. Right upper lobe solid nodule (12mm, spiculated):
   - Current Classification: Lung-RADS 4B (suspicious, >8mm solid with spiculated margins)
   - Recommended Action: Additional imaging with PET/CT or tissue sampling
   - Timing: Within 2-4 weeks
   - Rationale: Spiculated morphology and size above 8mm threshold significantly increases malignancy risk

2. Left upper lobe groundglass nodule (6mm):
   - Current Classification: Lung-RADS 2 (probably benign)
   - Recommended Action: Annual screening
   - Timing: 12 months
   - Rationale: Pure groundglass <10mm with no concerning features

3. Continue annual lung cancer screening per USPSTF guidelines.`
  }
];

/**
 * Generate a complete Gemini prompt for a specific template
 */
export function generateGeminiPrompt(
  templateId: string,
  inputData: Record<string, unknown>
): { system: string; user: string } | null {
  const template = geminiPrompts.find(t => t.id === templateId);
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

export default geminiPrompts;