// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title BountyVault
 * @dev Manages bounty funds for approved exploit proofs
 */
contract BountyVault is Ownable, ReentrancyGuard {
    address public registry;
    mapping(uint64 => bool) public claimed;
    uint256 public bountyAmount;

    event Funded(address indexed from, uint256 amount);
    event Withdrawn(address indexed to, uint64 indexed proofId, uint256 amount);
    event BountyAmountSet(uint256 amount);
    event RegistrySet(address indexed registry);

    modifier onlyRegistry() {
        require(msg.sender == registry, "BountyVault: only registry can call");
        _;
    }

    modifier notClaimed(uint64 proofId) {
        require(!claimed[proofId], "BountyVault: bounty already claimed");
        _;
    }

    /**
     * @dev Constructor
     * @param _registry The address of the authorized registry
     * @param _bountyAmount The fixed bounty amount per proof (0 for dynamic)
     */
    constructor(address _registry, uint256 _bountyAmount) Ownable(msg.sender) {
        require(_registry != address(0), "BountyVault: zero registry address");
        registry = _registry;
        bountyAmount = _bountyAmount;
        emit RegistrySet(_registry);
        emit BountyAmountSet(_bountyAmount);
    }

    /**
     * @dev Receive function to accept Ether deposits
     */
    receive() external payable {
        emit Funded(msg.sender, msg.value);
    }

    /**
     * @dev Deposit funds into the vault
     */
    function fund() external payable {
        require(msg.value > 0, "BountyVault: must send funds");
        emit Funded(msg.sender, msg.value);
    }

    /**
     * @dev Withdraw bounty for approved proof (only registry)
     * @param proofId The ID of the approved proof
     * @param to The address to send the bounty to
     */
    function withdraw(uint64 proofId, address to) 
        external 
        onlyRegistry 
        notClaimed(proofId) 
        nonReentrant 
    {
        require(to != address(0), "BountyVault: zero recipient address");
        
        uint256 vaultBalance = address(this).balance;
        require(vaultBalance > 0, "BountyVault: no funds in vault");

        uint256 amount;
        if (bountyAmount > 0) {
            // Use fixed bounty amount if set
            require(vaultBalance >= bountyAmount, "BountyVault: insufficient funds");
            amount = bountyAmount;
        } else {
            // Use entire vault balance if no fixed amount
            amount = vaultBalance;
        }

        claimed[proofId] = true;

        // Transfer funds
        (bool success, ) = payable(to).call{value: amount}("");
        require(success, "BountyVault: transfer failed");

        emit Withdrawn(to, proofId, amount);
    }

    /**
     * @dev Check if bounty for proof ID is already claimed
     * @param proofId The proof ID to check
     * @return True if claimed, false otherwise
     */
    function isClaimed(uint64 proofId) external view returns (bool) {
        return claimed[proofId];
    }

    /**
     * @dev Get the authorized registry address
     * @return The registry address
     */
    function getRegistry() external view returns (address) {
        return registry;
    }

    /**
     * @dev Get the current vault balance
     * @return The balance in wei
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Get the fixed bounty amount
     * @return The bounty amount in wei (0 if dynamic)
     */
    function getBountyAmount() external view returns (uint256) {
        return bountyAmount;
    }

    /**
     * @dev Set the fixed bounty amount (only owner)
     * @param _bountyAmount The new bounty amount
     */
    function setBountyAmount(uint256 _bountyAmount) external onlyOwner {
        bountyAmount = _bountyAmount;
        emit BountyAmountSet(_bountyAmount);
    }

    /**
     * @dev Set the authorized registry address (only owner)
     * @param _registry The new registry address
     */
    function setRegistry(address _registry) external onlyOwner {
        require(_registry != address(0), "BountyVault: zero registry address");
        registry = _registry;
        emit RegistrySet(_registry);
    }

    /**
     * @dev Emergency withdraw (only owner)
     * @param to The address to send funds to
     * @param amount The amount to withdraw
     */
    function emergencyWithdraw(address to, uint256 amount) external onlyOwner nonReentrant {
        require(to != address(0), "BountyVault: zero recipient address");
        require(amount <= address(this).balance, "BountyVault: insufficient balance");

        (bool success, ) = payable(to).call{value: amount}("");
        require(success, "BountyVault: transfer failed");
    }

    /**
     * @dev Get contract information
     * @return _registry The registry address
     * @return _bountyAmount The fixed bounty amount
     * @return _balance The current balance
     * @return _owner The contract owner
     */
    function getInfo() external view returns (
        address _registry,
        uint256 _bountyAmount,
        uint256 _balance,
        address _owner
    ) {
        return (registry, bountyAmount, address(this).balance, owner());
    }
}
