import { resourceDetail, directoryReturnPath, escapeHtml } from './resource-directory.mjs';
/** Fill the built shell with the current public record, never the historical snapshot.
 * @param {string} template @param {import('../types').Resource} resource
 * @param {import('../types').Category[]} categories @param {URL} url */
export function renderDetailDocument(template, resource, categories, url) {
  const section = /<section\b[^>]*\bdata-detail(?:="[^"]*")?[^>]*>[\s\S]*?<\/section>/;
  if (!section.test(template)) throw Error('Detail template is missing');
  const e = escapeHtml;
  const title = resource.titleZh + ' · Deutsch Lernen';
  const canonical = new URL(`/resource/${resource.slug}/`, url.origin).href;
  const returnTo = directoryReturnPath(url.searchParams.get('from'));
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: resource.descriptionZh,
    url: canonical,
    isPartOf: { '@type': 'WebSite', name: 'Deutsch Lernen', url: new URL('/', url.origin).href },
  }).replace(/</g, '\\u003c');
  return template.replace(section, () => `<section class="live-detail" data-detail data-server-rendered="true" data-resource-id="${e(resource.id)}">${resourceDetail(resource, categories, returnTo)}</section>`)
    .replace(/<meta name="robots" content="noindex, follow"[^>]*>/, '')
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${e(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"[^>]*>/, () => `<meta name="description" content="${e(resource.descriptionZh)}">`)
    .replace(/<meta property="og:title" content="[^"]*"[^>]*>/, () => `<meta property="og:title" content="${e(title)}">`)
    .replace(/<meta property="og:description" content="[^"]*"[^>]*>/, () => `<meta property="og:description" content="${e(resource.descriptionZh)}">`)
    .replace(/<meta property="og:url" content="[^"]*"[^>]*>/, () => `<meta property="og:url" content="${e(canonical)}">`)
    .replace(/<meta property="og:image" content="[^"]*"[^>]*>/, () => `<meta property="og:image" content="${e(new URL('/og-directory.png', url.origin).href)}">`)
    .replace(/<meta name="twitter:image" content="[^"]*"[^>]*>/, () => `<meta name="twitter:image" content="${e(new URL('/og-directory.png', url.origin).href)}">`)
    .replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/, () => `<script type="application/ld+json">${structuredData}</script>`)
    .replace(/<link rel="canonical" href="[^"]*"[^>]*>/, () => `<link rel="canonical" href="${e(canonical)}">`);
}
