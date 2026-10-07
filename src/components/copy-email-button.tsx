"use client";

import { useState } from "react";

export function CopyEmailButton({ email }: { email: string }) {
  const [status, setStatus] = useState("");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("Email address copied.");
    } catch {
      setStatus("Copy is unavailable here. Select the email address above or use Compose Email.");
    }
  }

  return (
    <div className="grid justify-items-start gap-3">
      <button className="button button-outline" type="button" onClick={copyEmail}>Copy email address</button>
      <span className="text-xs text-ink-muted" role="status" aria-live="polite">{status}</span>
    </div>
  );
}
