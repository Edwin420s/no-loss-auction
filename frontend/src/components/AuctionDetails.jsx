import React, { useEffect, useState } from 'react';
import { queryContract } from '../services/contract';

export default function AuctionDetails() {
  const [auction, setAuction] = useState(null);

  const fetchAuction = async () => {
    try {
      const data = await queryContract({ method: 'get_auction', args: [] });
      setAuction(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAuction();
    const interval = setInterval(fetchAuction, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!auction) return <div className="card">No active auction yet.</div>;

  return (
    <div className="card">
      <h3>Current Auction</h3>
      <p><strong>Highest Bid:</strong> {auction.highest_bid} tokens</p>
      <p><strong>Highest Bidder:</strong> {auction.highest_bidder?.toString().slice(0, 8)}...</p>
      <p><strong>Deadline:</strong> {new Date(auction.deadline * 1000).toLocaleString()}</p>
      <p><strong>Active:</strong> {auction.active ? 'Yes' : 'No'}</p>
    </div>
  );
}