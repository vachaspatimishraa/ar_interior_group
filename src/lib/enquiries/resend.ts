import type { EnquiryConfig } from "./config";
import type { EnquiryEmail } from "./validation";

export async function sendWithResend(config: EnquiryConfig, email: EnquiryEmail, replyTo: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.fromEmail,
      to: [config.toEmail],
      reply_to: replyTo,
      subject: email.subject,
      text: email.text,
      html: email.html,
    }),
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Email provider rejected the notification");
}
