import React, { useState, useEffect } from 'react';
import { invokeContract, queryContract } from '../services/contract';
import { connectFreighter } from '../services/freighter';
import { Address } from '@stellar/stellar-sdk';

export default function ClaimRefund() {
  const [refundAmount, setRefundAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const checkRefund = async () => {
    const pubKey = await connectFreighter();
    if (!pubKey) return;
    const amount = await queryContract({
      method: 'get_refund',
      args: [new Address(pubKey).toScVal()],
    });
    setRefundAmount(Number(amount));
  };

  const handleClaim = async () => {
    const pubKey = await connectFreighter();
    if (!pubKey) return;
    setLoading(true);
    try {
      await invokeContract({
        method: 'claim_refund',
        args: [new Address(pubKey).toScVal()],
        sourcePublicKey: pubKey,
      });
      alert('Refund claimed!');
      checkRefund();
    } catch (err) {
      alert('Claim failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkRefund();
  }, []);

  if (refundAmount === 0) return null;

  return (
    <div className="card">
      <h3>Claim Refund</h3>
      <p>You have {refundAmount} tokens to claim.</p>
      <button onClick={handleClaim} disabled={loading}>{loading ? 'Claiming...' : 'Claim Refund'}</button>
    </div>
  );
}