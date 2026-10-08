import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createEnquiryHandler } from "../src/lib/enquiries/handler.ts";
import { createEnquiryEmail, MAX_REQUEST_BYTES, validateEnquiry } from "../src/lib/enquiries/validation.ts";
import { companyAboutProfile, cqetPrinciples, directoryProjects, projects, services } from "../src/data/company-profile.ts";
import { aboutPage } from "../src/data/about-page.ts";
import { filterProjectCards } from "../src/lib/projects/filtering.ts";
import { getConceptGalleryAssets } from "../src/lib/concept-gallery.ts";
import { getFrameIndex, getFrameNeighborhood, getSequenceMode, shouldUseStaticExperience } from "../src/lib/cinematic/frame-utils.ts";
import { getSiteOrigin } from "../src/lib/site-origin.ts";
import { createPageMetadata } from "../src/lib/page-metadata.ts";
import { getEnquiryConfig } from "../src/lib/enquiries/config.ts";
import nextConfig from "../next.config.ts";
import { serviceImagery } from "../src/data/service-imagery.ts";
import { homepage, homepageFeaturedProjects, homepageHeroStages, homepagePrinciples, homepageServiceSelections, homepageTransformationSlugs } from "../src/data/homepage.ts";
import { getPreviewIndex, previewSelectionReducer } from "../src/lib/motion/use-preview-selection.ts";

const config = {
  resendApiKey: "test-key",
  fromEmail: "AR Interior Group <enquiries@example.test>",
  toEmail: "facilities@arinteriorgroup.com",
  siteOrigin: "https://site.example.test",
  upstashUrl: "https://redis.example.test",
  upstashToken: "test-token",
  trustedIpHeader: "x-real-ip",
};

const payload = {
  fullName: "  Asha  Rao ",
  email: "ASHA@example.com",
  projectType: "Office / workplace fit-out",
  message: "Planning a new office interior.",
};

function dependencies(overrides = {}) {
  const reserved = new Set();
  const sent = [];
  const deps = {
    config,
    protection: {
      consume: async () => ({ allowed: true, retryAfterSeconds: 900 }),
      reserve: async (key) => {
        if (reserved.has(key)) return false;
        reserved.add(key);
        return true;
      },
      complete: async () => {},
      release: async (key) => reserved.delete(key),
    },
    sendEmail: async (email, replyTo) => sent.push({ email, replyTo }),
    now: () => new Date("2026-10-03T12:00:00.000Z"),
    createReference: () => "reference-123",
    ...overrides,
  };
  return { deps, sent };
}

function request(body = payload, overrides = {}) {
  const headers = new Headers({
    origin: config.siteOrigin,
    "content-type": "application/json",
    "idempotency-key": "0cc7f85d-6c2c-4fcf-a3cc-bfef0fd52fb5",
    "x-real-ip": "203.0.113.10",
    ...overrides.headers,
  });
  return new Request("https://site.example.test/api/enquiries", {
    method: "POST",
    headers,
    body: overrides.rawBody ?? JSON.stringify(body),
  });
}

test("valid enquiry is normalized and returns provider-accepted reference", async () => {
  const { deps, sent } = dependencies();
  const response = await createEnquiryHandler(deps)(request());
  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { status: "accepted", reference: "reference-123" });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].replyTo, "asha@example.com");
  assert.match(sent[0].email.text, /Customer name: Asha Rao/);
});

test("invalid email and missing required fields are rejected", async () => {
  const invalidEmail = validateEnquiry({ ...payload, email: "not-an-email" });
  assert.equal(invalidEmail.success, false);
  assert.ok(invalidEmail.fieldErrors.email);
  const missing = validateEnquiry({ email: "x@example.com" });
  assert.equal(missing.success, false);
  assert.ok(missing.fieldErrors.fullName);
  assert.ok(missing.fieldErrors.projectType);
  assert.ok(missing.fieldErrors.message);
});

