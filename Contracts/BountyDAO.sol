// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../PolkaGuardToken/PolkaGuardToken.sol";
import "../ExploitProofRegistry/ExploitProofRegistry.sol";

/**
 * @title BountyDAO
 * @dev Decentralized governance contract for PolkaGuard-Council
 */
contract BountyDAO is Ownable, ReentrancyGuard {
    enum ProposalStatus {
        Pending,
        Approved,
        Rejected,
        Executed
    }

    struct Proposal {
        address proposer;
        address registry;
        uint64 proofId;
        uint256 votesFor;
        uint256 votesAgainst;
        ProposalStatus status;
        uint256 createdAt;
    }

    PolkaGuardToken public token;
    uint256 public minTokens;
    mapping(uint64 => Proposal) public proposals;
    uint64 public nextId;
    uint256 public threshold;
    mapping(uint64 => mapping(address => uint256)) public votes; // proposalId => voter => weight
    mapping(uint64 => mapping(address => bool)) public hasVoted; // proposalId => voter => bool

    event ProposalCreated(
        uint64 indexed id,
        address indexed proposer,
        uint64 proofId,
        address registry
    );

    event Voted(
        uint64 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 weight
    );

    event ProposalExecuted(
        uint64 indexed id,
        address registry,
        uint64 proofId
    );

    event ThresholdUpdated(uint256 newThreshold);
    event MinTokensUpdated(uint256 newMinTokens);

    modifier hasMinTokens() {
        require(
            token.balanceOf(msg.sender) >= minTokens,
            "BountyDAO: insufficient token balance"
        );
        _;
    }

    modifier validProposal(uint64 proposalId) {
        require(proposalId > 0 && proposalId < nextId, "BountyDAO: invalid proposal ID");
        _;
    }

    modifier proposalPending(uint64 proposalId) {
        require(
            proposals[proposalId].status == ProposalStatus.Pending,
            "BountyDAO: proposal not pending"
        );
        _;
    }

    /**
     * @dev Constructor
     * @param _token The governance token contract address
     * @param _minTokens Minimum tokens required to participate
     * @param _threshold Minimum votes required to approve a proposal
     */
    constructor(
        address _token,
        uint256 _minTokens,
        uint256 _threshold
    ) Ownable(msg.sender) {
        require(_token != address(0), "BountyDAO: zero token address");
        token = PolkaGuardToken(_token);
        minTokens = _minTokens;
        threshold = _threshold;
        nextId = 1;
    }

    /**
     * @dev Create a new proposal to approve a proof
     * @param registry The ExploitProofRegistry contract address
     * @param proofId The ID of the proof to approve
     * @return id The ID of the created proposal
     */
    function createProposal(address registry, uint64 proofId) 
        external 
        hasMinTokens 
        returns (uint64 id) 
    {
        require(registry != address(0), "BountyDAO: zero registry address");
        
        id = nextId++;

        proposals[id] = Proposal({
            proposer: msg.sender,
            registry: registry,
            proofId: proofId,
            votesFor: 0,
            votesAgainst: 0,
            status: ProposalStatus.Pending,
            createdAt: block.timestamp
        });

        emit ProposalCreated(id, msg.sender, proofId, registry);
    }

    /**
     * @dev Vote on a proposal
     * @param proposalId The ID of the proposal to vote on
     * @param support True to vote for, false to vote against
     */
    function vote(uint64 proposalId, bool support) 
        external 
        validProposal(proposalId) 
        proposalPending(proposalId) 
        hasMinTokens 
    {
        require(!hasVoted[proposalId][msg.sender], "BountyDAO: already voted");

        uint256 voterBalance = token.balanceOf(msg.sender);
        require(voterBalance >= minTokens, "BountyDAO: insufficient tokens");

        Proposal storage proposal = proposals[proposalId];
        
        if (support) {
            proposal.votesFor += voterBalance;
        } else {
            proposal.votesAgainst += voterBalance;
        }

        votes[proposalId][msg.sender] = voterBalance;
        hasVoted[proposalId][msg.sender] = true;

        emit Voted(proposalId, msg.sender, support, voterBalance);
    }

    /**
     * @dev Execute an approved proposal
     * @param proposalId The ID of the proposal to execute
     */
    function execute(uint64 proposalId) 
        external 
        validProposal(proposalId) 
        proposalPending(proposalId) 
        hasMinTokens 
        nonReentrant 
    {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.votesFor >= threshold, "BountyDAO: threshold not met");

        proposal.status = ProposalStatus.Executed;

        // Call ExploitProofRegistry to approve the proof
        ExploitProofRegistry registry = ExploitProofRegistry(proposal.registry);
        
        try registry.approveProof(proposal.proofId) {
            emit ProposalExecuted(proposalId, proposal.registry, proposal.proofId);
        } catch {
            // Revert status change if call fails
            proposal.status = ProposalStatus.Pending;
            revert("BountyDAO: failed to approve proof");
        }
    }

    /**
     * @dev Get proposal details
     * @param proposalId The ID of the proposal
     * @return proposal The proposal details
     */
    function getProposal(uint64 proposalId) 
        external 
        view 
        validProposal(proposalId) 
        returns (Proposal memory proposal) 
    {
        return proposals[proposalId];
    }

    /**
     * @dev Get next proposal ID
     * @return The next proposal ID
     */
    function getNextId() external view returns (uint64) {
        return nextId;
    }

    /**
     * @dev Get voting threshold
     * @return The voting threshold
     */
    function getThreshold() external view returns (uint256) {
        return threshold;
    }

    /**
     * @dev Get minimum tokens required
     * @return The minimum token requirement
     */
    function getMinTokens() external view returns (uint256) {
        return minTokens;
    }

    /**
     * @dev Get token contract address
     * @return The token contract address
     */
    function getToken() external view returns (address) {
        return address(token);
    }

    /**
     * @dev Check if user has voted on a proposal
     * @param proposalId The proposal ID
     * @param voter The voter address
     * @return True if voted, false otherwise
     */
    function getUserVoteStatus(uint64 proposalId, address voter) 
        external 
        view 
        returns (bool) 
    {
        return hasVoted[proposalId][voter];
    }

    /**
     * @dev Get user's vote weight for a proposal
     * @param proposalId The proposal ID
     * @param voter The voter address
     * @return The vote weight
     */
    function getVoteWeight(uint64 proposalId, address voter) 
        external 
        view 
        returns (uint256) 
    {
        return votes[proposalId][voter];
    }

    /**
     * @dev Update threshold (only owner)
     * @param newThreshold The new voting threshold
     */
    function setThreshold(uint256 newThreshold) external onlyOwner {
        threshold = newThreshold;
        emit ThresholdUpdated(newThreshold);
    }

    /**
     * @dev Update minimum tokens (only owner)
     * @param newMinTokens The new minimum token requirement
     */
    function setMinTokens(uint256 newMinTokens) external onlyOwner {
        minTokens = newMinTokens;
        emit MinTokensUpdated(newMinTokens);
    }

    /**
     * @dev Setup ExploitProofRegistry integration (only owner)
     * @param registry The registry contract address
     */
    function setupRegistryIntegration(address registry) external onlyOwner {
        require(registry != address(0), "BountyDAO: zero registry address");
        
        ExploitProofRegistry registryContract = ExploitProofRegistry(registry);
        
        try registryContract.transferOwnership(address(this)) {
            // Registry ownership transferred successfully
        } catch {
            revert("BountyDAO: failed to transfer registry ownership");
        }
    }

    /**
     * @dev Setup BountyVault integration for a registry (only owner)
     * @param registry The registry contract address
     * @param vault The vault contract address
     */
    function setupVaultIntegration(address registry, address vault) external onlyOwner {
        require(registry != address(0), "BountyDAO: zero registry address");
        require(vault != address(0), "BountyDAO: zero vault address");

        ExploitProofRegistry registryContract = ExploitProofRegistry(registry);
        
        try registryContract.setBountyVault(vault) {
            // Vault integration setup successfully
        } catch {
            revert("BountyDAO: failed to setup vault integration");
        }
    }

    /**
     * @dev Get token balance for an account
     * @param account The account to check
     * @return The token balance
     */
    function getTokenBalance(address account) external view returns (uint256) {
        return token.balanceOf(account);
    }

    /**
     * @dev Get contract owner
     * @return The owner address
     */
    function getOwner() external view returns (address) {
        return owner();
    }
}
