export const prerender = false;
import { categories, resources } from '../../data';
export function GET() { return new Response(JSON.stringify({ schemaVersion: 1, exportedAt: new Date().toISOString(), categories, resources: resources.filter((resource) => resource.status === 'published') }), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=300' } }); }
