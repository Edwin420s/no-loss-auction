import React, { useState } from 'react';
import { invokeContract } from '../services/contract';
import { connectFreighter } from '../services/freighter';

export default function CancelAuction({ onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    const pubKey = await connectFreighter();
    if (!pubKey) return;
    setLoading(true);
    try {
      await invokeContract({
        method: 'cancel_auction',
        args: [new Address(pubKey).toScVal()],
        sourcePublicKey: pubKey,
      });
      alert('Auction cancelled!');
      onSuccess();
    } catch (err) {
      alert('Cancel failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>❌ Cancel Auction (only if no bids)</h3>
      <button onClick={handleCancel} disabled={loading}>{loading ? 'Cancelling...' : 'Cancel'}</button>
    </div>
  );
}