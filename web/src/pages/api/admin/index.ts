export const prerender = false;
export function GET() { return new Response(JSON.stringify({ ok: false, error: 'admin-auth-not-configured' }), { status: 403, headers: { 'content-type': 'application/json; charset=utf-8' } }); }
