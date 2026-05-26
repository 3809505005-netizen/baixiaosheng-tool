export async function onRequestPost({ request, env }) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  const API_KEY = env.API_KEY;
  const API_SECRET = env.API_SECRET;

  if (!API_KEY || !API_SECRET) {
    return new Response(JSON.stringify({ code: 500, msg: "API密钥未配置" }), { status: 500, headers });
  }

  try {
    const { url } = await request.json();
    const response = await fetch(`https://api.anytocopy.com/vip/open-api/v1/video/extract?workUrl=${encodeURIComponent(url)}&taskType=TEXT`, {
      method: "POST",
      headers: { "X-API-Key": API_KEY, "X-API-Secret": API_SECRET }
    });
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200, headers });
  } catch (error) {
    return new Response(JSON.stringify({ code: 500, msg: error.message }), { status: 500, headers });
  }
}

export async function onRequestGet({ request, env }) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  const API_KEY = env.API_KEY;
  const API_SECRET = env.API_SECRET;

  if (!API_KEY || !API_SECRET) {
    return new Response(JSON.stringify({ code: 500, msg: "API密钥未配置" }), { status: 500, headers });
  }

  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get("taskId");

  if (!taskId) {
    return new Response(JSON.stringify({ code: 400, msg: "缺少taskId参数" }), { status: 400, headers });
  }

  try {
    const response = await fetch(`https://api.anytocopy.com/vip/open-api/v1/video/query?taskId=${taskId}`, {
      headers: { "X-API-Key": API_KEY, "X-API-Secret": API_SECRET }
    });
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200, headers });
  } catch (error) {
    return new Response(JSON.stringify({ code: 500, msg: error.message }), { status: 500, headers });
  }
}
