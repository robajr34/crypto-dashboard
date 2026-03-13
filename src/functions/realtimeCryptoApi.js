const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";
const BINANCE_WS_BASE_URL = "wss://stream.binance.com:9443/ws";

export async function fetchCoinDetails(coinId) {
  const response = await fetch(`${COINGECKO_BASE_URL}/coins/${coinId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch coin details.");
  }

  return response.json();
}

export async function fetchCoinChart(coinId, days = 7) {
  const response = await fetch(
    `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch chart data.");
  }

  return response.json();
}

export function subscribeToCoinTicker(symbol, onUpdate, onError) {
  if (!symbol) {
    return () => {};
  }

  const stream = `${symbol.toLowerCase()}usdt@ticker`;
  const socket = new WebSocket(`${BINANCE_WS_BASE_URL}/${stream}`);

  socket.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);

      onUpdate({
        price: Number(payload.c),
        changePercent24h: Number(payload.P),
        totalVolume: Number(payload.q),
        updatedAt: payload.E ? new Date(payload.E) : new Date(),
      });
    } catch (error) {
      if (onError) {
        onError(error);
      }
    }
  };

  socket.onerror = () => {
    if (onError) {
      onError(new Error("Real-time ticker connection failed."));
    }
  };

  return () => {
    if (
      socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING
    ) {
      socket.close();
    }
  };
}
