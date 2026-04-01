/**
 * Monitoring and Alerting Configuration
 * RadReport Templates - Cloudflare Workers
 * 
 * @file src/monitoring.ts
 */

// Alert Types
export type AlertSeverity = "critical" | "high" | "medium" | "low";
export type AlertType = "error_rate" | "latency" | "availability" | "quota" | "security";

export interface Alert {
  id: string;
  name: string;
  severity: AlertSeverity;
  type: AlertType;
  threshold: number;
  duration: number; // in seconds
  enabled: boolean;
  webhookUrl?: string;
  email?: string;
}

export interface MetricData {
  name: string;
  value: number;
  timestamp: number;
  labels?: Record<string, string>;
}

// Predefined Alerts Configuration
export const ALERTS_CONFIG: Alert[] = [
  {
    id: "error-rate-critical",
    name: "Critical Error Rate",
    severity: "critical",
    type: "error_rate",
    threshold: 5, // 5% error rate
    duration: 300, // 5 minutes
    enabled: true,
    webhookUrl: process.env.ALERT_WEBHOOK_URL,
    email: process.env.ALERT_EMAIL,
  },
  {
    id: "latency-high",
    name: "High Latency",
    severity: "high",
    type: "latency",
    threshold: 2000, // 2 seconds
    duration: 300,
    enabled: true,
    webhookUrl: process.env.ALERT_WEBHOOK_URL,
  },
  {
    id: "availability-low",
    name: "Low Availability",
    severity: "critical",
    type: "availability",
    threshold: 99, // 99% availability
    duration: 600, // 10 minutes
    enabled: true,
    email: process.env.ALERT_EMAIL,
  },
  {
    id: "quota-exceeded",
    name: "Quota Exceeded",
    severity: "high",
    type: "quota",
    threshold: 90, // 90% of quota
    duration: 60,
    enabled: true,
    webhookUrl: process.env.ALERT_WEBHOOK_URL,
  },
];

/**
 * Send alert notification to webhook
 */
export async function sendAlert(alert: Alert, message: string): Promise<void> {
  if (!alert.webhookUrl) return;

  const payload = {
    alert_id: alert.id,
    alert_name: alert.name,
    severity: alert.severity,
    message,
    timestamp: new Date().toISOString(),
    source: "radreport-templates",
  };

  try {
    const response = await fetch(alert.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Failed to send alert: ${response.status}`);
    }
  } catch (error) {
    console.error("Error sending alert webhook:", error);
  }
}

/**
 * Track metric for monitoring
 */
export async function trackMetric(data: MetricData): Promise<void> {
  // In production, this would send to Cloudflare Analytics Engine
  // For now, log to console
  console.log("[METRIC]", JSON.stringify(data));
}

/**
 * Check alert thresholds
 */
export function checkAlertThresholds(
  metrics: Map<string, number>,
  alerts: Alert[] = ALERTS_CONFIG
): Alert[] {
  const triggeredAlerts: Alert[] = [];

  for (const alert of alerts) {
    if (!alert.enabled) continue;

    const metricValue = metrics.get(alert.type) ?? 0;
    let isTriggered = false;

    switch (alert.type) {
      case "error_rate":
        isTriggered = metricValue >= alert.threshold;
        break;
      case "latency":
        isTriggered = metricValue >= alert.threshold;
        break;
      case "availability":
        isTriggered = metricValue < alert.threshold;
        break;
      case "quota":
        isTriggered = metricValue >= alert.threshold;
        break;
    }

    if (isTriggered) {
      triggeredAlerts.push(alert);
    }
  }

  return triggeredAlerts;
}

/**
 * Calculate error rate from analytics
 */
export function calculateErrorRate(totalRequests: number, errorRequests: number): number {
  if (totalRequests === 0) return 0;
  return (errorRequests / totalRequests) * 100;
}

/**
 * Calculate average latency
 */
export function calculateAvgLatency(responseTimes: number[]): number {
  if (responseTimes.length === 0) return 0;
  const sum = responseTimes.reduce((a, b) => a + b, 0);
  return sum / responseTimes.length;
}

/**
 * Health check response
 */
export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  checks: Record<string, { status: string; message?: string }>;
  timestamp: string;
}

export async function performHealthCheck(env: {
  DB?: D1Database;
  TEMPLATES_CACHE?: KVNamespace;
}): Promise<HealthStatus> {
  const checks: Record<string, { status: string; message?: string }> = {};
  let overallStatus: "healthy" | "degraded" | "unhealthy" = "healthy";

  // Check database
  try {
    if (env.DB) {
      await env.DB.prepare("SELECT 1").first();
      checks.database = { status: "ok" };
    } else {
      checks.database = { status: "skipped", message: "No database binding" };
    }
  } catch (error) {
    checks.database = { status: "error", message: String(error) };
    overallStatus = "unhealthy";
  }

  // Check KV cache
  try {
    if (env.TEMPLATES_CACHE) {
      await env.TEMPLATES_CACHE.get("health-check");
      checks.cache = { status: "ok" };
    } else {
      checks.cache = { status: "skipped", message: "No cache binding" };
    }
  } catch (error) {
    checks.cache = { status: "error", message: String(error) };
    overallStatus = "degraded";
  }

  return {
    status: overallStatus,
    checks,
    timestamp: new Date().toISOString(),
  };
}
