// Cloudflare Pages Functions API route for Podia LMS
// Provides serverless REST endpoints connected to Cloudflare D1 (Free Tier)

interface Env {
  DB?: any; // Cloudflare D1 Database binding
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check endpoint
  if (path === '/api/health') {
    return new Response(
      JSON.stringify({
        status: 'healthy',
        cloudflare: true,
        d1_configured: !!env.DB,
        timestamp: new Date().toISOString(),
      }),
      { headers: corsHeaders }
    );
  }

  // If D1 is not bound, return graceful fallback note
  if (!env.DB) {
    return new Response(
      JSON.stringify({
        message: 'LMS funcionando en modo Cloudflare Pages estático (LocalStorage). Para activar persistencia global en base de datos D1, vincula tu base de datos en Cloudflare Dashboard.',
      }),
      { headers: corsHeaders }
    );
  }

  // D1 Courses queries
  try {
    if (path === '/api/courses' && request.method === 'GET') {
      const { results } = await env.DB.prepare('SELECT * FROM courses WHERE is_published = 1 ORDER BY created_at DESC').all();
      return new Response(JSON.stringify(results), { headers: corsHeaders });
    }

    return new Response(JSON.stringify({ error: 'Endpoint no encontrado' }), {
      status: 404,
      headers: corsHeaders,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};
