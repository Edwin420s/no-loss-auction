use soroban_sdk::{Address, Env};

#[derive(Clone, Debug, PartialEq)]
pub struct Auction {
    pub seller: Address,
    pub highest_bidder: Address,
    pub highest_bid: i128,
    pub deadline: u64,
    pub active: bool,
    pub token: Address,
}