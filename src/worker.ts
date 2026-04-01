/**
 * Cloudflare Worker API Handler
 * Provides REST API for radiology report templates
 * 
 * @file src/worker.ts
 */

export interface Env {
  TEMPLATES_CACHE: KVNamespace;
  DB: D1Database;
  BULK_FILES: R2Bucket;
}

export interface Template {
  id: string;
  name: string;
  modality: string;
  bodyRegion: string;
  category: string;
  content: TemplateContent;
  metadata: TemplateMetadata;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateContent {
  sections: Section[];
}

export interface Section {
  id: string;
  name: string;
  content: string;
  required: boolean;
}

export interface TemplateMetadata {
  author: string;
  license: string;
  tags: string[];
  rads?: string[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: ResponseMeta;
}

export interface ResponseMeta {
  version: string;
  timestamp: string;
  count?: number;
}

const API_VERSION = "1.0.0";

/**
 * CORS headers for cross-origin requests
 */
function getCorsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

/**
 * Handle OPTIONS preflight requests
 */
function handleOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(),
  });
}

/**
 * Create standardized API response
 */
function createResponse<T>(data: T, status = 200): Response {
  const response: ApiResponse<T> = {
    success: status >= 200 && status < 300,
    data,
    meta: {
      version: API_VERSION,
      timestamp: new Date().toISOString(),
    },
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...getCorsHeaders(),
    },
  });
}

/**
 * Create error response
 */
function errorResponse(message: string, status = 500): Response {
  const response: ApiResponse = {
    success: false,
    error: message,
    meta: {
      version: API_VERSION,
      timestamp: new Date().toISOString(),
    },
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...getCorsHeaders(),
    },
  });
}

/**
 * Extract and validate template ID from URL
 */
function getTemplateId(url: URL): string | null {
  const match = url.pathname.match(/^\/api\/templates\/([^/]+)$/);
  return match ? match[1] : null;
}

/**
 * Get query parameters for filtering
 */
function getFilterParams(url: URL): Record<string, string> {
  const params: Record<string, string> = {};
  const allowedParams = ["modality", "bodyRegion", "category", "search", "rads"];

  for (const param of allowedParams) {
    const value = url.searchParams.get(param);
    if (value) params[param] = value;
  }

  return params;
}

/**
 * GET /api/templates - List all templates with optional filtering
 */
async function handleGetTemplates(env: Env, url: URL): Promise<Response> {
  const filters = getFilterParams(url);

  // Try cache first
  const cacheKey = `templates:${JSON.stringify(filters)}`;
  const cached = await env.TEMPLATES_CACHE.get(cacheKey);

  if (cached) {
    const data = JSON.parse(cached);
    return createResponse(data, 200);
  }

  // Query from D1 database
  let query = "SELECT * FROM templates WHERE 1=1";
  const params: string[] = [];

  if (filters.modality) {
    query += " AND modality = ?";
    params.push(filters.modality);
  }

  if (filters.bodyRegion) {
    query += " AND body_region = ?";
    params.push(filters.bodyRegion);
  }

  if (filters.category) {
    query += " AND category = ?";
    params.push(filters.category);
  }

  if (filters.rads) {
    query += " AND rads LIKE ?";
    params.push(`%${filters.rads}%`);
  }

  query += " ORDER BY updated_at DESC";

  // Apply limit
  const limit = url.searchParams.get("limit");
  if (limit) {
    query += ` LIMIT ${parseInt(limit, 10)}`;
  }

  try {
    const result = await env.DB.prepare(query).bind(...params).all();

    // Transform database result to API format
    const templates = result.results?.map((row: Record<string, unknown>) => ({
      id: row.id,
      name: row.name,
      modality: row.modality,
      bodyRegion: row.body_region,
      category: row.category,
      content: JSON.parse(row.content as string),
      metadata: JSON.parse(row.metadata as string),
      version: row.version,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })) ?? [];

    // Cache result for 5 minutes
    await env.TEMPLATES_CACHE.put(cacheKey, JSON.stringify(templates), { expirationTtl: 300 });

    const response: ApiResponse = {
      success: true,
      data: templates,
      meta: {
        version: API_VERSION,
        timestamp: new Date().toISOString(),
        count: templates.length,
      },
    };

    return createResponse(templates, 200);
  } catch (err) {
    console.error("Database query failed:", err);
    return errorResponse("Failed to fetch templates", 500);
  }
}

/**
 * GET /api/templates/:id - Get single template by ID
 */
