/**
 * Markdown Renderer - Converts radiology templates to Markdown format
 * Dependencies: SCHEMA_TEMPLATE_BASE
 */

export interface FormatOptions {
  includeMetadata?: boolean;
  includeFindings?: boolean;
  includeImpression?: boolean;
  includeRecommendations?: boolean;
  customHeadingStyle?: 'atx' | 'setext';
  bulletStyle?: '-' | '*' | '+';
  numberedListStart?: number;
  includeTableOfContents?: boolean;
  compactMode?: boolean;
}

const defaultOptions: FormatOptions = {
  includeMetadata: true,
  includeFindings: true,
  includeImpression: true,
  includeRecommendations: true,
  customHeadingStyle: 'atx',
  bulletStyle: '-',
  numberedListStart: 1,
  includeTableOfContents: false,
  compactMode: false,
};

/**
 * Generates a Markdown report from a template object
 */
export function formatMarkdown(template: any, options?: FormatOptions): string {
  const opts = { ...defaultOptions, ...options };
  const lines: string[] = [];

  // Title
  lines.push(`# ${template.name || 'Radiology Report'}`);
  lines.push('');

  // Metadata section
  if (opts.includeMetadata) {
    lines.push(formatMetadataSection(template, opts));
    lines.push('');
  }

  // Findings section
  if (opts.includeFindings && template.findings) {
    lines.push(formatFindingsSection(template, opts));
    lines.push('');
  }

  // Impression section
  if (opts.includeImpression && template.impression) {
    lines.push(formatImpressionSection(template, opts));
    lines.push('');
  }

  // Recommendations section
  if (opts.includeRecommendations && template.recommendations) {
    lines.push(formatRecommendationsSection(template, opts));
    lines.push('');
  }

  // Footer
  if (template.footer) {
    lines.push('---');
    lines.push(template.footer);
  }

  return lines.join('\n');
}

function formatMetadataSection(template: any, opts: FormatOptions): string {
  const lines: string[] = [];
  lines.push('## Metadata');
  lines.push('');

  const metadata = [
    { label: 'Template ID', value: template.id },
    { label: 'Modality', value: template.modality },
    { label: 'Body Region', value: template.bodyRegion },
    { label: 'Category', value: template.category },
    { label: 'RADS System', value: template.rads },
    { label: 'Version', value: template.version },
    { label: 'Last Updated', value: template.lastUpdated },
    { label: 'Author', value: template.author },
    { label: 'License', value: template.license },
  ];

  for (const item of metadata) {
    if (item.value) {
      lines.push(`- **${item.label}:** ${item.value}`);
    }
  }

  return lines.join('\n');
}

function formatFindingsSection(template: any, opts: FormatOptions): string {
  const lines: string[] = [];
  lines.push('## Findings');
  lines.push('');

  // Handle different finding formats
  if (typeof template.findings === 'string') {
    // Plain text findings - format as paragraphs
    const paragraphs = template.findings.split('\n\n');
    for (const para of paragraphs) {
      if (para.trim()) {
        lines.push(para.trim());
        lines.push('');
      }
    }
  } else if (Array.isArray(template.findings)) {
    // Array of findings
    for (const finding of template.findings) {
      const bullet = opts.bulletStyle || '-';
      if (typeof finding === 'string') {
        lines.push(`${bullet} ${finding}`);
      } else if (finding.category) {
        lines.push(`### ${finding.category}`);
        lines.push('');
        for (const item of finding.items || []) {
          lines.push(`${bullet} ${item}`);
        }
      }
    }
  }

  return lines.join('\n');
}

function formatImpressionSection(template: any, opts: FormatOptions): string {
  const lines: string[] = [];
  lines.push('## Impression');
  lines.push('');

  if (typeof template.impression === 'string') {
    const impressions = template.impression.split('\n').filter((line: string) => line.trim());
    for (const impression of impressions) {
      const bullet = opts.bulletStyle || '-';
      lines.push(`${bullet} ${impression.trim()}`);
    }
  } else if (Array.isArray(template.impression)) {
    for (const imp of template.impression) {
      const bullet = opts.bulletStyle || '-';
      lines.push(`${bullet} ${typeof imp === 'string' ? imp : JSON.stringify(imp)}`);
    }
  }

  return lines.join('\n');
}

function formatRecommendationsSection(template: any, opts: FormatOptions): string {
  const lines: string[] = [];
  lines.push('## Recommendations');
  lines.push('');

  if (Array.isArray(template.recommendations)) {
    const bullet = opts.bulletStyle || '-';
    for (const rec of template.recommendations) {
      if (typeof rec === 'string') {
        lines.push(`${bullet} ${rec}`);
      } else if (rec.priority) {
        lines.push(`- **[${rec.priority}]** ${rec.text}`);
      }
    }
  }

  return lines.join('\n');
}

/**
 * MarkdownRenderer class for advanced formatting
 */
export class MarkdownRenderer {
  private options: FormatOptions;

  constructor(options?: FormatOptions) {
    this.options = { ...defaultOptions, ...options };
  }

  render(template: any): string {
    return formatMarkdown(template, this.options);
  }

  setOptions(options: Partial<FormatOptions>): void {
    this.options = { ...this.options, ...options };
  }

  getOptions(): FormatOptions {
    return { ...this.options };
  }

  // Method to add custom section
  addSection(title: string, content: string): string {
    return `## ${title}\n\n${content}\n\n`;
  }

  // Method to add table
  addTable(headers: string[], rows: string[][]): string {
    const lines: string[] = [];
    
    // Header row
    lines.push(`| ${headers.join(' | ')} |`);
    
    // Separator
    lines.push(`| ${headers.map(() => '---').join(' | ')} |`);
    
    // Data rows
    for (const row of rows) {
      lines.push(`| ${row.join(' | ')} |`);
    }
    
    return lines.join('\n');
  }
}

// Export for testing
export default MarkdownRenderer;
