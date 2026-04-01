/**
 * FHIRcast Integration Module
 * Provides FHIRcast subscription support for real-time radiology workflow synchronization
 * Based on FHIRcast Hub specification
 */

export interface FhirCastConfig {
  hubUrl: string;
  webhookUrl: string;
  clientId: string;
  clientSecret?: string;
  topics: string[];
}

export interface FhirCastTopic {
  id: string;
  resourceType: string;
  resourceId: string;
  patientId?: string;
  encounterId?: string;
}

export interface FhirCastEvent {
  hubTopic: string;
  hubEvent: string;
  timestamp: string;
  id: string;
  data?: {
    fhirResource: {
      resourceType: string;
      id: string;
      meta?: {
        lastUpdated: string;
        versionId?: string;
      };
    };
    // Additional context for specific events
    subject?: { reference: string };
    focus?: { reference: string }[];
    currentRoom?: { reference: string };
    workflow?: { reference: string };
  };
}

export interface FhirCastSubscription {
  id: string;
  topic: string;
  callback: string;
  status: 'requested' | 'accepted' | 'rejected' | 'cancelled';
  events: string[];
  expires?: string;
  secret?: string;
}

/**
 * FHIRcast Hub client for managing subscriptions and receiving events
 */
export class FhirCastHub {
  constructor(private config: FhirCastConfig) {}

  /**
   * Subscribe to a FHIRcast topic
   */
  async subscribe(topic: string, events: string[]): Promise<FhirCastSubscription> {
    const response = await fetch(`${this.config.hubUrl}/Subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        resourceType: 'Subscription',
        status: 'requested',
        channel: {
          type: 'websocket',
          endpoint: this.config.webhookUrl,
          filter: [
            {
              attribute: 'topic',
              value: topic
            },
            {
              attribute: 'events',
              value: events.join(',')
            }
          ]
        }
      })
    });

    if (!response.ok) {
      throw new Error(`FHIRcast subscription failed: ${response.status}`);
    }

    return (await response.json()) as FhirCastSubscription;
  }

  /**
   * Unsubscribe from a topic
   */
  async unsubscribe(subscriptionId: string): Promise<void> {
    const response = await fetch(`${this.config.hubUrl}/Subscription/${subscriptionId}`, {
      method: 'DELETE'
    });

    if (!response.ok && response.status !== 204) {
      throw new Error(`FHIRcast unsubscribe failed: ${response.status}`);
    }
  }

  /**
   * Request current context for a topic
   */
  async getCurrentContext(topic: string): Promise<FhirCastTopic[]> {
    const response = await fetch(`${this.config.hubUrl}/Topic/${topic}/$get-context`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`FHIRcast get-context failed: ${response.status}`);
    }

    const bundle = (await response.json()) as { entry?: { resource: FhirCastTopic }[] };
    return bundle.entry?.map((e) => e.resource) || [];
  }

  /**
   * Request workflow status update
   */
  async requestWorkflowStatus(studyInstanceUID: string): Promise<FhirCastEvent> {
    const response = await fetch(`${this.config.hubUrl}/Topic/study-${studyInstanceUID}/$status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentRoom: `urn:ihe:rad:txw:study-${studyInstanceUID}`,
        workflow: 'urn:ihe:rad:txw:reading-room'
      })
    });

    if (!response.ok) {
      throw new Error(`FHIRcast status request failed: ${response.status}`);
    }

    return (await response.json()) as FhirCastEvent;
  }
}

/**
 * FHIRcast Webhook handler for receiving events
 */
export class FhirCastWebhook {
  private eventHandlers: Map<string, (event: FhirCastEvent) => Promise<void>> = new Map();

  /**
   * Register event handler
   */
  onEvent(eventName: string, handler: (event: FhirCastEvent) => Promise<void>): void {
    this.eventHandlers.set(eventName, handler);
  }

  /**
   * Handle incoming webhook request
   */
  async handleWebhook(body: unknown): Promise<{ status: number; message: string }> {
    try {
      const event = body as FhirCastEvent;
      
      // Validate required fields
      if (!event.hubTopic || !event.hubEvent || !event.timestamp) {
        return { status: 400, message: 'Missing required FHIRcast fields' };
      }

      const handler = this.eventHandlers.get(event.hubEvent);
      
      if (handler) {
        await handler(event);
        return { status: 200, message: 'Event processed successfully' };
      }

      // Return 200 even if no handler - we don't want retries for unhandled events
      return { status: 200, message: 'Event received' };
    } catch (error) {
      console.error('FHIRcast webhook error:', error);
      return { status: 500, message: 'Internal server error' };
    }
  }

  /**
   * Verify webhook subscription
   */
  verifySubscription(mode: string, challenge: string, leaseSeconds: number): string {
    // FHIRcast uses GET for subscription verification
    // The hub will call the webhook with mode=subscribe&challenge=xxx
    if (mode === 'subscribe' || mode === 'unsubscribe') {
      return challenge;
    }
    return '';
  }
}

/**
 * FHIRcast Event Types for Radiology
 */
export const FHIRCAST_RADIOLOGY_EVENTS = {
  // Study-related events
  STUDY_OPEN: 'ihe-rad.study-open',
  STUDY_UPDATED: 'ihe-rad.study-updated',
  STUDY_COMPLETE: 'ihe-rad.study-complete',
  
  // Image-related events
  IMAGE_OPEN: 'ihe-rad.image-open',
  IMAGE_UPDATED: 'ihe-rad.image-updated',
  
  // Report-related events  
  REPORT_OPEN: 'ihe-rad.report-open',
  REPORT_UPDATED: 'ihe-rad.report-updated',
  REPORT_VERIFIED: 'ihe-rad.report-verified',
  REPORT_AMENDED: 'ihe-rad.report-amended',
  
  // Patient context events
  PATIENT_CONTEXT: 'patient-context',
  
  // Workflow events
  ENCOUNTER_START: 'encounter-start',
  ENCOUNTER_END: 'encounter-end',
  
  // Reading room events
  READING_ROOM_OPEN: 'ihe-rad.reading-room.open',
  READING_ROOM_CLOSE: 'ihe-rad.reading-room.close'
} as const;

/**
 * FHIRcast Workflow Shortcuts for common radiology scenarios
 */
export const FHIRCAST_WORKFLOW_SHORTCUTS = {
  INITIAL_READ: 'urn:ihe:rad:txw:initial-read',
  PRELIMINARY_REPORT: 'urn:ihe:rad:txw:preliminary-report',
  FINAL_REPORT: 'urn:ihe:rad:txw:final-report',
  ADDENDUM: 'urn:ihe:rad:txw:addendum',
  PEER_REVIEW: 'urn:ihe:rad:txw:peer-review',
  QI_REVIEW: 'urn:ihe:rad:txw:qi-review'
} as const;

export default FhirCastHub;
