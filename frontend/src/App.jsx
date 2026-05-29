import React, { useState } from 'react';
import CreateAuction from './components/CreateAuction';
import PlaceBid from './components/PlaceBid';
import AuctionDetails from './components/AuctionDetails';
import ClaimRefund from './components/ClaimRefund';
import FinalizeAuction from './components/FinalizeAuction';
import CancelAuction from './components/CancelAuction';
import { connectFreighter } from './services/freighter';

function App() {
  const [wallet, setWallet] = useState(null);

  const connectWallet = async () => {
    const pub = await connectFreighter();
    setWallet(pub);
  };

  const refresh = () => window.location.reload();

  return (
    <div className="container">
      <h1>No-Loss Auction on Soroban</h1>
      {!wallet ? (
        <button onClick={connectWallet}>Connect Freighter Wallet</button>
      ) : (
        <p>Connected: {wallet.slice(0, 6)}...{wallet.slice(-4)}</p>
      )}

      <CreateAuction onSuccess={refresh} />
      <AuctionDetails />
      <PlaceBid onSuccess={refresh} />
      <ClaimRefund />
      <FinalizeAuction onSuccess={refresh} />
      <CancelAuction onSuccess={refresh} />
    </div>
  );
}

export default App;