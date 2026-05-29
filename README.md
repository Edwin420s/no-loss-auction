# No-Loss Auction Protocol on Stellar Soroban

A decentralized auction where only the highest bidder's funds are locked - all previous bidders get refunded.

## Features

- Create auction with deadline and SEP-41 token
- Place bids - only higher bids accepted
- Previous highest bidder gets a refund entry
- Claim refund manually
- Finalize auction after deadline - winner's funds go to seller
- Cancel auction only if no bids placed

## Smart Contract (Testnet)

**Contract ID:** `CDJ3K...` (Replace with your deployed contract ID after deployment)

## Frontend (Live)

**URL:** `https://your-frontend-url.vercel.app` (Replace with your deployed frontend URL)

## Project Structure

```
no-loss-auction/
├── contract/
│   ├── Cargo.toml
│   └── src/
│       ├── lib.rs
│       ├── auction.rs
│       ├── errors.rs
│       └── storage.rs
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── components/
│       │   ├── CreateAuction.jsx
│       │   ├── PlaceBid.jsx
│       │   ├── AuctionDetails.jsx
│       │   ├── ClaimRefund.jsx
│       │   ├── FinalizeAuction.jsx
│       │   └── CancelAuction.jsx
│       ├── services/
│       │   ├── contract.js
│       │   └── freighter.js
│       └── styles/
│           └── App.css
├── README.md
└── .gitignore
```

## Smart Contract Functions

### create_auction(seller, token, deadline)
Creates a new auction with the specified seller, SEP-41 token address, and deadline (Unix timestamp).

### place_bid(bidder, amount)
Places a bid. Must be higher than the current highest bid. Transfers tokens from bidder to contract and stores refund for previous highest bidder.

### claim_refund(bidder)
Claims refund for a previous bidder. Transfers stored refund amount back to the bidder.

### finalize_auction(caller)
Finalizes the auction after the deadline has passed. Transfers the highest bid to the seller.

### cancel_auction(caller)
Cancels the auction. Only allowed if no bids have been placed and caller is the seller.

### get_auction()
Returns the current auction state (view function).

### get_refund(bidder)
Returns the refund amount for a specific bidder (view function).

## How to Run Locally

### Prerequisites

- Rust and Soroban CLI
- Node.js and npm
- Freighter wallet extension

### Deploy Smart Contract

```bash
cd contract
cargo build --target wasm32-unknown-unknown --release
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/no_loss_auction.wasm \
  --source <YOUR_SECRET_KEY> \
  --network testnet
```

Copy the returned Contract ID and update it in `frontend/src/services/contract.js`.

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

### Deploy Frontend

```bash
cd frontend
npm run build
```

Deploy the `dist` folder to Vercel, Netlify, or GitHub Pages.

## Challenges Encountered

1. **Understanding Soroban storage persistence**
   - Solution: Used `env.storage().instance()` to store auction and refunds separately in persistent storage.

2. **Ensuring only higher bids are accepted and previous bidder is refunded**
   - Solution: In `place_bid`, transfer new bid first, then store refund in a Map for the previous highest bidder.

3. **Connecting frontend to contract - handling transaction signing**
   - Solution: Used `@stellar/stellar-sdk` and Freighter wallet; created reusable `invokeContract` helper function.

4. **Ensuring cancellation only with zero bids**
   - Solution: Added a guard in `cancel_auction` that checks if `auction.highest_bid > 0` before allowing cancellation.

## Assessment Checklist

- [x] create_auction implemented
- [x] place_bid with token transfer
- [x] Refund stored & claimable
- [x] finalize_auction
- [x] cancel_auction (no bids)
- [x] Frontend integrated
- [ ] Contract deployed to testnet (deploy and update CONTRACT_ID)
- [ ] Frontend deployed (update URL in README)
- [ ] Contract ID in README
- [ ] Frontend link in README
