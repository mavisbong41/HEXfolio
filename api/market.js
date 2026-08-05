export default async function handler(request, response) {
  const ticker = String(request.query.ticker || "").trim().toUpperCase();

  if (!ticker || !/^[A-Z0-9.^-]{1,16}$/.test(ticker)) {
    response.status(400).json({ error: "Invalid ticker" });
    return;
  }

  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=1d&interval=1d`;

  try {
    const yahooResponse = await fetch(yahooUrl, {
      headers: {
        "user-agent": "HEXfolio/1.0",
        accept: "application/json",
      },
    });

    if (!yahooResponse.ok) {
      response.status(yahooResponse.status).json({ error: "Quote unavailable" });
      return;
    }

    const data = await yahooResponse.json();
    response.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    response.status(200).json(data);
  } catch {
    response.status(502).json({ error: "Market data request failed" });
  }
}