test("unsupported project types and unexpected fields are rejected", async () => {
  const unsupported = await createEnquiryHandler(dependencies().deps)(request({ ...payload, projectType: "Something else" }));
  assert.equal(unsupported.status, 422);
  const unexpected = await createEnquiryHandler(dependencies().deps)(request({ ...payload, recipient: "attacker@example.test" }));
  assert.equal(unexpected.status, 422);
});

test("oversized request bodies are rejected before parsing", async () => {
  const large = { ...payload, message: "x".repeat(MAX_REQUEST_BYTES + 100) };
  const response = await createEnquiryHandler(dependencies().deps)(request(large));
  assert.equal(response.status, 413);
});

test("rate-limited requests do not reserve or send an enquiry", async () => {
  const { deps, sent } = dependencies({ protection: {
    consume: async () => ({ allowed: false, retryAfterSeconds: 321 }),
    reserve: async () => assert.fail("should not reserve"),
    complete: async () => {},
    release: async () => {},
  } });
  const response = await createEnquiryHandler(deps)(request());
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "321");
  assert.equal(sent.length, 0);
});

test("honeypot submissions are rejected without sending", async () => {
  const { deps, sent } = dependencies();
  const response = await createEnquiryHandler(deps)(request({ ...payload, website: "spam" }));
  assert.equal(response.status, 400);
  assert.equal(sent.length, 0);
});

test("provider failure returns an error and preserves retry eligibility", async () => {
  let released = 0;
  const { deps, sent } = dependencies({
    sendEmail: async () => { throw new Error("provider detail must not be returned"); },
    protection: {
      consume: async () => ({ allowed: true, retryAfterSeconds: 900 }),
      reserve: async () => true,
      complete: async () => {},
      release: async () => { released += 1; },
    },
  });
  const response = await createEnquiryHandler(deps)(request());
  assert.equal(response.status, 502);
  assert.doesNotMatch(await response.text(), /provider detail|test-key/);
  assert.equal(released, 1);
  assert.equal(sent.length, 0);
});

test("missing configuration fails closed without a simulated success", async () => {
  const { deps, sent } = dependencies({ config: null, protection: null });
  const response = await createEnquiryHandler(deps)(request());
  assert.equal(response.status, 503);
  assert.equal((await response.json()).status, undefined);
  assert.equal(sent.length, 0);
});

test("email HTML escapes user content and uses a fixed subject", () => {
  const valid = validateEnquiry({ ...payload, message: "<script>alert('x')</script>" });
  assert.equal(valid.success, true);
  const email = createEnquiryEmail(valid.data, "ref", new Date("2026-10-03T12:00:00.000Z"));
  assert.match(email.html, /&lt;script&gt;/);
  assert.doesNotMatch(email.html, /<script>/);
  assert.equal(email.subject, "Website project enquiry · ref");
});

test("duplicate submissions with the same idempotency key are sent once", async () => {
  const { deps, sent } = dependencies();
  const handle = createEnquiryHandler(deps);
  const first = await handle(request());
  const repeated = await handle(request());
  assert.equal(first.status, 202);
  assert.equal(repeated.status, 409);
  assert.equal(sent.length, 1);
});

test("concurrent duplicate submissions reserve and send only once", async () => {
  const { deps, sent } = dependencies();
  const handle = createEnquiryHandler(deps);
  const responses = await Promise.all([handle(request()), handle(request())]);
  assert.deepEqual(responses.map(({ status }) => status).sort(), [202, 409]);
  assert.equal(sent.length, 1);
});

test("malformed JSON and an untrusted origin are rejected", async () => {
  const handle = createEnquiryHandler(dependencies().deps);
  const malformed = await handle(request(undefined, { rawBody: "{" }));
  assert.equal(malformed.status, 400);
  const wrongOrigin = await handle(request(payload, { headers: { origin: "https://attacker.test" } }));
  assert.equal(wrongOrigin.status, 403);
});

