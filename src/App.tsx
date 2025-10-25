// src/App.tsx
import { BasedMiniAppProvider, useMiniApp } from "@basedone/miniapp-sdk/react";
import "./App.css";
import { useCallback, useState } from "react";

function TradingBot() {
  const { connected, connecting, userAddress, currentSymbol, placeOrder } =
    useMiniApp();

  const [size, setSize] = useState(0.001);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handlePlaceOrder = useCallback(async () => {
    setLoading(true);
    const result = await placeOrder?.({
      symbol: currentSymbol,
      side: "buy",
      orderType: "market",
      size: size,
    });
    setResult(result);
    setLoading(false);
  }, [placeOrder, currentSymbol, size]);

  if (!connected) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>🤖 Trading Bot</h2>
        <p>Status: {connecting ? "Connecting..." : "Disconnected"}</p>
        <div>Connecting to Based.One terminal...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>🤖 Trading Bot</h1>

      {/* Connection Status */}
      <div
        style={{
          background: "#e8f5e8",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      >
        ✅ Connected to Based
        <p>User Address: {userAddress}</p>
        <p>Current Symbol: {currentSymbol}</p>
      </div>
      <input
        type="number"
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
      />
      <button onClick={handlePlaceOrder} disabled={loading}>
        {loading ? "Placing Order..." : "Place Order"}
      </button>
      {result && <p>Result: {JSON.stringify(result)}</p>}
    </div>
  );
}

function App() {
  return (
    <BasedMiniAppProvider
      config={{
        appId: "sample-app",
        autoConnect: true,
        name: "Sample App",
        permissions: ["read_account"],
        url: typeof window !== "undefined" ? window.location.origin : "",
        debug: true,
      }}
    >
      <div className="App">
        <TradingBot />
      </div>
    </BasedMiniAppProvider>
  );
}

export default App;
