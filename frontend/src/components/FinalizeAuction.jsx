import React, { useState } from 'react';
import { invokeContract } from '../services/contract';
import { connectFreighter } from '../services/freighter';
import { Address } from '@stellar/stellar-sdk';

export default function FinalizeAuction({ onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleFinalize = async () => {
    const pubKey = await connectFreighter();
    if (!pubKey) return;
    setLoading(true);
    try {
      await invokeContract({
        method: 'finalize_auction',
        args: [new Address(pubKey).toScVal()],
        sourcePublicKey: pubKey,
      });
      alert('Auction finalized!');
      onSuccess();
    } catch (err) {
      alert('Finalize failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Finalize Auction</h3>
      <button onClick={handleFinalize} disabled={loading}>{loading ? 'Finalizing...' : 'Finalize'}</button>
    </div>
  );
}