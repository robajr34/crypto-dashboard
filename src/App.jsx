import { useState, useEffect, createContext } from "react";
import { Navigation } from "./Components/Navigation";
import { Home } from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CoinDetail } from "./pages/CoinDetail";
export const AppContext = createContext()
function App() {
  const [coins, setCoins] = useState([]);
  const [input, setInput] = useState("");
 const [dark, setDark] = useState(() => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme ? savedTheme === "dark" : true;
});

useEffect(() => {
  const theme = dark ? "dark" : "light";

  document.body.classList.remove("dark", "light");
  document.body.classList.add(theme);

  localStorage.setItem("theme", theme);
}, [dark]);

  return (
    <>
      <Navigation input={input} setInput={setInput} dark={dark} setDark={setDark}/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home coins={coins} setCoins={setCoins} input={input} />} />
          <Route path="/coin/:coinId" element={<CoinDetail />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