test("project and service data match manifest assets and valid internal references", () => {
  const manifest = JSON.parse(readFileSync(resolve("src/data/project-image-manifest.json"), "utf8"));
  assert.equal(directoryProjects.length, 19);
  assert.equal(projects.length, 20);
  assert.equal(new Set(projects.map((project) => project.slug)).size, projects.length);
  for (const project of projects) {
    assert.deepEqual(project.images, manifest.projects[project.slug] ?? []);
    assert.deepEqual(project.sourcePages.length > 0, true);
    if (project.entryKind === "short-reference") {
      assert.equal(project.images.length, 0, `${project.slug} must remain text-only`);
      assert.deepEqual(project.sourcePages, [8]);
    } else assert.ok(project.images.length > 0, `${project.slug} has images`);
    for (const asset of project.images) {
      assert.equal(asset.classification, "project_portfolio_photo");
      assert.ok(existsSync(resolve(asset.path)), `missing image ${asset.path}`);
    }
  }
  assert.deepEqual(directoryProjects.filter(({ entryKind }) => entryKind === "short-reference").map(({ title, location }) => [title, location]), [
    ["Narayana Institute of Cardiac Sciences", "Bommasandra"],
    ["Shell India Markets Private Limited", "Bengaluru"],
    ["L&T Tech Park", "Hebbal, Bengaluru"],
    ["Accenture Services Pvt Ltd", "Mumbai"],
    ["Wells Fargo India Private Limited", "Hyderabad · Bengaluru"],
  ]);
  assert.equal(directoryProjects.some(({ slug }) => slug === "furniture-assembly"), false);
  assert.equal(projects.find(({ slug }) => slug === "furniture-assembly")?.entryKind, "service-example");
  assert.equal(services.length, 10);
  assert.equal(new Set(services.map((service) => service.slug)).size, services.length);
  for (const service of services) {
    assert.ok(service.sourcePage > 0 && service.sourcePage <= 63);
    for (const relatedSlug of service.relatedProjectSlugs ?? []) assert.ok(projects.some(({ slug }) => slug === relatedSlug));
  }
  assert.equal(new Set(manifest.concept_designs.map((asset) => asset.pdf_xref)).size, 14);
  const galleryAssets = getConceptGalleryAssets(manifest.concept_designs);
  assert.equal(galleryAssets.length, 9);
  assert.ok(galleryAssets.every(({ path }) => !/design-p(?:43-img649|44-img662|45-img672|47-img672|48-img689|49-img703)\.webp$/.test(path)));
  for (const asset of manifest.concept_designs) {
    assert.equal(asset.classification, "architectural_design_render");
    assert.ok(existsSync(resolve(asset.path)), `missing concept image ${asset.path}`);
    assert.ok(existsSync(resolve(asset.path.replace(/\.webp$/, "-thumb.webp"))), `missing concept thumbnail ${asset.path}`);
  }
  for (const mode of ["desktop", "mobile"]) {
    const count = mode === "desktop" ? 96 : 60;
    for (let index = 1; index <= count; index += 1) {
      const frame = `public/cinematic/${mode}/frame-${String(index).padStart(4, "0")}.webp`;
      assert.ok(existsSync(resolve(frame)), `missing cinematic frame ${frame}`);
    }
    assert.ok(existsSync(resolve(`public/cinematic/poster-${mode}.webp`)), `missing ${mode} poster`);
  }
});

