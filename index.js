export default async function handler(req, res) {
  // ========== 在这里填你的火山方舟配置 ==========
  const VOLC_API_KEY = "ark-f1bced0c-ac09-4d7d-9b1f-d2cce4c1b5db-e426b";
  const VOLC_ENDPOINT = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
  // ============================================

  // 允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({msg:"仅支持POST"});

  try {
    const body = await new Promise((resolve) => {
      let buf = "";
      req.on("data", d => buf += d.toString());
      req.on("end", () => resolve(JSON.parse(buf)));
    });

    // 转发到火山方舟
    const resp = await fetch(VOLC_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${VOLC_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    const data = await resp.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({msg:"中转失败", err:e.message});
  }
}
