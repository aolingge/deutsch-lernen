export const prerender = false;
const denied = () => new Response(JSON.stringify({ ok: false, error: 'admin-auth-not-configured' }), { status: 403, headers: { 'content-type': 'application/json; charset=utf-8' } });
export function GET() { return denied(); }
export function POST() { return denied(); }
