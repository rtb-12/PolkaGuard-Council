#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod polkaguard_token {
    use ink::storage::Mapping;
    use ink::prelude::string::String;

    /// The PSP22 error types.
    #[derive(Debug, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub enum PSP22Error {
        /// Returned if not enough balance to fulfill a request is available.
        InsufficientBalance,
        /// Returned if not enough allowance to fulfill a request is available.
        InsufficientAllowance,
        /// Returned if recipient's address is zero.
        ZeroRecipientAddress,
        /// Returned if sender's address is zero.
        ZeroSenderAddress,
        /// Custom error for overflow conditions
        Overflow,
        /// Custom error for underflow conditions
        Underflow,
        /// Only owner can perform this action
        OnlyOwner,
    }

    /// The PSP22 result type.
    pub type Result<T> = core::result::Result<T, PSP22Error>;

    #[ink(storage)]
    pub struct PolkaGuardToken {
        /// Total token supply.
        total_supply: Balance,
        /// Mapping from owner to number of owned tokens.
        balances: Mapping<AccountId, Balance>,
        /// Mapping of the token amount which an account is allowed to withdraw from another account.
        allowances: Mapping<(AccountId, AccountId), Balance>,
        /// Token name
        name: Option<String>,
        /// Token symbol  
        symbol: Option<String>,
        /// Token decimals
        decimals: u8,
        /// Contract owner (can mint new tokens)
        owner: AccountId,
    }

    /// Event emitted when a token transfer occurs.
    #[ink(event)]
    pub struct Transfer {
        #[ink(topic)]
        from: Option<AccountId>,
        #[ink(topic)]
        to: Option<AccountId>,
        value: Balance,
    }

    /// Event emitted when an approval occurs that `spender` is allowed to withdraw
    /// up to the amount of `value` tokens from `owner`.
    #[ink(event)]
    pub struct Approval {
        #[ink(topic)]
        owner: AccountId,
        #[ink(topic)]
        spender: AccountId,
        value: Balance,
    }

    impl Default for PolkaGuardToken {
        fn default() -> Self {
            Self::new(0, None, None, 18)
        }
    }

    impl PolkaGuardToken {
        /// Creates a new PSP22 token contract with the specified initial supply.
        #[ink(constructor)]
        pub fn new(
            initial_supply: Balance,
            name: Option<String>,
            symbol: Option<String>,
            decimals: u8,
        ) -> Self {
            let caller = Self::env().caller();
            let mut balances = Mapping::default();
            balances.insert(caller, &initial_supply);

            if initial_supply > 0 {
                Self::env().emit_event(Transfer {
                    from: None,
                    to: Some(caller),
                    value: initial_supply,
                });
            }

            Self {
                total_supply: initial_supply,
                balances,
                allowances: Mapping::default(),
                name,
                symbol,
                decimals,
                owner: caller,
            }
        }

        /// Returns the token name.
        #[ink(message)]
        pub fn token_name(&self) -> Option<String> {
            self.name.clone()
        }

        /// Returns the token symbol.
        #[ink(message)]
        pub fn token_symbol(&self) -> Option<String> {
            self.symbol.clone()
        }

        /// Returns the token decimals.
        #[ink(message)]
        pub fn token_decimals(&self) -> u8 {
            self.decimals
        }

        /// Returns the total token supply.
        #[ink(message)]
        pub fn total_supply(&self) -> Balance {
            self.total_supply
        }

        /// Returns the account balance for the specified `owner`.
        #[ink(message)]
        pub fn balance_of(&self, owner: AccountId) -> Balance {
            self.balances.get(owner).unwrap_or_default()
        }

        /// Returns the amount which `spender` is still allowed to withdraw from `owner`.
        #[ink(message)]
        pub fn allowance(&self, owner: AccountId, spender: AccountId) -> Balance {
            self.allowances.get((owner, spender)).unwrap_or_default()
        }

        /// Transfers `value` amount of tokens from the caller's account to account `to`.
        #[ink(message)]
        pub fn transfer(&mut self, to: AccountId, value: Balance) -> Result<()> {
            let from = self.env().caller();
            self.transfer_from_to(&from, &to, value)
        }

        /// Transfers `value` tokens on the behalf of `from` to the account `to`.
        #[ink(message)]
        pub fn transfer_from(
            &mut self,
            from: AccountId,
            to: AccountId,
            value: Balance,
        ) -> Result<()> {
            let caller = self.env().caller();
            let allowance = self.allowance(from, caller);

            if allowance < value {
                return Err(PSP22Error::InsufficientAllowance);
            }

            self.transfer_from_to(&from, &to, value)?;
            let new_allowance = allowance.checked_sub(value)
                .ok_or(PSP22Error::Underflow)?;
            self.allowances.insert((from, caller), &new_allowance);

            Ok(())
        }

        /// Allows `spender` to withdraw from the caller's account multiple times, up to
        /// the `value` amount.
        #[ink(message)]
        pub fn approve(&mut self, spender: AccountId, value: Balance) -> Result<()> {
            let owner = self.env().caller();
            self.allowances.insert((owner, spender), &value);

            self.env().emit_event(Approval {
                owner,
                spender,
                value,
            });

            Ok(())
        }

        /// Increases the allowance granted to `spender` by the caller.
        #[ink(message)]
        pub fn increase_allowance(&mut self, spender: AccountId, delta_value: Balance) -> Result<()> {
            let owner = self.env().caller();
            let allowance = self.allowance(owner, spender);
            let new_allowance = allowance.checked_add(delta_value)
                .ok_or(PSP22Error::Overflow)?;
            
            self.allowances.insert((owner, spender), &new_allowance);

            self.env().emit_event(Approval {
                owner,
                spender,
                value: new_allowance,
            });

            Ok(())
        }

        /// Decreases the allowance granted to `spender` by the caller.
        #[ink(message)]
        pub fn decrease_allowance(&mut self, spender: AccountId, delta_value: Balance) -> Result<()> {
            let owner = self.env().caller();
            let allowance = self.allowance(owner, spender);
            
            if allowance < delta_value {
                return Err(PSP22Error::InsufficientAllowance);
            }

            let new_allowance = allowance.checked_sub(delta_value)
                .ok_or(PSP22Error::Underflow)?;
            self.allowances.insert((owner, spender), &new_allowance);

            self.env().emit_event(Approval {
                owner,
                spender,
                value: new_allowance,
            });

            Ok(())
        }

        /// Mints `value` tokens to account `to` (only owner can mint)
        #[ink(message)]
        pub fn mint(&mut self, to: AccountId, value: Balance) -> Result<()> {
            if self.env().caller() != self.owner {
                return Err(PSP22Error::OnlyOwner);
            }

            let new_balance = self.balance_of(to).checked_add(value)
                .ok_or(PSP22Error::Overflow)?;
            
            let new_total_supply = self.total_supply.checked_add(value)
                .ok_or(PSP22Error::Overflow)?;

            self.balances.insert(to, &new_balance);
            self.total_supply = new_total_supply;

            self.env().emit_event(Transfer {
                from: None,
                to: Some(to),
                value,
            });

            Ok(())
        }

        /// Burns `value` tokens from the caller's account
        #[ink(message)]
        pub fn burn(&mut self, value: Balance) -> Result<()> {
            let caller = self.env().caller();
            let balance = self.balance_of(caller);

            if balance < value {
                return Err(PSP22Error::InsufficientBalance);
            }

            let new_balance = balance.checked_sub(value)
                .ok_or(PSP22Error::Underflow)?;
            self.balances.insert(caller, &new_balance);
            self.total_supply = self.total_supply.checked_sub(value)
                .ok_or(PSP22Error::Underflow)?;

            self.env().emit_event(Transfer {
                from: Some(caller),
                to: None,
                value,
            });

            Ok(())
        }

        /// Returns the contract owner
        #[ink(message)]
        pub fn owner(&self) -> AccountId {
            self.owner
        }

        /// Internal transfer function
        fn transfer_from_to(
            &mut self,
            from: &AccountId,
            to: &AccountId,
            value: Balance,
        ) -> Result<()> {
            let from_balance = self.balance_of(*from);

            if from_balance < value {
                return Err(PSP22Error::InsufficientBalance);
            }

            let new_from_balance = from_balance.checked_sub(value)
                .ok_or(PSP22Error::Underflow)?;
            self.balances.insert(*from, &new_from_balance);
            let to_balance = self.balance_of(*to);
            let new_to_balance = to_balance.checked_add(value)
                .ok_or(PSP22Error::Overflow)?;
            self.balances.insert(*to, &new_to_balance);

            self.env().emit_event(Transfer {
                from: Some(*from),
                to: Some(*to),
                value,
            });

            Ok(())
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn constructor_works() {
            let contract = PolkaGuardToken::new(
                1000,
                Some("PolkaGuard Token".to_string()),
                Some("PGT".to_string()),
                18,
            );
            assert_eq!(contract.total_supply(), 1000);
            assert_eq!(contract.token_name(), Some("PolkaGuard Token".to_string()));
            assert_eq!(contract.token_symbol(), Some("PGT".to_string()));
            assert_eq!(contract.token_decimals(), 18);
        }

        #[ink::test]
        fn balance_of_works() {
            let contract = PolkaGuardToken::new(
                100,
                None,
                None,
                18,
            );
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            assert_eq!(contract.balance_of(accounts.alice), 100);
            assert_eq!(contract.balance_of(accounts.bob), 0);
        }

        #[ink::test]
        fn transfer_works() {
            let mut contract = PolkaGuardToken::new(
                100,
                None,
                None,
                18,
            );
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();

            assert_eq!(contract.balance_of(accounts.bob), 0);
            assert!(contract.transfer(accounts.bob, 10).is_ok());
            assert_eq!(contract.balance_of(accounts.bob), 10);
        }

        #[ink::test]
        fn transfer_insufficient_balance_fails() {
            let mut contract = PolkaGuardToken::new(
                100,
                None,
                None,
                18,
            );
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();

            let result = contract.transfer(accounts.bob, 101);
            assert_eq!(result, Err(PSP22Error::InsufficientBalance));
        }

        #[ink::test]
        fn approve_works() {
            let mut contract = PolkaGuardToken::new(
                100,
                None,
                None,
                18,
            );
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();

            assert!(contract.approve(accounts.bob, 10).is_ok());
            assert_eq!(contract.allowance(accounts.alice, accounts.bob), 10);
        }

        #[ink::test]
        fn mint_works() {
            let mut contract = PolkaGuardToken::new(
                100,
                None,
                None,
                18,
            );
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();

            assert!(contract.mint(accounts.bob, 50).is_ok());
            assert_eq!(contract.balance_of(accounts.bob), 50);
            assert_eq!(contract.total_supply(), 150);
        }
    }
}
