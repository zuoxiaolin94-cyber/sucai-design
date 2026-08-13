const ALLOWED_ACTIONS = new Set(["submit", "query"]);
const UPSTREAM_BASE = "https://model.jdcloud.com/joycreator/openApi";

const responseHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
};

exports.handler = async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: responseHeaders, body: "" };
  }
  if (event.httpMethod === "GET" && event.queryStringParameters?.image) {
    return proxyGeneratedImage(event.queryStringParameters.image);
  }
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: { message: "Method not allowed" } });
  }

  const authorization = event.headers.authorization || event.headers.Authorization || "";
  if (!/^Bearer\s+\S+$/i.test(authorization)) {
    return jsonResponse(401, { error: { message: "缺少灵境 AppKey" } });
  }

  let input;
  try {
    input = JSON.parse(event.body || "{}");
  } catch (_) {
    return jsonResponse(400, { error: { message: "请求格式无效" } });
  }
  if (!ALLOWED_ACTIONS.has(input.action)) {
    return jsonResponse(400, { error: { message: "不支持的操作" } });
  }

  let endpoint;
  let upstreamBody;
  if (input.action === "query") {
    if (!input.genTaskId || String(input.genTaskId).length > 80) {
      return jsonResponse(400, { error: { message: "任务 ID 无效" } });
    }
    endpoint = "queryTaskResult";
    upstreamBody = { genTaskId: String(input.genTaskId) };
  } else {
    const prompt = String(input.prompt || "").trim();
    if (!prompt || prompt.length > 3000) {
      return jsonResponse(400, { error: { message: "提示词须为 1–3000 个字符" } });
    }
    const allowedSizes = new Set([
      "1024x1024", "1024x1536", "1536x1024", "1056x1408", "1408x1056", "1536x864", "864x1536",
      "2048x2048", "1440x2160", "2160x1440", "1440x1920", "1920x1440", "2048x1152", "1152x2048",
      "2880x2880", "2176x3264", "3264x2176", "2160x2880", "2880x2160", "3840x2160", "2160x3840",
    ]);
    const size = allowedSizes.has(input.size) ? input.size : "1024x1024";
    const quality = ["low", "medium", "high"].includes(input.quality) ? input.quality : "medium";
    const background = ["auto", "transparent", "opaque"].includes(input.background) ? input.background : "auto";
    endpoint = "submitTask";
    upstreamBody = {
      apiId: "603",
      params: { prompt, model: "gpt-image-2", quality, size, background, taskNum: 1 },
    };
  }

  try {
    const upstream = await fetch(`${UPSTREAM_BASE}/${endpoint}`, {
      method: "POST",
      headers: {
        "Authorization": authorization,
        "Content-Type": "application/json",
        "x-jdcloud-request-id": crypto.randomUUID(),
      },
      body: JSON.stringify(upstreamBody),
    });
    const body = await upstream.text();
    return {
      statusCode: upstream.status >= 200 && upstream.status < 500 ? upstream.status : 502,
      headers: responseHeaders,
      body: body || JSON.stringify({ error: { message: "灵境接口未返回内容" } }),
    };
  } catch (_) {
    return jsonResponse(502, { error: { message: "暂时无法连接灵境服务" } });
  }
};

async function proxyGeneratedImage(rawUrl) {
  let imageUrl;
  try {
    imageUrl = new URL(rawUrl);
  } catch (_) {
    return jsonResponse(400, { error: { message: "图片地址无效" } });
  }
  const allowedHost = imageUrl.protocol === "https:"
    && (imageUrl.hostname.endsWith(".jdcloud-oss.com") || imageUrl.hostname === "lj-static.jdcloud.com");
  if (!allowedHost) {
    return jsonResponse(403, { error: { message: "不支持转发该图片地址" } });
  }
  try {
    const upstream = await fetch(imageUrl.toString());
    if (!upstream.ok) {
      return jsonResponse(502, { error: { message: "生成图片暂时无法读取" } });
    }
    const bytes = Buffer.from(await upstream.arrayBuffer());
    return {
      statusCode: 200,
      headers: {
        ...responseHeaders,
        "Content-Type": upstream.headers.get("content-type") || "image/png",
        "Cache-Control": "private, max-age=3600",
      },
      isBase64Encoded: true,
      body: bytes.toString("base64"),
    };
  } catch (_) {
    return jsonResponse(502, { error: { message: "生成图片读取失败" } });
  }
}

function jsonResponse(statusCode, value) {
  return { statusCode, headers: responseHeaders, body: JSON.stringify(value) };
}
