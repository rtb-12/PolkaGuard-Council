// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title PolkaGuardToken
 * @dev ERC20 governance token for the PolkaGuard-Council DAO
 */
contract PolkaGuardToken is ERC20, Ownable, Pausable {
    uint8 private _decimals;
    
    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     * @param _name The name of the token
     * @param _symbol The symbol of the token
     * @param _decimalsValue The number of decimals for the token
     * @param _initialSupply The initial supply of tokens
     */
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimalsValue,
        uint256 _initialSupply
    ) ERC20(_name, _symbol) Ownable(msg.sender) {
        _decimals = _decimalsValue;
        _mint(msg.sender, _initialSupply * 10**_decimalsValue);
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Mints new tokens to the specified address (only owner)
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "PolkaGuardToken: mint to zero address");
        _mint(to, amount);
        emit Mint(to, amount);
    }

    /**
     * @dev Burns tokens from the caller's account
     * @param amount The amount of tokens to burn
     */
    function burn(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "PolkaGuardToken: burn amount exceeds balance");
        _burn(msg.sender, amount);
        emit Burn(msg.sender, amount);
    }

    /**
     * @dev Burns tokens from a specific account (requires allowance)
     * @param from The account to burn tokens from
     * @param amount The amount of tokens to burn
     */
    function burnFrom(address from, uint256 amount) external {
        require(allowance(from, msg.sender) >= amount, "PolkaGuardToken: burn amount exceeds allowance");
        uint256 currentAllowance = allowance(from, msg.sender);
        _approve(from, msg.sender, currentAllowance - amount);
        _burn(from, amount);
        emit Burn(from, amount);
    }

    /**
     * @dev Pauses all token transfers (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses all token transfers (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Hook that is called before any transfer of tokens.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }

    /**
     * @dev Returns the token balance for an account (for cross-contract calls)
     * @param account The account to check balance for
     */
    function balanceOf(address account) public view override returns (uint256) {
        return super.balanceOf(account);
    }
}
