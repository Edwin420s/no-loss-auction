import React, { useState } from 'react';
import { invokeContract } from '../services/contract';
import { connectFreighter } from '../services/freighter';

export default function PlaceBid({ onSuccess }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBid = async () => {
    const pubKey = await connectFreighter();
    if (!pubKey) return;
    setLoading(true);
    try {
      await invokeContract({
        method: 'place_bid',
        args: [new Address(pubKey).toScVal(), { i128: { lo: Number(amount), hi: 0 } }],
        sourcePublicKey: pubKey,
      });
      alert('Bid placed!');
      onSuccess();
    } catch (err) {
      alert('Bid failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>💰 Place Bid</h3>
      <input type="number" placeholder="Amount (tokens)" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handleBid} disabled={loading}>{loading ? 'Placing...' : 'Bid'}</button>
    </div>
  );
}