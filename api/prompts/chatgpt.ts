/**
 * ChatGPT Prompt Templates for Radiology Reporting
 * AI_PROMPT_CHAT_GPT - Priority: P1
 * 
 * Pre-built prompts for generating radiology findings and impressions using OpenAI's ChatGPT/GPT-4
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

export const chatGptPrompts: PromptTemplate[] = [
  {
    id: 'chatgpt-findings-generator',
    name: 'Findings Generator',
    description: 'Generate structured radiology findings from imaging data',
    category: 'findings',
    systemPrompt: `You are a board-certified radiologist specializing in AI-assisted reporting. 
Generate clear, accurate, and clinically relevant findings based on the provided imaging data.
Use standard anatomical terminology and include appropriate modifiers for lesion characteristics.
Focus on actionable findings that help guide clinical management.`,
    userPromptTemplate: `Generate radiology findings for a {{modality}} study of the {{bodyRegion}}.

EXAMINATION: {{examinationType}}
CLINICAL INDICATION: {{clinicalIndication}}
TECHNIQUE: {{technique}}

IMAGING FINDINGS:
{{findingsData}}

Provide findings in the following structured format:
1. Organize by anatomical structure/region
2. Use standardized terminology
3. Include size, location, characteristics for any abnormalities
4. Compare to prior studies when available`,
    exampleInput: {
      modality: 'CT',
      bodyRegion: 'Chest',
      examinationType: 'CT Chest with Contrast',
      clinicalIndication: 'Cough, fever, rule out pneumonia',
      technique: 'Axial CT with IV contrast, 3mm slices',
      findingsData: JSON.stringify({
        lungs: [
          { location: 'right lower lobe', finding: 'consolidation', size: '4.2 cm' }
        ],
        mediastinum: 'no lymphadenopathy',
        pleura: 'no effusion'
      })
    },
    exampleOutput: `FINDINGS:

Lungs:
- Right lower lobe: Consolidation measuring approximately 4.2 cm in greatest dimension, consistent with pneumonia. No obvious cavitation.

Mediastinum:
- No significant mediastinal lymphadenopathy. Normal cardiac silhouette.

Pleura:
- No pleural effusion.

Other:
- No evidence of pulmonary embolism.`
  },
  {
    id: 'chatgpt-impression-writer',
    name: 'Impression Writer',
    description: 'Generate concise, actionable impressions from findings',
    category: 'impression',
    systemPrompt: `You are a board-certified radiologist writing impressions for radiology reports.
Write clear, concise impressions that:
1. Address the clinical question
2. Provide differential diagnoses when appropriate
3. Include follow-up recommendations when needed
4. Use appropriate urgency wording
5. Correlate findings with clinical history`,
    userPromptTemplate: `Write an impression for a {{modality}} of the {{bodyRegion}}.

CLINICAL QUESTION: {{clinicalQuestion}}
FINDINGS: {{findings}}

Provide a 2-4 sentence impression that:
- Answers the clinical question
- Notes any urgent findings
- Includes follow-up recommendations if applicable`,
    exampleInput: {
      modality: 'CT',
      bodyRegion: 'Abdomen',
      clinicalQuestion: 'Right upper quadrant pain, rule out cholecystitis',
      findings: JSON.stringify({
        gallbladder: 'Wall thickening 5mm, pericholecystic fluid, stones',
        liver: 'Normal echotexture, no masses',
        pancreas: 'Unremarkable'
      })
    },
    exampleOutput: `IMPRESSION:
1. Findings are consistent with acute cholecystitis, including gallbladder wall thickening, pericholecystic fluid, and cholelithiasis.
2. Recommend clinical correlation and surgical consultation for consideration of cholecystectomy.`
  },
  {
    id: 'chatgpt-comparison-assistant',
    name: 'Comparison Assistant',
    description: 'Compare current findings with prior studies',
    category: 'comparison',
    systemPrompt: `You are a radiologist comparing current imaging findings with prior studies.
Provide clear comparison statements that:
1. Note interval changes (new, resolved, improved, worsened)
2. Quantify changes when possible
3. Highlight clinically significant differences
4. Maintain consistency in terminology`,
    userPromptTemplate: `Compare current findings with prior study.

CURRENT STUDY: {{currentDate}} - {{currentModality}}
PRIOR STUDY: {{priorDate}} - {{priorModality}}

CURRENT FINDINGS: {{currentFindings}}
PRIOR FINDINGS: {{priorFindings}}

Provide comparison in paragraph format.`,
    exampleInput: {
      currentDate: '2026-03-30',
      currentModality: 'CT Chest',
      priorDate: '2026-01-15',
      priorModality: 'CT Chest',
      currentFindings: JSON.stringify({
        'right upper lobe nodule': 'now 1.2 cm (previously 0.8 cm)',
        'left lower lobe': 'stable groundglass opacity'
      }),
      priorFindings: JSON.stringify({
        'right upper lobe nodule': '0.8 cm',
        'left lower lobe': 'groundglass opacity'
      })
    },
    exampleOutput: `COMPARISON:
The right upper lobe nodule has increased in size from 0.8 cm to 1.2 cm since the prior examination dated January 15, 2026. This represents approximately 50% interval growth and warrants further evaluation. The left lower lobe groundglass opacity is unchanged.`
  },
  {
    id: 'chatgpt-recommendation-generator',
    name: 'Recommendation Generator',
    description: 'Generate appropriate follow-up recommendations based on findings',
    category: 'recommendation',
    systemPrompt: `You are a radiologist generating follow-up recommendations based on imaging findings.
Follow established guidelines (Lung-RADS, LI-RADS, etc.) when applicable.
Provide recommendations that are:
1. Evidence-based
2. Clinically appropriate
3. Actionable
4. Include timeframes`,
    userPromptTemplate: `Generate follow-up recommendations based on the findings.

FINDINGS: {{findings}}
MODALITY: {{modality}}
BODY REGION: {{bodyRegion}}
CLINICAL CONTEXT: {{clinicalContext}}

Provide specific recommendations with timeframes.`,
    exampleInput: {
      modality: 'CT Chest',
      bodyRegion: 'Chest',
      findings: JSON.stringify({
        'right upper lobe': 'solid nodule 8mm',
        'left upper lobe': 'groundglass nodule 6mm'
      }),
      clinicalContext: 'Baseline lung cancer screening'
    },
    exampleOutput: `RECOMMENDATIONS:
1. Right upper lobe solid nodule (8mm): Follow-up CT in 12 months per Lung-RADS 2 criteria.
2. Left upper lobe groundglass nodule (6mm): Follow-up CT in 12 months. Consider earlier follow-up if any suspicious features develop.
3. Continue annual screening per guidelines.`
  }
];

/**
 * Generate a complete ChatGPT prompt for a specific template
 */
export function generateChatGptPrompt(
  templateId: string,
  inputData: Record<string, unknown>
): { system: string; user: string } | null {
  const template = chatGptPrompts.find(t => t.id === templateId);
  if (!template) return null;

  let userPrompt = template.userPromptTemplate;
  
  // Replace template variables with input data
  Object.entries(inputData).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    userPrompt = userPrompt.replace(regex, typeof value === 'object' ? JSON.stringify(value) : String(value));
  });

  return {
    system: template.systemPrompt,
    user: userPrompt
  };
}

export default chatGptPrompts;