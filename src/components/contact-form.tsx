"use client";

import { useRef, useState, type FormEvent } from "react";
import { PROJECT_TYPES } from "@/lib/enquiries/validation";
import { RevealItem } from "@/lib/motion/reveal-attributes";

type FieldErrors = Record<string, string>;
type ApiResponse = { error?: string; reference?: string; fieldErrors?: FieldErrors; status?: string };

const inputClass = "contact-form-control";
const labelClass = "contact-form-field";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [reference, setReference] = useState("");
  const submissionLock = useRef(false);
  const idempotencyKey = useRef("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionLock.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    submissionLock.current = true;
    setSubmitting(true);
    setFieldErrors({});
    setFormError("");
    if (!idempotencyKey.current) idempotencyKey.current = crypto.randomUUID();

    const data = new FormData(form);
    const payload = {
      fullName: data.get("fullName"),
      email: data.get("email"),
      phone: data.get("phone"),
      companyName: data.get("companyName"),
      projectType: data.get("projectType"),
      location: data.get("location"),
      message: data.get("message"),
      website: data.get("website"),
    };

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey.current },
        body: JSON.stringify(payload),
      });
      let result: ApiResponse = {};
      try {
        result = await response.json() as ApiResponse;
      } catch {
        // Treat non-JSON proxy errors as failures without surfacing response internals.
      }
      if (!response.ok) {
        if (response.status === 422 && result.fieldErrors) setFieldErrors(result.fieldErrors);
        setFormError(result.error ?? "We could not send your enquiry. Please try again or use the direct contact details.");
        return;
      }
      if (response.status !== 202 || result.status !== "accepted" || !result.reference) {
        setFormError("We could not confirm that your enquiry was accepted. Please try again or contact us directly.");
        return;
      }
      setReference(result.reference);
      idempotencyKey.current = "";
      form.reset();
    } catch {
      setFormError("A network problem stopped the enquiry. Your entries are still here; please try again.");
    } finally {
      submissionLock.current = false;
      setSubmitting(false);
    }
  }

  const errorFor = (field: string) => fieldErrors[field];
  const inputAttributes = (field: string) => ({
    "aria-invalid": Boolean(errorFor(field)),
    "aria-describedby": errorFor(field) ? `${field}-error` : undefined,
  });

  return (
    <form onSubmit={submit} className="contact-form" noValidate aria-busy={submitting}>
      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="enquiry-website">Leave this field empty</label>
        <input id="enquiry-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="contact-form-row">
        <label className={labelClass} htmlFor="enquiry-name" {...RevealItem({ kind: "control", delayMs: 680 })}>Full name <span className="contact-required">(required)</span>
          <input id="enquiry-name" name="fullName" type="text" required maxLength={120} autoComplete="name" className={inputClass} {...inputAttributes("fullName")} />
          {errorFor("fullName") && <span id="fullName-error" className="text-xs text-error-on-light">{errorFor("fullName")}</span>}
        </label>

        <label className={labelClass} htmlFor="enquiry-email" {...RevealItem({ kind: "control", delayMs: 740 })}>Email address <span className="contact-required">(required)</span>
          <input id="enquiry-email" name="email" type="email" required maxLength={254} autoComplete="email" className={inputClass} {...inputAttributes("email")} />
          {errorFor("email") && <span id="email-error" className="text-xs text-error-on-light">{errorFor("email")}</span>}
        </label>
      </div>

      <div className="contact-form-row" {...RevealItem({ kind: "control", delayMs: 820 })}>
        <label className={labelClass} htmlFor="enquiry-phone">Phone <span className="contact-optional">(optional)</span>
          <input id="enquiry-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className={inputClass} {...inputAttributes("phone")} />
          {errorFor("phone") && <span id="phone-error" className="text-xs text-error-on-light">{errorFor("phone")}</span>}
        </label>
        <label className={labelClass} htmlFor="enquiry-company">Company <span className="text-ink-muted">(optional)</span>
          <input id="enquiry-company" name="companyName" type="text" maxLength={160} autoComplete="organization" className={inputClass} {...inputAttributes("companyName")} />
          {errorFor("companyName") && <span id="companyName-error" className="text-xs text-error-on-light">{errorFor("companyName")}</span>}
        </label>
      </div>

      <div className="contact-form-row" {...RevealItem({ kind: "control", delayMs: 920 })}>
        <label className={labelClass} htmlFor="enquiry-type">Project type <span className="contact-required">(required)</span>
          <select id="enquiry-type" name="projectType" required defaultValue="" className={`${inputClass} contact-form-select`} {...inputAttributes("projectType")}>
            <option value="" disabled className="bg-ivory text-ink">Choose a project type</option>
            {PROJECT_TYPES.map((type) => <option key={type} value={type} className="bg-ivory text-ink">{type}</option>)}
          </select>
          {errorFor("projectType") && <span id="projectType-error" className="text-xs text-error-on-light">{errorFor("projectType")}</span>}
        </label>
        <label className={labelClass} htmlFor="enquiry-location">Project location <span className="contact-optional">(optional)</span>
          <input id="enquiry-location" name="location" type="text" maxLength={120} autoComplete="address-level2" className={inputClass} {...inputAttributes("location")} />
          {errorFor("location") && <span id="location-error" className="text-xs text-error-on-light">{errorFor("location")}</span>}
        </label>
      </div>

      <label className={`${labelClass} contact-message-field`} htmlFor="enquiry-message" {...RevealItem({ kind: "control", delayMs: 1020 })}>Project requirements <span className="contact-required">(required)</span>
        <textarea id="enquiry-message" name="message" required minLength={5} maxLength={5000} rows={5} className="contact-form-control contact-form-message" {...inputAttributes("message")} />
        {errorFor("message") && <span id="message-error" className="text-xs text-error-on-light">{errorFor("message")}</span>}
      </label>

      <p className="contact-form-disclosure" {...RevealItem({ kind: "copy", delayMs: 1120 })}>Your details are used to respond to this enquiry. This website does not store submissions; the configured email provider processes the notification. Do not include sensitive personal information.</p>
      <button className="button button-dark contact-submit" type="submit" disabled={submitting} {...RevealItem({ kind: "control", delayMs: 1200 })}>
        {submitting ? "Sending enquiry…" : "Send enquiry"} <span aria-hidden="true">{submitting ? "…" : "↗"}</span>
      </button>
      {formError && <p role="alert" className="text-sm leading-6 text-error-on-light">{formError}</p>}
      {reference && <p role="status" aria-live="polite" className="text-sm leading-6 text-gold-ink">Your enquiry was accepted for processing. Reference: <span className="font-mono text-xs">{reference}</span>. This confirms provider acceptance, not inbox delivery.</p>}
      {fieldErrors.form && <p role="alert" className="text-sm text-error-on-light">{fieldErrors.form}</p>}
    </form>
  );
}
