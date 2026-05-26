const https = require('https');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const API_KEY = process.env.API_KEY;
  const API_SECRET = process.env.API_SECRET;

  if (!API_KEY || !API_SECRET) {
 https://github.com/3809505005-netizen/baixiaosheng-tool/tree/main   return res.status(500).json({ code: 500, msg: 'API密钥未配置' });
  }

  const params = req.method === 'POST' ? JSON.parse(req.body || '{}') : req.query;
  const { url, taskId } = params;

  try {
    if (url) {
      const response = await fetch(`https://api.anytocopy.com/vip/open-api/v1/video/extract?workUrl=${encodeURIComponent(url)}&taskType=TEXT`, {
        method: 'POST',
        headers: { 'X-API-Key': API_KEY, 'X-API-Secret': API_SECRET }
      });
      const data = await response.json();
      return res.status(200).json(data);
    } else if (taskId) {
      const response = await fetch(`https://api.anytocopy.com/vip/open-api/v1/video/query?taskId=${taskId}`, {
        headers: { 'X-API-Key': API_KEY, 'X-API-Secret': API_SECRET }
      });
      const data = await response.json();
      return res.status(200).json(data);
    } else {
      return res.status(400).json({ code: 400, msg: '缺少参数' });
    }
  } catch (error) {
    return res.status(500).json({ code: 500, msg: error.message });
  }
};
