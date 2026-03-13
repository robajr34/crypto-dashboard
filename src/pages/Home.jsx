import { useState, useEffect } from "react";
import fetchApi from "../functions/fetchApi";
import grid from "./icons/grid.png";
import list from "./icons/list.png";
import { Link } from "react-router-dom";

export function Home({ coins, setCoins, input }) {
  const [view, setView] = useState("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredCoins, setFilteredCoins] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await fetchApi();
        setCoins(data);
        setFilteredCoins(data); // Initialize filtered coins
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    const filtered = coins.filter(
      (c) =>
        c.name.toLowerCase().includes(input.toLowerCase()) ||
        c.symbol.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredCoins(filtered);
  }, [input, coins]);

  return (
    <>
      <div className="top">
        <div className="right">
          <button onClick={() => setView("list")}>List-view</button>
          <button onClick={() => setView("grid")}>Grid-view</button>
        </div>
      </div>
      <div
        className={
          view === "grid" ? "coins-div grid-view" : "coins-div list-view"
        }
      >
        {isLoading ? (
          <div className="loading-div">
            <div className="loader" />
            <p>Loading...</p>
          </div>
        ) : filteredCoins.length > 0 ? (
          filteredCoins.map((coin) => (
            <Link to={`/coin/${coin.id}`} key={coin.id} className="coin-link">
              <div className="coin-div " key={coin.id}>
                <div className="main-info">
                  <div className="img-div">
                    <img src={coin.image} alt={coin.name} width={60} />
                  </div>
                  <div className="name-div">
                    <h2 className="coin-name">
                      {coin.name.length > 10 && view === "grid"
                        ? coin.name.slice(0, 9)
                        : coin.name}
                    </h2>

                    <div className="status">
                      <div className="rank-div symbol">
                        <p className="s">{coin.symbol.toUpperCase()}</p>
                      </div>
                      <div className="rank-div">
                        <p className="rank">{coin.market_cap_rank}</p>
                      </div>
                      <div
                        className={
                          coin.price_change_percentage_24h < 0
                            ? "stat neg"
                            : "stat pos"
                        }
                      >
                        <p>
                          {coin.price_change_percentage_24h !== null
                            ? coin.price_change_percentage_24h < 0
                              ? `↓${Math.abs(
                                  coin.price_change_percentage_24h
                                ).toFixed(2)}%`
                              : `↑${coin.price_change_percentage_24h.toFixed(
                                  2
                                )}%`
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="additional-info">
                  <div className="price-div">
                    <p className="price-text">Price</p>
                    <p className="price">${coin.current_price}</p>
                  </div>
                  <div className="bottom-info">
                    <div className="left">
                      <span>Marketcap</span>
                      <span className="txt">${coin.market_cap}</span>
                    </div>
                    <div className="right">
                      <span className="total-volume">Total Volume</span>
                      <span className="txt">${coin.total_volume}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div>Crypto not found</div>
        )}
      </div>
    </>
  );
}
