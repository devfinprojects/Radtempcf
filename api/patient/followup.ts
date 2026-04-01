/**
 * Patient Follow-up Tracking API
 * Tracks and manages follow-up recommendations from radiology reports
 */

export type FollowUpUrgency = 'immediate' | 'urgent' | 'routine' | 'optional';

export interface FollowUpRecommendation {
  id: string;
  reportId: string;
  createdAt: string;
  recommendation: string;
  urgency: FollowUpUrgency;
  timeframe: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface FollowUpTrackingOptions {
  includeCompleted: boolean;
  urgency?: FollowUpUrgency;
}

/**
 * Track a new follow-up recommendation
 */
export function trackFollowUp(
  reportId: string,
  recommendation: string,
  urgency: FollowUpUrgency,
  timeframe: string
): FollowUpRecommendation {
  return {
    id: `followup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    reportId,
    createdAt: new Date().toISOString(),
    recommendation,
    urgency,
    timeframe,
    completed: false,
  };
}

/**
 * Complete a follow-up recommendation
 */
export function completeFollowUp(
  followUp: FollowUpRecommendation,
  notes?: string
): FollowUpRecommendation {
  return {
    ...followUp,
    completed: true,
    completedAt: new Date().toISOString(),
    notes,
  };
}

/**
 * Get urgency level color for UI
 */
export function getUrgencyColor(urgency: FollowUpUrgency): string {
  const colors: Record<FollowUpUrgency, string> = {
    immediate: '#dc2626', // red
    urgent: '#ea580c',   // orange
    routine: '#2563eb',  // blue
    optional: '#16a34a', // green
  };
  return colors[urgency];
}

/**
 * Get urgency priority number (lower = more urgent)
 */
export function getUrgencyPriority(urgency: FollowUpUrgency): number {
  const priorities: Record<FollowUpUrgency, number> = {
    immediate: 1,
    urgent: 2,
    routine: 3,
    optional: 4,
  };
  return priorities[urgency];
}

/**
 * Sort follow-ups by urgency
 */
export function sortByUrgency(
  followUps: FollowUpRecommendation[]
): FollowUpRecommendation[] {
  return [...followUps].sort((a, b) => 
    getUrgencyPriority(a.urgency) - getUrgencyPriority(b.urgency)
  );
}

/**
 * Filter follow-ups by status
 */
export function filterFollowUps(
  followUps: FollowUpRecommendation[],
  options: FollowUpTrackingOptions
): FollowUpRecommendation[] {
  let filtered = followUps;

  if (!options.includeCompleted) {
    filtered = filtered.filter(f => !f.completed);
  }

  if (options.urgency) {
    filtered = filtered.filter(f => f.urgency === options.urgency);
  }

  return filtered;
}

/**
 * Calculate follow-up compliance rate
 */
export function calculateComplianceRate(
  followUps: FollowUpRecommendation[]
): { total: number; completed: number; rate: number } {
  const total = followUps.length;
  const completed = followUps.filter(f => f.completed).length;
  const rate = total > 0 ? (completed / total) * 100 : 0;

  return {
    total,
    completed,
    rate: Math.round(rate * 10) / 10,
  };
}

/**
 * Get overdue follow-ups
 */
export function getOverdueFollowUps(
  followUps: FollowUpRecommendation[]
): FollowUpRecommendation[] {
  const now = new Date();
  
  return followUps.filter(f => {
    if (f.completed) return false;
    
    // Parse timeframe and check if overdue
    const timeframe = f.timeframe.toLowerCase();
    const created = new Date(f.createdAt);
    
    if (timeframe.includes('week')) {
      const weeks = parseInt(timeframe) || 1;
      const dueDate = new Date(created);
      dueDate.setDate(dueDate.getDate() + (weeks * 7));
      return now > dueDate;
    }
    
    if (timeframe.includes('month')) {
      const months = parseInt(timeframe) || 1;
      const dueDate = new Date(created);
      dueDate.setMonth(dueDate.getMonth() + months);
      return now > dueDate;
    }
    
    return false;
  });
}

// Test function
export function test(): string {
  const recommendations = [
    trackFollowUp('report-001', 'Schedule cardiology follow-up', 'urgent', '2 weeks'),
    trackFollowUp('report-002', 'Repeat CT in 3 months', 'routine', '3 months'),
    trackFollowUp('report-003', 'MRI for further evaluation', 'immediate', '1 week'),
  ];

  const sorted = sortByUrgency(recommendations);
  const compliance = calculateComplianceRate(recommendations);

  return `Follow-up API - Tracked ${recommendations.length} recommendations. Compliance rate: ${compliance.rate}%`;
}