#![no_std]
use soroban_sdk::{contract, contractimpl, token, Address, Env, Map};

mod auction;
mod errors;
mod storage;

use auction::Auction;
use errors::AuctionError;
use storage::{bump_instance, get_auction, get_refunds, set_auction, set_refunds};

#[contract]
pub struct NoLossAuction;

#[contractimpl]
impl NoLossAuction {
    /// Create auction. Fails if one already exists.
    pub fn create_auction(env: Env, seller: Address, token: Address, deadline: u64) {
        seller.require_auth();
        if get_auction(&env).is_some() {
            panic!("auction already exists");
        }

        let auction = Auction {
            seller: seller.clone(),
            highest_bidder: seller.clone(),
            highest_bid: 0,
            deadline,
            active: true,
            token,
        };
        set_auction(&env, &auction);
        bump_instance(&env);
    }

    /// Place a bid. Must be > current highest. Previous highest gets a refund entry.
    pub fn place_bid(env: Env, bidder: Address, amount: i128) {
        bidder.require_auth();

        let mut auction = get_auction(&env).expect("auction not found");
        if !auction.active {
            panic!("auction not active");
        }
        if env.ledger().timestamp() > auction.deadline {
            panic!("deadline passed");
        }
        if amount <= auction.highest_bid {
            panic!("bid too low");
        }

        // Transfer new bid from bidder to contract
        let token_client = token::Client::new(&env, &auction.token);
        token_client.transfer(&bidder, &env.current_contract_address(), &amount);

        // Store refund for previous highest bidder (if any)
        if auction.highest_bid > 0 {
            let mut refunds = get_refunds(&env);
            let prev_bidder = auction.highest_bidder.clone();
            let prev_amount = auction.highest_bid;
            let new_refund = refunds.get(prev_bidder.clone()).unwrap_or(0) + prev_amount;
            refunds.set(prev_bidder, new_refund);
            set_refunds(&env, &refunds);
        }

        // Update auction
        auction.highest_bidder = bidder;
        auction.highest_bid = amount;
        set_auction(&env, &auction);
        bump_instance(&env);
    }

    /// Claim refund for a previous bidder.
    pub fn claim_refund(env: Env, bidder: Address) {
        bidder.require_auth();

        let mut refunds = get_refunds(&env);
        let amount = refunds.get(bidder.clone()).unwrap_or(0);
        if amount == 0 {
            panic!("no refund available");
        }

        let auction = get_auction(&env).expect("auction not found");
        let token_client = token::Client::new(&env, &auction.token);
        token_client.transfer(&env.current_contract_address(), &bidder, &amount);

        refunds.remove(bidder);
        set_refunds(&env, &refunds);
        bump_instance(&env);
    }

    /// Finalize auction after deadline – send highest bid to seller.
    pub fn finalize_auction(env: Env, caller: Address) {
        caller.require_auth();

        let mut auction = get_auction(&env).expect("auction not found");
        if !auction.active {
            panic!("auction already finalized or cancelled");
        }
        if env.ledger().timestamp() <= auction.deadline {
            panic!("deadline not yet reached");
        }

        let token_client = token::Client::new(&env, &auction.token);
        token_client.transfer(
            &env.current_contract_address(),
            &auction.seller,
            &auction.highest_bid,
        );

        auction.active = false;
        set_auction(&env, &auction);
        bump_instance(&env);
    }

    /// Cancel auction – only if no bids placed.
    pub fn cancel_auction(env: Env, caller: Address) {
        caller.require_auth();

        let mut auction = get_auction(&env).expect("auction not found");
        if auction.highest_bid > 0 {
            panic!("cannot cancel – bids already placed");
        }
        if auction.seller != caller {
            panic!("only seller can cancel");
        }
        auction.active = false;
        set_auction(&env, &auction);
        bump_instance(&env);
    }

    // ---- View functions ----
    pub fn get_auction(env: Env) -> Option<Auction> {
        get_auction(&env)
    }

    pub fn get_refund(env: Env, bidder: Address) -> i128 {
        get_refunds(&env).get(bidder).unwrap_or(0)
    }
}