#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod bounty_dao {
    use ink::storage::Mapping;

    #[derive(Clone, PartialEq, Eq, Debug)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub enum ProposalStatus { 
        Pending, 
        Approved, 
        Rejected, 
        Executed 
    }

    #[derive(Clone, Debug)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct Proposal {
        proposer: AccountId,
        registry: AccountId,
        proof_id: u64,
        votes_for: Balance,
        votes_against: Balance,
        status: ProposalStatus,
        created_at: u64,
    }

    #[ink(storage)]
    pub struct BountyDAO {
        /// Address of the governance token contract (PSP22)
        token: AccountId,
        /// Minimum token balance required to participate
        min_tokens: Balance,
        /// Storage for all proposals
        proposals: Mapping<u64, Proposal>,
        /// Next proposal ID
        next_id: u64,
        /// Minimum votes required to approve a proposal
        threshold: Balance,
        /// Track who has voted on which proposal to prevent double voting
        votes: Mapping<(u64, AccountId), Balance>,
        /// Contract owner
        owner: AccountId,
    }

    #[ink(event)]
    pub struct ProposalCreated { 
        #[ink(topic)] 
        id: u64, 
        proposer: AccountId, 
        proof_id: u64,
        registry: AccountId,
    }

    #[ink(event)]
    pub struct Voted { 
        #[ink(topic)] 
        proposal_id: u64, 
        voter: AccountId, 
        support: bool, 
        weight: Balance 
    }

    #[ink(event)]
    pub struct ProposalExecuted { 
        #[ink(topic)] 
        id: u64,
        registry: AccountId,
        proof_id: u64,
    }

    /// Errors that can occur in the contract
    #[derive(Debug, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum Error {
        /// Insufficient token balance
        InsufficientTokens,
        /// Proposal not found
        ProposalNotFound,
        /// Proposal is not in pending status
        InvalidProposalStatus,
        /// Threshold not met for execution
        ThresholdNotMet,
        /// User has already voted
        AlreadyVoted,
        /// Cross-contract call failed
        CallFailed,
        /// Only owner can perform this action
        OnlyOwner,
        /// Arithmetic overflow
        Overflow,
    }

    pub type Result<T> = core::result::Result<T, Error>;

    impl Default for BountyDAO {
        fn default() -> Self {
            Self::new(
                AccountId::from([0u8; 32]),
                0,
                0,
            )
        }
    }

    impl BountyDAO {
        #[ink(constructor)]
        pub fn new(token: AccountId, min_tokens: Balance, threshold: Balance) -> Self {
            Self {
                token,
                min_tokens,
                proposals: Mapping::default(),
                next_id: 1,
                threshold,
                votes: Mapping::default(),
                owner: Self::env().caller(),
            }
        }

        /// Create a new proposal to approve a proof from ExploitProofRegistry
        #[ink(message)]
        pub fn create_proposal(&mut self, registry: AccountId, proof_id: u64) -> Result<u64> {
            let caller = self.env().caller();
            
            // Check if caller has sufficient token balance
            let balance = self.get_token_balance(caller)?;
            if balance < self.min_tokens {
                return Err(Error::InsufficientTokens);
            }
            
            let id = self.next_id;
            self.next_id = self.next_id.checked_add(1).ok_or(Error::Overflow)?;
            
            let proposal = Proposal {
                proposer: caller,
                registry,
                proof_id,
                votes_for: 0,
                votes_against: 0,
                status: ProposalStatus::Pending,
                created_at: self.env().block_timestamp(),
            };
            
            self.proposals.insert(id, &proposal);
            
            self.env().emit_event(ProposalCreated { 
                id, 
                proposer: caller, 
                proof_id,
                registry,
            });
            
            Ok(id)
        }

        /// Vote on a proposal
        #[ink(message)]
        pub fn vote(&mut self, proposal_id: u64, support: bool) -> Result<()> {
            let caller = self.env().caller();
            
            // Check if user has already voted
            if self.votes.contains((proposal_id, caller)) {
                return Err(Error::AlreadyVoted);
            }
            
            // Get voter's token balance from PolkaGuardToken contract
            let voter_balance = self.get_token_balance(caller)?;
            
            if voter_balance < self.min_tokens {
                return Err(Error::InsufficientTokens);
            }

            let mut proposal = self.proposals.get(proposal_id).ok_or(Error::ProposalNotFound)?;
            
            if proposal.status != ProposalStatus::Pending {
                return Err(Error::InvalidProposalStatus);
            }

            if support {
                proposal.votes_for = proposal.votes_for.checked_add(voter_balance).ok_or(Error::Overflow)?;
            } else {
                proposal.votes_against = proposal.votes_against.checked_add(voter_balance).ok_or(Error::Overflow)?;
            }
            
            self.proposals.insert(proposal_id, &proposal);
            self.votes.insert((proposal_id, caller), &voter_balance);
            
            self.env().emit_event(Voted { 
                proposal_id, 
                voter: caller, 
                support, 
                weight: voter_balance 
            });
            
            Ok(())
        }

        /// Execute an approved proposal
        #[ink(message)]
        pub fn execute(&mut self, proposal_id: u64) -> Result<()> {
            let caller = self.env().caller();
            
            // Check if caller has sufficient token balance to execute
            let caller_balance = self.get_token_balance(caller)?;
            if caller_balance < self.min_tokens {
                return Err(Error::InsufficientTokens);
            }
            
            let mut proposal = self.proposals.get(proposal_id).ok_or(Error::ProposalNotFound)?;
            
            if proposal.status != ProposalStatus::Pending {
                return Err(Error::InvalidProposalStatus);
            }

            if proposal.votes_for < self.threshold {
                return Err(Error::ThresholdNotMet);
            }

            // Make cross-contract call to ExploitProofRegistry
            let call_result = ink::env::call::build_call::<ink::env::DefaultEnvironment>()
                .call(proposal.registry)
                .transferred_value(0)
                .exec_input(
                    ink::env::call::ExecutionInput::new(
                        ink::env::call::Selector::new(ink::selector_bytes!("approve_proof"))
                    )
                    .push_arg(proposal.proof_id)
                )
                .returns::<()>()
                .try_invoke();

            match call_result {
                Ok(Ok(_)) => {
                    proposal.status = ProposalStatus::Executed;
                    self.proposals.insert(proposal_id, &proposal);
                    
                    self.env().emit_event(ProposalExecuted { 
                        id: proposal_id,
                        registry: proposal.registry,
                        proof_id: proposal.proof_id,
                    });
                    
                    Ok(())
                }
                _ => Err(Error::CallFailed),
            }
        }

        /// Get proposal details
        #[ink(message)]
        pub fn get_proposal(&self, proposal_id: u64) -> Option<Proposal> {
            self.proposals.get(proposal_id)
        }

        /// Get next proposal ID
        #[ink(message)]
        pub fn get_next_id(&self) -> u64 {
            self.next_id
        }

        /// Get voting threshold
        #[ink(message)]
        pub fn get_threshold(&self) -> Balance {
            self.threshold
        }

        /// Get minimum tokens required
        #[ink(message)]
        pub fn get_min_tokens(&self) -> Balance {
            self.min_tokens
        }

        /// Get token contract address
        #[ink(message)]
        pub fn get_token(&self) -> AccountId {
            self.token
        }

        /// Check if user has voted on a proposal
        #[ink(message)]
        pub fn has_voted(&self, proposal_id: u64, voter: AccountId) -> bool {
            self.votes.contains((proposal_id, voter))
        }

        /// Get user's vote weight for a proposal
        #[ink(message)]
        pub fn get_vote_weight(&self, proposal_id: u64, voter: AccountId) -> Option<Balance> {
            self.votes.get((proposal_id, voter))
        }

        /// Update threshold (only owner)
        #[ink(message)]
        pub fn set_threshold(&mut self, new_threshold: Balance) -> Result<()> {
            if self.env().caller() != self.owner {
                return Err(Error::OnlyOwner);
            }
            self.threshold = new_threshold;
            Ok(())
        }

        /// Update minimum tokens (only owner)
        #[ink(message)]
        pub fn set_min_tokens(&mut self, new_min_tokens: Balance) -> Result<()> {
            if self.env().caller() != self.owner {
                return Err(Error::OnlyOwner);
            }
            self.min_tokens = new_min_tokens;
            Ok(())
        }

        /// Get contract owner
        #[ink(message)]
        pub fn get_owner(&self) -> AccountId {
            self.owner
        }

        /// Setup ExploitProofRegistry integration (only owner)
        #[ink(message)]
        pub fn setup_registry_integration(&mut self, registry: AccountId) -> Result<()> {
            if self.env().caller() != self.owner {
                return Err(Error::OnlyOwner);
            }

            // Transfer ownership of the registry to this DAO
            let call_result = ink::env::call::build_call::<ink::env::DefaultEnvironment>()
                .call(registry)
                .transferred_value(0)
                .exec_input(
                    ink::env::call::ExecutionInput::new(
                        ink::env::call::Selector::new(ink::selector_bytes!("transfer_ownership"))
                    )
                    .push_arg(self.env().account_id())
                )
                .returns::<()>()
                .try_invoke();

            match call_result {
                Ok(Ok(_)) => Ok(()),
                _ => Err(Error::CallFailed),
            }
        }

        /// Setup BountyVault integration for a registry (only owner)
        #[ink(message)]
        pub fn setup_vault_integration(&mut self, registry: AccountId, vault: AccountId) -> Result<()> {
            if self.env().caller() != self.owner {
                return Err(Error::OnlyOwner);
            }

            // Set the vault address in the registry
            let call_result = ink::env::call::build_call::<ink::env::DefaultEnvironment>()
                .call(registry)
                .transferred_value(0)
                .exec_input(
                    ink::env::call::ExecutionInput::new(
                        ink::env::call::Selector::new(ink::selector_bytes!("set_bounty_vault"))
                    )
                    .push_arg(vault)
                )
                .returns::<()>()
                .try_invoke();

            match call_result {
                Ok(Ok(_)) => Ok(()),
                _ => Err(Error::CallFailed),
            }
        }

        /// Get token balance for an account by calling PolkaGuardToken contract
        fn get_token_balance(&self, account: AccountId) -> Result<Balance> {
            let call_result = ink::env::call::build_call::<ink::env::DefaultEnvironment>()
                .call(self.token)
                .transferred_value(0)
                .exec_input(
                    ink::env::call::ExecutionInput::new(
                        ink::env::call::Selector::new(ink::selector_bytes!("balance_of"))
                    )
                    .push_arg(account)
                )
                .returns::<Balance>()
                .try_invoke();

            match call_result {
                Ok(Ok(balance)) => Ok(balance),
                _ => Err(Error::CallFailed),
            }
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn constructor_works() {
            let token = AccountId::from([0x1; 32]);
            let contract = BountyDAO::new(token, 100, 1000);
            assert_eq!(contract.get_token(), token);
            assert_eq!(contract.get_min_tokens(), 100);
            assert_eq!(contract.get_threshold(), 1000);
            assert_eq!(contract.get_next_id(), 1);
        }

        #[ink::test] 
        fn default_works() {
            let contract = BountyDAO::default();
            assert_eq!(contract.get_token(), AccountId::from([0u8; 32]));
            assert_eq!(contract.get_min_tokens(), 0);
            assert_eq!(contract.get_threshold(), 0);
            assert_eq!(contract.get_next_id(), 1);
        }

        #[ink::test]
        fn proposal_creation_storage_works() {
            let token = AccountId::from([0x1; 32]);
            let mut contract = BountyDAO::new(token, 0, 1000); // Set min_tokens to 0 for testing
            let registry = AccountId::from([0x2; 32]);
            
            // Test storage operations without cross-contract calls
            let id = contract.next_id;
            contract.next_id = contract.next_id.checked_add(1).unwrap();
            
            let proposal = Proposal {
                proposer: AccountId::from([0x3; 32]),
                registry,
                proof_id: 1,
                votes_for: 0,
                votes_against: 0,
                status: ProposalStatus::Pending,
                created_at: 12345,
            };
            
            contract.proposals.insert(id, &proposal);
            let stored_proposal = contract.get_proposal(id).unwrap();
            assert_eq!(stored_proposal.registry, registry);
            assert_eq!(stored_proposal.proof_id, 1);
            assert_eq!(stored_proposal.status, ProposalStatus::Pending);
        }

        #[ink::test]
        fn vote_tracking_works() {
            let token = AccountId::from([0x1; 32]);
            let contract = BountyDAO::new(token, 0, 1000);
            let voter = AccountId::from([0x3; 32]);
            
            // Test vote tracking
            assert!(!contract.has_voted(1, voter));
            assert_eq!(contract.get_vote_weight(1, voter), None);
        }

        #[ink::test]
        fn owner_functions_work() {
            let token = AccountId::from([0x1; 32]);
            let mut contract = BountyDAO::new(token, 100, 1000);
            
            // Test threshold update
            assert!(contract.set_threshold(2000).is_ok());
            assert_eq!(contract.get_threshold(), 2000);
            
            // Test min tokens update  
            assert!(contract.set_min_tokens(200).is_ok());
            assert_eq!(contract.get_min_tokens(), 200);
        }
    }
}
