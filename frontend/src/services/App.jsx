import React, { useState, useEffect } from 'react';
import { server, CONTRACT_ID, invokeContract } from './services/contract';
import CreateAuction from './components/CreateAuction';
import PlaceBid from './components/PlaceBid';
import AuctionDetails from './components/AuctionDetails';
import ClaimRefund from './components/ClaimRefund';
import FinalizeAuction from './components/FinalizeAuction';
import CancelAuction from './components/CancelAuction';

function App() {
  const [auction, setAuction] = useState(null);
  const [account, setAccount] = useState(null);
  const [refundAmount, setRefundAmount] = useState(0);

  // Fetch auction data and refund amount when account changes
  const fetchData = async () => {
    try {
      // Call view function to get auction
      const contract = new SorobanClient.Contract(CONTRACT_ID);
      // Simplified – you need a server and key pair. For demo, we assume wallet is connected.
      // In a real app, use Freighter or similar.
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [account]);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>⚡ No‑Loss Auction</h1>
      <CreateAuction onSuccess={fetchData} />
      <hr />
      <AuctionDetails auction={auction} />
      <PlaceBid onSuccess={fetchData} />
      <ClaimRefund refundAmount={refundAmount} onSuccess={fetchData} />
      <FinalizeAuction onSuccess={fetchData} />
      <CancelAuction onSuccess={fetchData} />
    </div>
  );
}

export default App;