export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Serverless!1' });
}

const {BetaAnalyticsDataClient} = require('@google-analytics/data');

