import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  fetchCoinChart,
  fetchCoinDetails,
  subscribeToCoinTicker,
} from "../functions/realtimeCryptoApi";

export function CoinDetail() {
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [liveTicker, setLiveTicker] = useState(null);
  const [error, setError] = useState("");
  const { coinId } = useParams();

  useEffect(() => {
    let isMounted = true;

    async function loadCoinData() {
      try {
        setError("");
        const [coinData, chartJson] = await Promise.all([
          fetchCoinDetails(coinId),
          fetchCoinChart(coinId, 7),
        ]);

        if (!isMounted) {
          return;
        }

        setCoin(coinData);
        setChartData(
          chartJson.prices.map((item) => ({
            date: new Date(item[0]).toLocaleDateString(),
            price: item[1],
          })),
        );
      } catch {
        if (isMounted) {
          setError("Unable to load coin data. Please try again.");
        }
      }
    }

    loadCoinData();

    return () => {
      isMounted = false;
    };
  }, [coinId]);

  useEffect(() => {
    if (!coin?.symbol) {
      return undefined;
    }

    const unsubscribe = subscribeToCoinTicker(
      coin.symbol,
      (ticker) => {
        setLiveTicker(ticker);
      },
      () => {
        setError("Real-time price stream is unavailable right now.");
      },
    );

    return () => {
      unsubscribe();
    };
  }, [coin?.symbol]);

  const currentPrice = liveTicker?.price ?? coin?.market_data?.current_price?.usd;
  const change24h =
    liveTicker?.changePercent24h ?? coin?.market_data?.price_change_percentage_24h;
  const totalVolume = liveTicker?.totalVolume ?? coin?.market_data?.total_volume?.usd;

  const formattedPrice = useMemo(() => {
    if (typeof currentPrice !== "number") {
      return "--";
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: currentPrice < 1 ? 6 : 2,
    }).format(currentPrice);
  }, [currentPrice]);

  if (!coin) {
    return (
      <div className="loader f">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <>
      <div className="btn-div">
        <Link to="/">
          <button className="back-home-btn">{"<- Back to Home"}</button>
        </Link>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="coin-detail">
        <div className="main-detail">
          <div className="p-info">
            <div className="img">
              <img src={coin.image.large} alt="" width={100} />
            </div>
            <div className="prim-info">
              <h2>{coin.name}</h2>
              <h5>{coin.symbol.toUpperCase()}</h5>
            </div>
            <div className="rank-div">
              <p className="rank" id="rank">
                #rank {coin.market_cap_rank}
              </p>
            </div>
          </div>

          <div className="sec-info">
            <p>Price</p>
            <p className="price pr" id="pr">
              {formattedPrice}
            </p>
            <div className={change24h < 0 ? "stat neg" : "stat pos"} id="stat">
              {change24h < 0
                ? `-${Math.abs(change24h).toFixed(2)}%`
                : `+${change24h.toFixed(2)}%`}
            </div>
          </div>

          <div className="bottom-info">
            <div className="left">
              <span>Marketcap</span>
              <span className="txt">${coin.market_data.market_cap.usd}</span>
            </div>
            <div className="right">
              <span className="total-volume">Total Volume</span>
              <span className="txt">
                {typeof totalVolume === "number"
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(totalVolume)
                  : "--"}
              </span>
            </div>
          </div>
        </div>

        <div className="chart-div">
          <div className="chart-h1">
            <p>
              Chart <span>for the past 7 days</span>
            </p>
          </div>
          <div className="chart" style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={change24h < 0 ? "#ea3943" : "#16c784"}
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}