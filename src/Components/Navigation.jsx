import logo from "./logo.png";
export function Navigation({ input, setInput, dark, setDark }) {

  return (
    <>
      <header>
        <div className="logo-div">
          <img src={logo} alt="logo" className="logo" width={70} />
          <h1 className="logo">CRYPTO</h1>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search crypto..."
            className="search-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="toggle-div">
          <button className="toggle-btn" onClick={()=>{
            dark === true? setDark(false):
            setDark(true)
          }}>{dark ? "Light" : "Dark"} Mode</button>
        </div>
      </header>
    </>
  );
}
