// Cloudflare Pages Function: GET /healthz
export async function onRequestGet() {
  return new Response(JSON.stringify({ status: "ok", app: "Ensign Connect Navigator", platform: "cloudflare-pages" }), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}
