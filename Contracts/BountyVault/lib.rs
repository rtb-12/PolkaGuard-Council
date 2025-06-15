#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod bounty_vault {
    use ink::storage::Mapping;

    #[ink(storage)]
    pub struct BountyVault {
        /// Approved registry account to withdraw funds
        registry: AccountId,
        /// Tracks if a bounty has been claimed
        claimed: Mapping<u64, bool>,
        /// Fixed bounty amount per proof
        bounty_amount: Balance,
        /// Contract owner (for administrative functions)
        owner: AccountId,
    }

    #[ink(event)]
    pub struct Funded {
        #[ink(topic)] 
        from: AccountId,
        #[ink(topic)] 
        amount: Balance,
    }

    #[ink(event)]
    pub struct Withdrawn {
        #[ink(topic)] 
        to: AccountId,
        #[ink(topic)] 
        proof_id: u64,
        #[ink(topic)] 
        amount: Balance,
    }

    impl Default for BountyVault {
        fn default() -> Self {
            Self::new(AccountId::from([0u8; 32]), 0)
        }
    }

    impl BountyVault {
        /// Instantiate vault with registry as the authorized withdrawer.
        #[ink(constructor)]
        pub fn new(registry: AccountId, bounty_amount: Balance) -> Self {
            Self {
                registry,
                claimed: Mapping::default(),
                bounty_amount,
                owner: Self::env().caller(),
            }
        }

        /// Deposits native tokens into vault.
        #[ink(message, payable)]
        pub fn fund(&mut self) {
            let amount = Self::env().transferred_value();
            assert!(amount > 0, "Must send funds");
            self.env().emit_event(Funded {
                from: self.env().caller(),
                amount,
            });
        }

        /// Withdraw bounty for approved proof.
        /// Conditions:
        /// - Called only by authorized registry.
        /// - Checks if bounty for `proof_id` hasn't been claimed.
        /// - Transfers fixed bounty amount.
        #[ink(message)]
        pub fn withdraw(&mut self, proof_id: u64, to: AccountId) {
            assert_eq!(
                self.env().caller(),
                self.registry,
                "Only registry can initiate withdrawal"
            );
            assert!(
                !self.claimed.get(proof_id).unwrap_or(false),
                "Bounty already claimed"
            );

            let vault_balance = self.env().balance();
            let amount = if self.bounty_amount > 0 {
                // Use fixed bounty amount if set
                assert!(vault_balance >= self.bounty_amount, "Insufficient funds in vault");
                self.bounty_amount
            } else {
                // Use entire vault balance if no fixed amount
                assert!(vault_balance > 0, "No funds in vault");
                vault_balance
            };

            self.claimed.insert(proof_id, &true);
            self.env().transfer(to, amount).expect("Transfer failed");

            self.env().emit_event(Withdrawn {
                to,
                proof_id,
                amount,
            });
        }

        /// Check if bounty for proof_id is already claimed.
        #[ink(message)]
        pub fn is_claimed(&self, proof_id: u64) -> bool {
            self.claimed.get(proof_id).unwrap_or(false)
        }

        /// Get the authorized registry address
        #[ink(message)]
        pub fn get_registry(&self) -> AccountId {
            self.registry
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn constructor_works() {
            let registry = AccountId::from([0x1; 32]);
            let contract = BountyVault::new(registry);
            assert_eq!(contract.get_registry(), registry);
        }

        #[ink::test]
        fn default_works() {
            let contract = BountyVault::default();
            assert_eq!(contract.get_registry(), AccountId::from([0u8; 32]));
        }

        #[ink::test]
        fn claim_tracking_works() {
            let registry = AccountId::from([0x1; 32]);
            let mut contract = BountyVault::new(registry);
            
            assert!(!contract.is_claimed(1));
            contract.claimed.insert(1, &true);
            assert!(contract.is_claimed(1));
        }
    }
}