async function handleGetTemplate(env: Env, id: string): Promise<Response> {
  // Try cache first
  const cacheKey = `template:${id}`;
  const cached = await env.TEMPLATES_CACHE.get(cacheKey);

  if (cached) {
    return createResponse(JSON.parse(cached), 200);
  }

  try {
    const result = await env.DB.prepare(
      "SELECT * FROM templates WHERE id = ?"
    ).bind(id).first();

    if (!result) {
      return errorResponse("Template not found", 404);
    }

    const template = {
      id: result.id,
      name: result.name,
      modality: result.modality,
      bodyRegion: result.body_region,
      category: result.category,
      content: JSON.parse(result.content as string),
      metadata: JSON.parse(result.metadata as string),
      version: result.version,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };

    // Cache result for 10 minutes
    await env.TEMPLATES_CACHE.put(cacheKey, JSON.stringify(template), { expirationTtl: 600 });

    return createResponse(template, 200);
  } catch (err) {
    console.error("Database query failed:", err);
    return errorResponse("Failed to fetch template", 500);
  }
}

/**
 * POST /api/templates - Create new template
 */
async function handleCreateTemplate(env: Env, request: Request): Promise<Response> {
  try {
    const body = await request.json() as Omit<Template, "id" | "createdAt" | "updatedAt">;

    // Validate required fields
    if (!body.name || !body.modality || !body.bodyRegion || !body.content) {
      return errorResponse("Missing required fields", 400);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await env.DB.prepare(`
      INSERT INTO templates (id, name, modality, body_region, category, content, metadata, version, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      body.name,
      body.modality,
      body.bodyRegion,
      body.category,
      JSON.stringify(body.content),
      JSON.stringify(body.metadata ?? {}),
      body.version ?? "1.0.0",
      now,
      now
    ).run();

    // Invalidate cache
    await env.TEMPLATES_CACHE.delete("templates:*");

    const template: Template = {
      id,
      ...body,
      version: body.version ?? "1.0.0",
      createdAt: now,
      updatedAt: now,
    };

    return createResponse(template, 201);
  } catch (err) {
    console.error("Create template failed:", err);
    return errorResponse("Failed to create template", 500);
  }
}

/**
 * PUT /api/templates/:id - Update existing template
 */
async function handleUpdateTemplate(env: Env, id: string, request: Request): Promise<Response> {
  try {
    const body = await request.json() as Partial<Omit<Template, "id" | "createdAt" | "updatedAt">>;

    const now = new Date().toISOString();

    // Build update query dynamically
    const updates: string[] = [];
    const params: unknown[] = [];

    if (body.name !== undefined) {
      updates.push("name = ?");
      params.push(body.name);
    }

    if (body.modality !== undefined) {
      updates.push("modality = ?");
      params.push(body.modality);
    }

    if (body.bodyRegion !== undefined) {
      updates.push("body_region = ?");
      params.push(body.bodyRegion);
    }

    if (body.category !== undefined) {
      updates.push("category = ?");
      params.push(body.category);
    }

    if (body.content !== undefined) {
      updates.push("content = ?");
      params.push(JSON.stringify(body.content));
    }

    if (body.metadata !== undefined) {
      updates.push("metadata = ?");
      params.push(JSON.stringify(body.metadata));
    }

    if (body.version !== undefined) {
      updates.push("version = ?");
      params.push(body.version);
    }

    updates.push("updated_at = ?");
    params.push(now);
    params.push(id);

    await env.DB.prepare(
      `UPDATE templates SET ${updates.join(", ")} WHERE id = ?`
    ).bind(...params).run();

    // Invalidate cache
    await env.TEMPLATES_CACHE.delete(`template:${id}`);
    await env.TEMPLATES_CACHE.delete("templates:*");

    return handleGetTemplate(env, id);
  } catch (err) {
    console.error("Update template failed:", err);
    return errorResponse("Failed to update template", 500);
  }
}

/**
 * DELETE /api/templates/:id - Delete template
 */
async function handleDeleteTemplate(env: Env, id: string): Promise<Response> {
  try {
    await env.DB.prepare("DELETE FROM templates WHERE id = ?").bind(id).run();

    // Invalidate cache
    await env.TEMPLATES_CACHE.delete(`template:${id}`);
    await env.TEMPLATES_CACHE.delete("templates:*");

    return createResponse({ deleted: true, id }, 200);
  } catch (err) {
    console.error("Delete template failed:", err);
    return errorResponse("Failed to delete template", 500);
  }
}

/**
 * GET /api/formats - List supported export formats
 */
function handleGetFormats(): Response {
  const formats = [
    { id: "json", name: "JSON", description: "Raw JSON format" },
    { id: "json-api", name: "JSON API", description: "JSON API specification format" },
    { id: "json-schema", name: "JSON Schema", description: "JSON Schema format" },
    { id: "markdown", name: "Markdown", description: "Markdown format" },
    { id: "xml-mrrt", name: "MRRT XML", description: "MRRT HL7 XML format" },
    { id: "fhir-r4", name: "FHIR R4", description: "FHIR R4 profile" },
    { id: "fhir-r5", name: "FHIR R5", description: "FHIR R5 profile" },
    { id: "hl7v2-oru", name: "HL7 v2 ORU", description: "HL7 v2 ORU message" },
    { id: "dicom-sr", name: "DICOM SR", description: "DICOM Structured Report" },
    { id: "cda", name: "CDA", description: "HL7 CDA document" },
    { id: "pdf", name: "PDF", description: "PDF document" },
    { id: "csv", name: "CSV", description: "CSV spreadsheet" },
    { id: "yaml", name: "YAML", description: "YAML format" },
  ];

  return createResponse(formats, 200);
}

/**
 * GET /api/categories - List all categories
 */
async function handleGetCategories(env: Env): Promise<Response> {
  const cacheKey = "categories:list";
  const cached = await env.TEMPLATES_CACHE.get(cacheKey);

  if (cached) {
    return createResponse(JSON.parse(cached), 200);
  }

  try {
    const result = await env.DB.prepare(
      "SELECT modality, body_region, category, COUNT(*) as count FROM templates GROUP BY modality, body_region, category"
    ).all();

    const categories = result.results ?? [];

    await env.TEMPLATES_CACHE.put(cacheKey, JSON.stringify(categories), { expirationTtl: 3600 });

    return createResponse(categories, 200);
  } catch (err) {
    console.error("Get categories failed:", err);
    return errorResponse("Failed to fetch categories", 500);
  }
}

/**
 * GET /api/rads - List all RADS classifications
 */
async function handleGetRads(env: Env): Promise<Response> {
  const cacheKey = "rads:list";
  const cached = await env.TEMPLATES_CACHE.get(cacheKey);

  if (cached) {
    return createResponse(JSON.parse(cached), 200);
  }

  const radsSystems = [
    { id: "ci", name: "CIRADS", fullName: "Central Imaging Reporting and Data System", description: "Thyroid" },
    { id: "li", name: "LI-RADS", fullName: "Liver Imaging Reporting and Data System", description: "Liver" },
    { id: "ti", name: "TI-RADS", fullName: "Thyroid Imaging Reporting and Data System", description: "Thyroid" },
    { id: "pi", name: "PI-RADS", fullName: "Prostate Imaging Reporting and Data System", description: "Prostate" },
    { id: "ri", name: "RI-RADS", fullName: "Renal Imaging Reporting and Data System", description: "Kidney" },
    { id: "vi", name: "VI-RADS", fullName: "Vascular Imaging Reporting and Data System", description: "Vascular" },
    { id: "o", name: "O-RADS", fullName: "Ovarian-Adnexal Reporting and Data System", description: "Ovarian" },
    { id: "bi", name: "BI-RADS", fullName: "Breast Imaging Reporting and Data System", description: "Breast" },
    { id: "nas", name: "NAS-RADS", fullName: "Neuroradiology Analytics Scoring", description: "Neuro" },
  ];

  await env.TEMPLATES_CACHE.put(cacheKey, JSON.stringify(radsSystems), { expirationTtl: 86400 });

  return createResponse(radsSystems, 200);
}

/**
 * Main request handler
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return handleOptions();
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Route: GET /api/templates
      if (path === "/api/templates" && request.method === "GET") {
        return handleGetTemplates(env, url);
      }

      // Route: POST /api/templates
      if (path === "/api/templates" && request.method === "POST") {
        return handleCreateTemplate(env, request);
      }

      // Route: GET /api/templates/:id
      const templateId = getTemplateId(url);
      if (templateId && path.startsWith("/api/templates/")) {
        if (request.method === "GET") {
          return handleGetTemplate(env, templateId);
        }
        if (request.method === "PUT") {
          return handleUpdateTemplate(env, templateId, request);
        }
        if (request.method === "DELETE") {
          return handleDeleteTemplate(env, templateId);
        }
      }

      // Route: GET /api/formats
      if (path === "/api/formats" && request.method === "GET") {
        return handleGetFormats();
      }

      // Route: GET /api/categories
      if (path === "/api/categories" && request.method === "GET") {
        return handleGetCategories(env);
      }

      // Route: GET /api/rads
      if (path === "/api/rads" && request.method === "GET") {
        return handleGetRads(env);
      }

      // Route: GET /api/health
      if (path === "/api/health" && request.method === "GET") {
        return createResponse({ status: "healthy", timestamp: new Date().toISOString() }, 200);
      }

      // 404 for unmatched routes
      return errorResponse("Not found", 404);
    } catch (err) {
      console.error("Unhandled error:", err);
      return errorResponse("Internal server error", 500);
    }
  },
};
