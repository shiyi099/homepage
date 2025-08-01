// created by Billion

const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const path = require('path');

const serviceAccountJson = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

const client = new BetaAnalyticsDataClient({
  credentials: serviceAccountJson
});

module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*'); // 或者写你的域名，比如 https://shiyi099.github.io/billion.github.io
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求（OPTIONS 方法）
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    const [response] = await client.runReport({
      property: "properties/498260468",
      dimensions: [
        { name: "country" },
        { name: "browser" },
        { name: "deviceCategory" },
      ],
      metrics: [{ name: "activeUsers" }],
      dateRanges: [{ startDate: "2024-07-26", endDate: "today" }],
    });

    const data = response.rows.map(row => ({
      country: row.dimensionValues[0].value,
      browser: row.dimensionValues[1].value,
      deviceCategory: row.dimensionValues[2].value,
      activeUsers: row.metricValues[0].value
    }));

    res.status(200).json(data);
  } catch (err) {
    console.error("GA4 API error:", err);
    res.status(500).json({ error: err.message });
  }
};