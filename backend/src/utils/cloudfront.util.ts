export function imageKeyToUrl(key: string | null | undefined, domain: string): string | null {
  if (!key) return null;
  return `https://${domain}/${key}`;
}
