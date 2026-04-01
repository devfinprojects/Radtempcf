/**
 * CDS Hooks Services
 * AI_CDS_HOOKS - Priority: P1
 * 
 * Implementation of CDS Hooks specification for clinical decision support
 * Enables real-time integration with EHR systems for order recommendations
 */

export interface CDSHookContext {
  userId: string;
  patientId: string;
  encounterId?: string;
  fhirServer?: string;
  locale?: string;
}

export interface CDSHookRequest {
  hook: string;
  hookInstance: string;
  context: CDSHookContext;
  prefetch?: Record<string, unknown>;
}

export interface CDSRecommendation {
  id: string;
  label: string;
  description: string;
  detail?: string;
  links?: {
    label: string;
    url: string;
    type: 'absolute' | 'relative';
  }[];
}

export interface CDSCard {
  uuid: string;
  priority: number;
  summary: string;
  detail?: string;
  indicator: 'info' | 'warning' | 'critical' | 'hard-stop';
  source: {
    label: string;
    url?: string;
  };
  suggestions?: {
    label: string;
    action: {
      type: string;
      description: string;
      resource?: unknown;
    };
  }[];
  links?: {
    label: string;
    url: string;
    type: 'absolute' | 'relative';
  }[];
}

export interface CDSHookResponse {
  cards: CDSCard[];
  systemActions?: {
    type: string;
    description: string;
  }[];
}

/**
 * Base CDS Hooks service class
 */
export abstract class CDSHookService {
  protected hookName: string;
  
  constructor(hookName: string) {
    this.hookName = hookName;
  }
  
  /**
   * Handle the CDS hook invocation
   */
  abstract handle(request: CDSHookRequest): Promise<CDSHookResponse>;
  
  /**
   * Validate the hook request
   */
  protected validateRequest(request: CDSHookRequest): boolean {
    return !!(
      request.hook === this.hookName &&
      request.hookInstance &&
      request.context?.patientId
    );
  }
  
  /**
   * Create a basic card response
   */
  protected createCard(
    summary: string,
    indicator: CDSCard['indicator'] = 'info',
    detail?: string,
    priority: number = 0
  ): CDSCard {
    return {
      uuid: crypto.randomUUID(),
      priority,
      summary,
      detail,
      indicator,
      source: {
        label: 'RadReport Templates',
        url: 'https://radtempcf.devfinprojects.com'
      }
    };
  }
}

/**
 * Order Select Hook Service
 * AI_CDS_ORDER_SELECT - Priority: P1
 * 
 * Handles order-select hook for imaging order recommendations
 */
export class OrderSelectHookService extends CDSHookService {
  constructor() {
    super('order-select');
  }
  
  async handle(request: CDSHookRequest): Promise<CDSHookResponse> {
    const cards: CDSCard[] = [];
    
    // Get the order being placed
    const order = request.context['order'] as Record<string, unknown>;
    
    if (!order) {
      return { cards: [] };
    }
    
    const orderCode = order.code as string;
    const orderDisplay = order.display as string;
    
    // Check for guideline-based recommendations
    const recommendations = this.getRecommendations(orderCode, orderDisplay);
    
    if (recommendations.length > 0) {
      cards.push({
        uuid: crypto.randomUUID(),
        priority: 0,
        summary: 'Imaging Guidelines',
        detail: `Based on standard imaging guidelines, consider the following for ${orderDisplay}:`,
        indicator: 'info',
        source: {
          label: 'RadReport Templates'
        },
        suggestions: recommendations.map(rec => ({
          label: rec.label,
          action: {
            type: 'create',
            description: rec.description
          }
        }))
      });
    }
    
    // Check for appropriate use criteria
    const appropriateUse = this.checkAppropriateUse(orderCode, request.context.patientId);
    
    if (!appropriateUse.appropriate) {
      cards.push({
        uuid: crypto.randomUUID(),
        priority: 1,
        summary: 'Appropriate Use Warning',
        detail: appropriateUse.reason,
        indicator: appropriateUse.indicator,
        source: {
          label: 'RadReport Templates'
        }
      });
    }
    
    return { cards };
  }
  
