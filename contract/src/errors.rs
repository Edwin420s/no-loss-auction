use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum AuctionError {
    AuctionAlreadyExists = 1,
    AuctionNotActive = 2,
    BidTooLow = 3,
    DeadlinePassed = 4,
    NotYetDeadline = 5,
    BidsExistCannotCancel = 6,
    OnlySeller = 7,
    NoRefund = 8,
}