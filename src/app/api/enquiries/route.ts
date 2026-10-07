import { getEnquiryConfig } from "@/lib/enquiries/config";
import { createEnquiryHandler } from "@/lib/enquiries/handler";
import { sendWithResend } from "@/lib/enquiries/resend";
import { createUpstashProtection } from "@/lib/enquiries/upstash";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const config = getEnquiryConfig();
  const protection = config ? createUpstashProtection(config) : null;
  const handle = createEnquiryHandler({
    config,
    protection,
    sendEmail: (email, replyTo) => {
      if (!config) throw new Error("Enquiry service is not configured");
      return sendWithResend(config, email, replyTo);
    },
    log: (event) => console.error(`[enquiry] ${event}`),
  });
  return handle(request);
}