test("the requested worker photograph is excluded from public assets while its provenance is retained", () => {
  const manifest = JSON.parse(readFileSync(resolve("src/data/project-image-manifest.json"), "utf8"));
  const excluded = manifest.excluded_publication.find(({ pdf_xref }) => pdf_xref === 527);
  assert.ok(excluded);
  assert.equal(excluded.page, 32);
  assert.equal(excluded.status, "excluded_from_publication");
  assert.match(excluded.reason, /orange high-visibility vest and yellow hard hat/);
  assert.equal(manifest.projects["airtel-pune"].some(({ pdf_xref }) => pdf_xref === 527), false);
  assert.equal(existsSync(resolve(excluded.source_path)), false);
  assert.equal(existsSync(resolve(excluded.source_thumbnail)), false);

  const visitorFiles = [
    "src/app/page.tsx",
    "src/app/about/page.tsx",
    "src/app/clients/page.tsx",
    "src/app/contact/page.tsx",
    "src/app/projects/page.tsx",
    "src/app/projects/[slug]/page.tsx",
    "src/app/services/page.tsx",
    "src/app/services/[slug]/page.tsx",
    "src/components/editorial-contact-cta.tsx",
    "src/components/project-gallery.tsx",
    "src/components/project-transformations.tsx",
    "src/components/process-showcase.tsx",
  ];
  const visitorCode = visitorFiles.map((path) => readFileSync(resolve(path), "utf8")).join("\n");
  assert.doesNotMatch(visitorCode, /(?:Source\s+p\.|source\s+p\.|source profile\s+p\.|portfolio photograph\s*[·-]\s*p\.|p\.\s*\{(?:image|asset|cover|visual)\.page)/i);
  assert.doesNotMatch(visitorCode, /projects\/airtel-pune\/p32-img527(?:-thumb)?\.webp/);
  assert.doesNotMatch(visitorCode, /source page|source-labeled|profile\s+p\.|company work profile/i, "visitor-facing copy does not expose internal asset provenance");
});

test("project filters cover the intended categories without mutating source data", () => {
  const cards = [
    { slug: "market", category: "Micro-markets & kiosks", entryKind: "short-reference", hasBeforeAfter: false },
    { slug: "change", category: "Workplace & fit-outs", entryKind: "photographed-case-study", hasBeforeAfter: true },
    { slug: "sofa", category: "Furniture assembly", entryKind: "photographed-case-study", hasBeforeAfter: false },
  ];
  assert.deepEqual(filterProjectCards(cards, "All projects").map(({ slug }) => slug), ["market", "change", "sofa"]);
  assert.deepEqual(filterProjectCards(cards, "Before & after").map(({ slug }) => slug), ["change"]);
  assert.deepEqual(filterProjectCards(cards, "Micro-markets & kiosks").map(({ slug }) => slug), ["market"]);
  assert.deepEqual(filterProjectCards(cards, "Short references").map(({ slug }) => slug), ["market"]);
  assert.deepEqual(filterProjectCards(cards, "Photographed case studies").map(({ slug }) => slug), ["change", "sofa"]);
  assert.deepEqual(filterProjectCards(cards, "Workplace & fit-outs").map(({ slug }) => slug), ["change"]);
  assert.equal(cards.length, 3);
});

test("homepage transformation showcase routes to the complete project directory", () => {
  const transformation = readFileSync(resolve("src/components/project-transformations.tsx"), "utf8");
  assert.equal(homepage.transformations.action.href, "/projects");
  assert.equal(homepage.transformations.action.label, "View All Projects");
  assert.match(transformation, /homepage\.transformations\.action\.href/);
  assert.doesNotMatch(transformation, /href=\{`\/projects\/\$\{project\.slug\}`\}/);
  assert.deepEqual(homepageTransformationSlugs, JSON.parse(readFileSync(resolve("src/data/transformation-manifest.json"), "utf8")).map(({ slug }) => slug));
  assert.equal(homepageFeaturedProjects.every(({ slug }) => !homepageTransformationSlugs.includes(slug)), true);
  for (const selection of homepageServiceSelections) assert.ok(services.some(({ slug }) => slug === selection.slug));
  assert.equal(homepageServiceSelections.every(({ description }) => description.trim().length > 0), true);
});

test("homepage service showcase keeps verified images and source-accurate text-led services", () => {
  assert.equal(homepageServiceSelections.length, 7);
  const textLedSlugs = ["railing-structures"];
  for (const selection of homepageServiceSelections) {
    if (!("image" in selection)) {
      assert.ok(textLedSlugs.includes(selection.slug));
      continue;
    }
    const project = projects.find(({ slug }) => slug === selection.image.slug);
    const asset = project?.images[selection.image.index];
    assert.ok(asset, `Missing manifest image for homepage service ${selection.slug}`);
    const assetPath = resolve(asset.path);
    assert.equal(existsSync(assetPath), true, `Missing homepage service image for ${selection.slug}: ${assetPath}`);
    assert.match(asset.path, /^public\/projects\//);
  }
  assert.deepEqual(homepageServiceSelections.filter((selection) => !("image" in selection)).map(({ slug }) => slug), textLedSlugs);
  const imageForService = (slug) => {
    const selection = homepageServiceSelections.find((item) => item.slug === slug);
    assert.ok(selection && "image" in selection);
    return projects.find(({ slug: projectSlug }) => projectSlug === selection.image.slug)?.images[selection.image.index]?.path;
  };
  assert.equal(imageForService("civil-services"), "public/projects/mv-seals-gurgaon/p39-img599.webp");
  assert.equal(imageForService("plumbing-sanitary"), "public/projects/technip-energies-noida/p28-img488.webp");

  const showcase = readFileSync(resolve("src/components/homepage-service-showcase.tsx"), "utf8");
  const portfolioImage = readFileSync(resolve("src/components/homepage-portfolio-image.tsx"), "utf8");
  const css = readFileSync(resolve("src/app/homepage.css"), "utf8");
  assert.match(showcase, /loading=\{previewed\.slug === service\.slug \? "eager" : "lazy"\}/);
  assert.match(showcase, /data-active=\{visibleImage\?\.slug === service\.slug/);
  assert.match(showcase, /aria-hidden=\{visibleImage\?\.slug !== service\.slug\}/);
  assert.doesNotMatch(showcase, /onMouseEnter=\{\(\) => selectService/);
  assert.match(showcase, /role="img" aria-label=\{`\$\{previewed\.title\}: \$\{previewed\.description\}`\}/);
  assert.match(portfolioImage, /loading = "lazy"/);
  assert.match(css, /home-service-image-layer\[data-active="true"\] \{ opacity: 1; \}/);
});

test("shared preview selection keeps hover and focus temporary while click locks selection", () => {
  let state = { selectedIndex: 0, hoveredIndex: null, focusedIndex: null };
  state = previewSelectionReducer(state, { type: "hover", index: 1 });
  assert.equal(getPreviewIndex(state), 1);
  assert.equal(state.selectedIndex, 0);
  state = previewSelectionReducer(state, { type: "leave", index: 1 });
  assert.equal(getPreviewIndex(state), 0);
  state = previewSelectionReducer(state, { type: "select", index: 3 });
  state = previewSelectionReducer(state, { type: "hover", index: 6 });
  assert.equal(getPreviewIndex(state), 6);
  state = previewSelectionReducer(state, { type: "leave", index: 6 });
  assert.equal(getPreviewIndex(state), 3);
  state = previewSelectionReducer(state, { type: "focus", index: 2 });
  assert.equal(getPreviewIndex(state), 2);
  state = previewSelectionReducer(state, { type: "blur", index: 2 });
  assert.equal(getPreviewIndex(state), 3);
  state = previewSelectionReducer(state, { type: "select", index: 6 });
  assert.equal(getPreviewIndex(state), 6);
  state = previewSelectionReducer(state, { type: "hover", index: 1 });
  state = previewSelectionReducer(state, { type: "focus", index: 4 });
  assert.equal(getPreviewIndex(state), 4, "keyboard focus previews and clears the stale pointer hover");
  state = previewSelectionReducer(state, { type: "hover", index: 2 });
  assert.equal(getPreviewIndex(state), 2, "a newer pointer interaction supersedes the keyboard preview");
  state = previewSelectionReducer(state, { type: "leave", index: 2 });
  assert.equal(getPreviewIndex(state), 6, "pointer leave returns to the permanent selection");
  state = previewSelectionReducer(state, { type: "focus", index: 4 });
  state = previewSelectionReducer(state, { type: "blur", index: 4 });
  assert.equal(getPreviewIndex(state), 6, "keyboard blur returns to the permanent selection");
});

test("homepage business copy and CQET wording match the supplied profile", () => {
  assert.equal(`${homepage.hero.heading} ${homepage.hero.emphasis}`, "Experts in Space Planning and Design & Build Projects.");
  assert.equal(homepage.hero.disclosure, "Where Visionary Designs Meet Practical Solutions.");
  assert.equal(homepage.about.title, "About Us");
  assert.equal(homepage.about.description, "Founded in 2019, A R Interior Group provides turnkey fit-out solutions nationwide. The team brings expertise in project management and execution, taking projects from planning through completion.");
  assert.equal(homepage.principles.title, "Success Mantra “C.Q.E.T”");
  assert.deepEqual(homepagePrinciples.map(({ title }) => title), ["Consistency", "Quality", "Economical", "Time Efficiency"]);
  assert.deepEqual(homepagePrinciples.map(({ description }) => description), [
    "Consistent innovation and attention to details are the cornerstones of our interior design success.",
    "Uncompromising quality in design and execution is the foundation of our success.",
    "Delivering exceptional design solutions that blend creativity with cost-efficiency.",
    "On-time delivery without compromising quality, making every project a timely success.",
  ]);
  assert.deepEqual(homepageHeroStages.map(({ label }) => label), [
    "Experts in Space Planning",
    "Design & Build Projects",
    "Where Visionary Designs Meet Practical Solutions.",
    "Rapid growing space planning organization",
  ]);
});

test("About page uses profile-backed company statements and authentic portfolio imagery", () => {
  assert.equal(aboutPage.foundingYear, "2019");
  assert.equal(aboutPage.introduction, companyAboutProfile.positioning);
  assert.deepEqual(aboutPage.story, companyAboutProfile.story);
  assert.equal(aboutPage.storyMission.includes("standards of living"), true);
  assert.equal(aboutPage.strength.roles.length, 7);
  assert.equal(aboutPage.statements.length, 4);
  assert.deepEqual(cqetPrinciples.map(({ title }) => title), ["Consistency", "Quality", "Economical", "Time Efficiency"]);
  assert.ok(cqetPrinciples.every(({ description }) => description.length > 40));
  const visuals = [aboutPage.heroVisual, aboutPage.processImage, ...aboutPage.storyVisuals,
    ...aboutPage.statements.map(({ image }) => image), ...aboutPage.principles.images,
    ...aboutPage.selectedProjects.map(({ image }) => image), aboutPage.contactVisual];
  for (const visual of visuals) {
    assert.ok(existsSync(resolve("public", visual.src.replace(/^\//, ""))), `missing About image ${visual.src}`);
    assert.ok(visual.project.slug);
  }
  assert.ok(aboutPage.closingExcerpt.startsWith("We are committed to delivering exceptional interior design solutions"));
});

test("client logos and transformation pairs are authentic, source-mapped, and permission-aware", () => {
  const logos = JSON.parse(readFileSync(resolve("src/data/client-logo-manifest.json"), "utf8"));
  assert.equal(logos.length, 35);
  assert.equal(new Set(logos.map(({ name }) => name)).size, logos.length);
  assert.equal(logos.some(({ name }) => name === "GBU"), false, "a building photograph is not published as a logo");
  for (const logo of logos) {
    assert.ok([3, 4, 5].includes(logo.sourcePage));
    assert.equal(logo.publicationApproval, "unconfirmed");
    assert.ok(logo.alt && logo.width > 0 && logo.height > 0);
    assert.ok(existsSync(resolve(`public${logo.image}`)), `missing logo ${logo.image}`);
  }
  const pairs = JSON.parse(readFileSync(resolve("src/data/transformation-manifest.json"), "utf8"));
  assert.deepEqual(pairs.map(({ slug }) => slug), ["tata-electronics-tamil-nadu", "ltimindtree-whitefield", "jcb-jaipur", "pb-health-gurgaon", "mv-seals-gurgaon"]);
  const transformationComponent = readFileSync(resolve("src/components/project-transformations.tsx"), "utf8");
  const transformationStyles = readFileSync(resolve("src/app/globals.css"), "utf8");
  assert.match(transformationComponent, /data-active=\{previewIndex === index\}/);
  assert.match(transformationComponent, /\{\.\.\.handlers\(index\)\}/);
  assert.match(transformationComponent, /onError=\{\(\) => setFailedImages/);
  assert.match(transformationComponent, /This photograph is currently unavailable\./);
  assert.match(transformationStyles, /\.transform-image-layer \{ position: absolute; inset: 0;/);
  for (const pair of pairs) {
    assert.equal(pair.before.label, "Before");
    assert.equal(pair.after.label, "After");
    assert.equal(pair.viewpointsAligned, false);
    assert.equal(pair.publicationApproval, "unconfirmed");
    assert.ok(existsSync(resolve(pair.before.path)), `missing before image for ${pair.slug}`);
    assert.ok(existsSync(resolve(pair.after.path)), `missing after image for ${pair.slug}`);
    assert.ok(pair.before.sourcePages.length && pair.after.sourcePages.length);
  }
  const ltim = projects.find(({ slug }) => slug === "ltimindtree-whitefield");
  assert.equal(ltim.comparison?.before.page, 15);
  assert.equal(ltim.comparison?.after.page, 15);
});

test("service visual references resolve locally and are not third-party stock assets", () => {
  for (const [slug, visual] of Object.entries(serviceImagery)) {
    assert.ok(services.some((service) => service.slug === slug));
    assert.ok(visual.path.startsWith("public/projects/") || visual.path.startsWith("public/service-profile/"));
    assert.ok(existsSync(resolve(visual.path)), `missing service visual ${visual.path}`);
    assert.ok(visual.label && visual.page > 0 && visual.width > 0 && visual.height > 0);
  }
  const overviewSlugs = ["micro-markets-kiosks", "civil-services", "furniture-working-desks", "alloy-wooden-partitions", "flooring-ceiling-solutions", "plumbing-sanitary", "railing-structures"];
  const serviceDataSource = readFileSync(resolve("src/data/services.ts"), "utf8");
  assert.match(serviceDataSource, /const overviewSlugs = \["micro-markets-kiosks", "civil-services", "furniture-working-desks", "alloy-wooden-partitions", "flooring-ceiling-solutions", "plumbing-sanitary", "railing-structures"\]/);
  const overviewVisuals = overviewSlugs.map((slug) => serviceImagery[slug]);
  assert.ok(overviewVisuals.every(Boolean), "every service overview has a visual mapping");
  assert.equal(new Set(overviewVisuals.map(({ path }) => path)).size, overviewSlugs.length, "each service uses a distinct source visual");
  for (const visual of overviewVisuals) {
    assert.ok(visual.path.startsWith("public/service-profile/"));
    assert.match(visual.label, /illustration/i, "profile page imagery is identified as service illustration, not completed-project evidence");
  }
  const pageSource = readFileSync(resolve("src/app/page.tsx"), "utf8");
  assert.doesNotMatch(pageSource, /A considered comparison|Comparison imagery · review in progress|We are reviewing the source images/);
  assert.match(pageSource, /<ContactSection/);
  assert.match(pageSource, /<AboutSection/);
  assert.match(pageSource, /<ServicesSection/);
  assert.match(pageSource, /<ClientsSection/);
  assert.match(pageSource, /<ProjectsSection/);
  assert.match(pageSource, /<OfficesSection/);
  const contactCta = readFileSync(resolve("src/components/homepage-contact-cta.tsx"), "utf8");
  assert.match(contactCta, /ContactEnquiryLink/);
  assert.equal(homepage.contact.action.href, "/contact#enquiry-form");
  assert.equal(homepage.contact.action.label, "Discuss Your Space");
  assert.doesNotMatch(contactCta, /p32-img527/);
});

test("cinematic frame selection clamps scroll, switches compositions, and prioritizes nearby frames", () => {
  assert.equal(getSequenceMode(360), "mobile");
  assert.equal(getSequenceMode(767), "mobile");
  assert.equal(getSequenceMode(768), "desktop");
  assert.equal(getFrameIndex(-0.2, 96), 0);
  assert.equal(getFrameIndex(0.5, 96), 48);
  assert.equal(getFrameIndex(1.2, 60), 59);
  assert.equal(getFrameIndex(Number.NaN, 60), 0);
  assert.equal(shouldUseStaticExperience(true, false), true);
  assert.equal(shouldUseStaticExperience(false, true), true);
  assert.equal(shouldUseStaticExperience(false, false), false);
  assert.deepEqual(getFrameNeighborhood(0, 4), [0, 1, 2, 3]);
  assert.deepEqual(getFrameNeighborhood(2, 4), [2, 3, 1, 0]);
  assert.deepEqual(getFrameNeighborhood(100, 4), [3, 2, 1, 0]);
});

test("site origin rejects unsafe or malformed values and metadata avoids invented canonicals", () => {
  assert.equal(getSiteOrigin(undefined), null);
  assert.equal(getSiteOrigin("https://arinteriorgroup.example/"), "https://arinteriorgroup.example");
  assert.equal(getSiteOrigin("http://localhost:3000"), "http://localhost:3000");
  for (const value of ["not-a-url", "http://arinteriorgroup.example", "https://example.test/path", "https://user:pass@example.test", "https://example.test/?q=x"]) {
    assert.equal(getSiteOrigin(value), null, `reject ${value}`);
  }
  const withoutOrigin = createPageMetadata("Projects", "Portfolio", "/projects", null);
  assert.equal(withoutOrigin.alternates, undefined);
  assert.equal(withoutOrigin.openGraph.url, undefined);
  const withOrigin = createPageMetadata("Projects", "Portfolio", "/projects", "https://arinteriorgroup.example");
  assert.equal(withOrigin.alternates.canonical, "https://arinteriorgroup.example/projects");
  assert.equal(withOrigin.openGraph.url, "https://arinteriorgroup.example/projects");
  assert.equal(withOrigin.openGraph.images[0].url, "https://arinteriorgroup.example/cinematic/poster-desktop.webp");
  assert.equal(existsSync(resolve("public/cinematic/poster-desktop.webp")), true);
});

test("production enquiry configuration requires every server-side integration and a valid trusted IP header", () => {
  const env = {
    SITE_URL: "https://site.example.test",
    RESEND_API_KEY: "test-resend-key",
    ENQUIRY_FROM_EMAIL: "AR Interior Group <enquiries@example.test>",
    ENQUIRY_TO_EMAIL: "facilities@arinteriorgroup.com",
    UPSTASH_REDIS_REST_URL: "https://redis.example.test",
    UPSTASH_REDIS_REST_TOKEN: "test-upstash-token",
    ENQUIRY_TRUSTED_IP_HEADER: "x-real-ip",
  };
  assert.equal(getEnquiryConfig(env)?.siteOrigin, "https://site.example.test");
  for (const key of Object.keys(env)) {
    const incomplete = { ...env };
    delete incomplete[key];
    assert.equal(getEnquiryConfig(incomplete), null, `${key} is required; configuration fails closed`);
  }
  assert.equal(getEnquiryConfig({ ...env, ENQUIRY_TRUSTED_IP_HEADER: "x-forwarded-for" }), null);
});

test("Next.js sends baseline browser security headers on all routes", async () => {
  const rules = await nextConfig.headers();
  const values = Object.fromEntries(rules[0].headers.map(({ key, value }) => [key, value]));
  assert.equal(rules[0].source, "/:path*");
  assert.equal(values["X-Content-Type-Options"], "nosniff");
  assert.equal(values["Referrer-Policy"], "strict-origin-when-cross-origin");
  assert.equal(values["X-Frame-Options"], "DENY");
  assert.equal(values["Permissions-Policy"], "camera=(), microphone=(), geolocation=()");
});
