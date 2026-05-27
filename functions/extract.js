export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { urls } = await request.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return new Response(JSON.stringify({ error: "请提供有效的视频链接" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 正确的Cloudflare环境变量读取方式
    const API_KEY = env.API_KEY;
    const API_SECRET = env.API_SECRET;

    if (!API_KEY || !API_SECRET) {
      return new Response(JSON.stringify({ error: "API密钥未配置" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const results = [];
    for (const url of urls) {
      try {
        const apiResponse = await fetch("https://api.anytocopy.com/v1/extract", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": API_KEY,
            "X-API-Secret": API_SECRET
          },
          body: JSON.stringify({ url })
        });

        const data = await apiResponse.json();
        
        if (data.success && data.data) {
          results.push({
            success: true,
            text: data.data.text || "无文案内容",
            url
          });
        } else {
          results.push({
            success: false,
            error: data.error || "提取失败",
            url
          });
        }
      } catch (e) {
        results.push({
          success: false,
          error: e.message,
          url
        });
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