  /**
   * Get guideline-based recommendations for an order
   */
  private getRecommendations(code: string, display: string): { label: string; description: string }[] {
    const recommendations: { label: string; description: string }[] = [];
    
    // CT Head
    if (code === 'CT_HEAD' || display.toLowerCase().includes('ct head')) {
      recommendations.push(
        {
          label: 'Add CT Angiography',
          description: 'Consider CT angiography for suspected vascular pathology'
        },
        {
          label: 'Include sinuses',
          description: 'Consider including sinuses if clinical suspicion for sinusitis'
        }
      );
    }
    
    // CT Chest
    if (code === 'CT_CHEST' || display.toLowerCase().includes('ct chest')) {
      recommendations.push(
        {
          label: 'Low-dose protocol',
          description: 'Consider low-dose protocol for screening/detection'
        },
        {
          label: 'Add contrast',
          description: 'IV contrast recommended for mediastinal/vascular evaluation'
        }
      );
    }
    
    // CT Abdomen
    if (code === 'CT_ABD' || display.toLowerCase().includes('ct abdomen')) {
      recommendations.push(
        {
          label: 'Oral contrast',
          description: 'Consider oral contrast for bowel evaluation'
        },
        {
          label: 'Triple phase',
          description: 'Triple phase (noncontrast, arterial, portal venous) for liver lesion characterization'
        }
      );
    }
    
    // Mammography
    if (code === 'MAMMO' || display.toLowerCase().includes('mammogram')) {
      recommendations.push(
        {
          label: 'Add tomosynthesis',
          description: 'Digital breast tomosynthesis improves detection in dense breast tissue'
        }
      );
    }
    
    return recommendations;
  }
  
  /**
   * Check appropriate use criteria
   */
  private checkAppropriateUse(
    code: string,
    patientId: string
  ): { appropriate: boolean; reason: string; indicator: 'info' | 'warning' | 'critical' } {
    // Placeholder for actual appropriate use logic
    // In production, would integrate with AUC systems
    
    return {
      appropriate: true,
      reason: '',
      indicator: 'info'
    };
  }
}

/**
 * Order View Hook Service
 * Handles order-view hook for contextual information
 */
export class OrderViewHookService extends CDSHookService {
  constructor() {
    super('order-view');
  }
  
  async handle(request: CDSHookRequest): Promise<CDSHookResponse> {
    const cards: CDSCard[] = [];
    
    const order = request.context['order'] as Record<string, unknown>;
    
    if (!order) {
      return { cards: [] };
    }
    
    // Add reference information card
    cards.push({
      uuid: crypto.randomUUID(),
      priority: 0,
      summary: 'Protocol Reference',
      detail: 'View standard reporting templates for this study type',
      indicator: 'info',
      source: {
        label: 'RadReport Templates'
      },
      links: [
        {
          label: 'View Templates',
          url: `/templates?modality=${(order.code as string)?.toLowerCase() || ''}`,
          type: 'relative'
        }
      ]
    });
    
    return { cards };
  }
}

/**
 * Patient View Hook Service
 */
export class PatientViewHookService extends CDSHookService {
  constructor() {
    super('patient-view');
  }
  
  async handle(request: CDSHookRequest): Promise<CDSHookResponse> {
    const cards: CDSCard[] = [];
    
    // Check for pending follow-up imaging
    cards.push({
      uuid: crypto.randomUUID(),
      priority: 0,
      summary: 'Imaging History',
      detail: 'Review prior imaging studies for comparison',
      indicator: 'info',
      source: {
        label: 'RadReport Templates'
      }
    });
    
    return { cards };
  }
}

/**
 * Factory for creating CDS Hook services
 */
export class CDSHookServiceFactory {
  private static services: Map<string, CDSHookService> = new Map([
    ['order-select', new OrderSelectHookService()],
    ['order-view', new OrderViewHookService()],
    ['patient-view', new PatientViewHookService()]
  ]);
  
  /**
   * Get service for a specific hook
   */
  static getService(hook: string): CDSHookService | null {
    return this.services.get(hook) || null;
  }
  
  /**
   * Handle a hook invocation
   */
  static async handleHook(request: CDSHookRequest): Promise<CDSHookResponse> {
    const service = this.getService(request.hook);
    
    if (!service) {
      return {
        cards: [{
          uuid: crypto.randomUUID(),
          priority: 0,
          summary: 'Unknown Hook',
          detail: `Hook "${request.hook}" is not supported`,
          indicator: 'warning',
          source: { label: 'RadReport Templates' }
        }]
      };
    }
    
    return service.handle(request);
  }
}

export default {
  OrderSelectHookService,
  OrderViewHookService,
  PatientViewHookService,
  CDSHookServiceFactory
};