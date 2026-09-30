export function GET() { return new Response(JSON.stringify({ ok: true, service: 'deutsch-lernen-resource-hub' }), { headers: { 'content-type': 'application/json; charset=utf-8' } }); }
