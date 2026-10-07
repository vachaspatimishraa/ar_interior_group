import { createHash } from "node:crypto";
import type { EnquiryConfig } from "./config";

const RATE_LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;
const IDEMPOTENCY_TTL_SECONDS = 24 * 60 * 60;

async function command(config: EnquiryConfig, values: (string | number)[]) {
  const response = await fetch(config.upstashUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.upstashToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(values),
    signal: AbortSignal.timeout(3000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Upstash request failed");
  const result = await response.json() as { result?: unknown; error?: unknown };
  if (result.error) throw new Error("Upstash command failed");
  return result.result;
}

export function createUpstashProtection(config: EnquiryConfig) {
  return {
    async consume(ip: string): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
      const key = `arig:enquiry:rate:${createHash("sha256").update(ip).digest("hex")}`;
      const script = "local count=redis.call('INCR',KEYS[1]); if count==1 then redis.call('PEXPIRE',KEYS[1],ARGV[1]) end; return {count,redis.call('PTTL',KEYS[1])}";
      const result = await command(config, ["EVAL", script, "1", key, WINDOW_MS]);
      if (!Array.isArray(result) || typeof result[0] !== "number" || typeof result[1] !== "number") throw new Error("Invalid rate-limit response");
      return { allowed: result[0] <= RATE_LIMIT, retryAfterSeconds: Math.max(1, Math.ceil(result[1] / 1000)) };
    },
    async reserve(idempotencyKey: string): Promise<boolean> {
      const digest = createHash("sha256").update(idempotencyKey).digest("hex");
      const result = await command(config, ["SET", `arig:enquiry:idempotency:${digest}`, "processing", "NX", "EX", IDEMPOTENCY_TTL_SECONDS]);
      return result === "OK";
    },
    async complete(idempotencyKey: string): Promise<void> {
      const digest = createHash("sha256").update(idempotencyKey).digest("hex");
      await command(config, ["SET", `arig:enquiry:idempotency:${digest}`, "accepted", "EX", IDEMPOTENCY_TTL_SECONDS]);
    },
    async release(idempotencyKey: string): Promise<void> {
      const digest = createHash("sha256").update(idempotencyKey).digest("hex");
      await command(config, ["DEL", `arig:enquiry:idempotency:${digest}`]);
    },
  };
}
