export const MAX_REQUEST_BYTES = 16 * 1024;

export const PROJECT_TYPES = [
  "Office / workplace fit-out",
  "Retail / food service",
  "Healthcare interior",
  "Furniture / partitions",
  "Other commercial interior",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export type EnquiryInput = {
  fullName: string;
  email: string;
  projectType: ProjectType;
  message: string;
  phone?: string;
  location?: string;
  companyName?: string;
  website?: string;
};

export type ValidationResult =
  | { success: true; data: EnquiryInput }
  | { success: false; fieldErrors: Record<string, string> };

const allowedFields = new Set([
  "fullName", "email", "projectType", "message", "phone", "location", "companyName", "website",
]);

function normalizeSingleLine(value: string) {
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
}

function hasInvalidControls(value: string) {
  return /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value);
}

export function isValidEmail(value: string) {
  return value.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
}

export function validateEnquiry(value: unknown): ValidationResult {
  const fieldErrors: Record<string, string> = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { success: false, fieldErrors: { form: "Enter your enquiry details and try again." } };
  }

  const raw = value as Record<string, unknown>;
  if (Object.keys(raw).some((key) => !allowedFields.has(key))) {
    return { success: false, fieldErrors: { form: "The request contains unsupported fields." } };
  }

  const getText = (key: keyof EnquiryInput, max: number, required = false) => {
    const item = raw[key];
    if (item === undefined && !required) return "";
    if (typeof item !== "string") {
      fieldErrors[key] = "Enter a valid text value.";
      return "";
    }
    if (item.length > max) {
      fieldErrors[key] = `Use no more than ${max} characters.`;
      return "";
    }
    if (hasInvalidControls(item)) {
      fieldErrors[key] = "Remove unsupported control characters.";
      return "";
    }
    return item;
  };

  const fullName = normalizeSingleLine(getText("fullName", 120, true));
  const email = normalizeSingleLine(getText("email", 254, true)).toLowerCase();
  const projectType = normalizeSingleLine(getText("projectType", 64, true));
  const rawMessage = getText("message", 5000, true).replace(/\r\n?/g, "\n").trim();
  const phone = normalizeSingleLine(getText("phone", 40));
  const location = normalizeSingleLine(getText("location", 120));
  const companyName = normalizeSingleLine(getText("companyName", 160));
  const website = normalizeSingleLine(getText("website", 200));

  if (!fullName && !fieldErrors.fullName) fieldErrors.fullName = "Enter your name.";
  if (!isValidEmail(email) && !fieldErrors.email) fieldErrors.email = "Enter a valid email address.";
  if (!PROJECT_TYPES.includes(projectType as ProjectType) && !fieldErrors.projectType) fieldErrors.projectType = "Choose a listed project type.";
  if (rawMessage.length < 5 && !fieldErrors.message) fieldErrors.message = "Add at least 5 characters about the project.";

  if (Object.keys(fieldErrors).length) return { success: false, fieldErrors };

  return {
    success: true,
    data: {
      fullName,
      email,
      projectType: projectType as ProjectType,
      message: rawMessage,
      ...(phone ? { phone } : {}),
      ...(location ? { location } : {}),
      ...(companyName ? { companyName } : {}),
      ...(website ? { website } : {}),
    },
  };
}

export type EnquiryEmail = { subject: string; text: string; html: string };

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]!);
}

export function createEnquiryEmail(input: EnquiryInput, reference: string, submittedAt: Date): EnquiryEmail {
  const fields: [string, string][] = [
    ["Enquiry reference", reference],
    ["Submitted (UTC)", submittedAt.toISOString()],
    ["Customer name", input.fullName],
    ["Customer email", input.email],
    ...(input.phone ? [["Customer phone", input.phone] as [string, string]] : []),
    ["Project type", input.projectType],
    ...(input.location ? [["Project location", input.location] as [string, string]] : []),
    ...(input.companyName ? [["Company name", input.companyName] as [string, string]] : []),
  ];
  const text = [...fields.map(([label, content]) => `${label}: ${content}`), "", "Project requirements:", input.message].join("\n");
  const rows = fields.map(([label, content]) => `<tr><th align="left" style="padding:6px 12px 6px 0">${escapeHtml(label)}</th><td style="padding:6px 0">${escapeHtml(content)}</td></tr>`).join("");
  const html = `<div style="font-family:Arial,sans-serif;color:#1c1c1c"><h1 style="font-size:20px">Website project enquiry</h1><table>${rows}</table><h2 style="font-size:16px">Project requirements</h2><p style="white-space:pre-wrap">${escapeHtml(input.message)}</p></div>`;
  return { subject: `Website project enquiry · ${reference}`, text, html };
}
