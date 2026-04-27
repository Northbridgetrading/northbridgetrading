import "../styles/Dashboard.css";
import Chart from "../components/Charts";

function Dashboard() {
  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">TradeX</h2>

        <nav className="nav">
          <p className="active">📊 Dashboard</p>
          <p>💼 Portfolio</p>
          <p>📈 Markets</p>
          <p>⚙️ Settings</p>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main">

        <div className="top-bar">
          <h2>Market Overview</h2>
          <p className="subtext">Live trading dashboard</p>
        </div>

        <div className="chart-box">
            <Chart />
        </div>

        <div className="stats">
          <div className="card">Portfolio: $12,450</div>
          <div className="card">Today: +2.4%</div>
          <div className="card">Assets: 8</div>
        </div>

      </main>

      {/* RIGHT PANEL */}
      <aside className="right">

        <h3>Watchlist</h3>

        <div className="asset">AAPL</div>
        <div className="asset">TSLA</div>
        <div className="asset">BTC</div>
        <div className="asset">ETH</div>

      </aside>

    </div>
  );
}

export default Dashboard;