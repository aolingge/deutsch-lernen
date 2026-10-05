import manifest from '../../data/site-icons.json' with { type: 'json' };

/** Resolve exact hosts only; new or unknown websites get a neutral icon. @param {string} url */
export function siteIconPath(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    const entry = /** @type {Record<string, {path: string}>} */ (manifest)[host];
    return entry && /^\/site-icons\/[a-z0-9.-]+\.png$/.test(entry.path) ? entry.path : '';
  } catch { return ''; }
}

/** Decorative brand identifier; the visible source name supplies the accessible label. @param {string} url */
export function siteIcon(url) {
  const path = siteIconPath(url);
  const fallback = '<svg class="source-icon-fallback" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6h14M5 18h14"/></svg>';
  return `<span class="source-mark${path ? ' has-site-icon' : ''}" aria-hidden="true">${fallback}${path ? `<img data-site-icon src="${path}" width="32" height="32" alt="" loading="lazy" decoding="async">` : ''}</span>`;
}
