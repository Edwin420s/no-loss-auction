use soroban_sdk::{Address, Env, Map, Vec};
use crate::auction::Auction;

const AUCTION_KEY: &[u8] = b"auction";
const REFUNDS_KEY: &[u8] = b"refunds";

pub fn get_auction(env: &Env) -> Option<Auction> {
    env.storage().instance().get(AUCTION_KEY)
}

pub fn set_auction(env: &Env, auction: &Auction) {
    env.storage().instance().set(AUCTION_KEY, auction);
}

pub fn get_refunds(env: &Env) -> Map<Address, i128> {
    env.storage()
        .instance()
        .get(REFUNDS_KEY)
        .unwrap_or_else(|| Map::new(env))
}

pub fn set_refunds(env: &Env, refunds: &Map<Address, i128>) {
    env.storage().instance().set(REFUNDS_KEY, refunds);
}

pub fn bump_instance(env: &Env) {
    env.storage().instance().extend_ttl(100, 100);
}