import { isIP } from "node:net";
import { randomUUID } from "node:crypto";
import type { EnquiryConfig } from "./config.ts";
import { createEnquiryEmail, MAX_REQUEST_BYTES, validateEnquiry } from "./validation.ts";

type Protection = {
  consume(ip: string): Promise<{ allowed: boolean; retryAfterSeconds: number }>;
  reserve(idempotencyKey: string): Promise<boolean>;
  complete(idempotencyKey: string): Promise<void>;
  release(idempotencyKey: string): Promise<void>;
};

export type EnquiryHandlerDependencies = {
  config: EnquiryConfig | null;
  protection: Protection | null;
  sendEmail: (email: ReturnType<typeof createEnquiryEmail>, replyTo: string) => Promise<void>;
  now?: () => Date;
  createReference?: () => string;
  log?: (event: string) => void;
};

function json(body: object, status: number, extraHeaders: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extraHeaders } });
}

async function readBoundedJson(request: Request): Promise<{ value?: unknown; status?: number }> {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > MAX_REQUEST_BYTES)) return { status: 413 };
  if (!request.body) return { status: 400 };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_REQUEST_BYTES) {
        await reader.cancel();
        return { status: 413 };
      }
      chunks.push(value);
    }
  } catch {
    return { status: 400 };
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return { value: JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as unknown };
  } catch {
    return { status: 400 };
  }
}

export function createEnquiryHandler(dependencies: EnquiryHandlerDependencies) {
  return async function handle(request: Request): Promise<Response> {
    const { config, protection } = dependencies;
    if (!config || !protection) return json({ error: "The enquiry service is temporarily unavailable." }, 503);

    const origin = request.headers.get("origin");
    if (!origin || origin !== config.siteOrigin) return json({ error: "This request could not be verified." }, 403);
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return json({ error: "Use the enquiry form to submit your request." }, 415);

    const parsed = await readBoundedJson(request);
    if (parsed.status === 413) return json({ error: "The request is too large. Shorten your message and try again." }, 413);
    if (parsed.status || parsed.value === undefined) return json({ error: "The request could not be read. Check the form and try again." }, 400);

    const validation = validateEnquiry(parsed.value);
    if (!validation.success) return json({ error: "Check the highlighted fields and try again.", fieldErrors: validation.fieldErrors }, 422);
    if (validation.data.website) return json({ error: "This request could not be processed." }, 400);

    const idempotencyKey = request.headers.get("idempotency-key") ?? "";
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencyKey)) {
      return json({ error: "Refresh the form and try submitting again." }, 400);
    }

    const clientIp = request.headers.get(config.trustedIpHeader)?.trim() ?? "";
    if (isIP(clientIp) === 0) return json({ error: "The enquiry service is temporarily unavailable." }, 503);

    try {
      const rate = await protection.consume(clientIp);
      if (!rate.allowed) return json({ error: "Too many enquiries have been submitted. Please try again later." }, 429, { "Retry-After": String(rate.retryAfterSeconds) });
      const reserved = await protection.reserve(idempotencyKey);
      if (!reserved) return json({ error: "This enquiry has already been submitted or is being processed." }, 409);
    } catch {
      dependencies.log?.("enquiry_protection_unavailable");
      return json({ error: "The enquiry service is temporarily unavailable." }, 503);
    }

    const reference = dependencies.createReference?.() ?? randomUUID();
    const submittedAt = dependencies.now?.() ?? new Date();
    const email = createEnquiryEmail(validation.data, reference, submittedAt);
    try {
      await dependencies.sendEmail(email, validation.data.email);
    } catch {
      dependencies.log?.("enquiry_email_provider_failed");
      try {
        await protection.release(idempotencyKey);
      } catch {
        dependencies.log?.("enquiry_idempotency_release_failed");
      }
      return json({ error: "We could not send your enquiry just now. Please try again or use the direct contact details." }, 502);
    }

    try {
      await protection.complete(idempotencyKey);
    } catch {
      // Keep the existing reservation until its TTL expires so a retry cannot send twice.
      dependencies.log?.("enquiry_idempotency_finalize_failed");
    }
    return json({ status: "accepted", reference }, 202);
  };
}
