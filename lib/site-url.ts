function normalizeUrl(value: string) {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/$/, "");
}

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const preview = process.env.VERCEL_URL;

  if (explicit) return normalizeUrl(explicit);
  if (production) return normalizeUrl(production);
  if (preview) return normalizeUrl(preview);
  return "http://localhost:3000";
}
