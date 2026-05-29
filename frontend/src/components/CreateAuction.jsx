import React, { useState } from 'react';
import { invokeContract } from '../services/contract';
import { connectFreighter } from '../services/freighter';

export default function CreateAuction({ onSuccess }) {
  const [token, setToken] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    const pubKey = await connectFreighter();
    if (!pubKey) return;
    setLoading(true);
    try {
      await invokeContract({
        method: 'create_auction',
        args: [
          new Address(pubKey).toScVal(),
          new Address(token).toScVal(),
          { u64: Math.floor(new Date(deadline).getTime() / 1000) },
        ],
        sourcePublicKey: pubKey,
      });
      alert('Auction created!');
      onSuccess();
    } catch (err) {
      console.error(err);
      alert('Creation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>➕ Create Auction</h3>
      <input type="text" placeholder="Token Address (SEP‑41)" value={token} onChange={(e) => setToken(e.target.value)} />
      <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      <button onClick={handleCreate} disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
    </div>
  );
}