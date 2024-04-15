// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AdvancedToken is ERC20, Ownable {
    mapping(address => uint256) private _lockedBalances;
    mapping(address => uint256) private _unlockTimestamps;

    uint256 private _maxSupply;

    event TokensLocked(address indexed user, uint256 amount, uint256 unlockTimestamp);
    event TokensUnlocked(address indexed user, uint256 amount);

    constructor(string memory name_, string memory symbol_, uint256 maxSupply_) ERC20(name_, symbol_) {
        _maxSupply = maxSupply_;
    }

    function lockTokens(address user, uint256 amount, uint256 duration) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(user) >= amount, "Insufficient balance");

        _lockedBalances[user] += amount;
        _unlockTimestamps[user] = block.timestamp + duration;

        emit TokensLocked(user, amount, _unlockTimestamps[user]);
    }

    function unlockTokens() external {
        require(_lockedBalances[msg.sender] > 0, "No tokens to unlock");
        require(block.timestamp >= _unlockTimestamps[msg.sender], "Tokens are still locked by owner");

        uint256 amount = _lockedBalances[msg.sender];
        _lockedBalances[msg.sender] = 0;
        _unlockTimestamps[msg.sender] = 0;

        emit TokensUnlocked(msg.sender, amount);

        _transfer(address(this), msg.sender, amount);
    }

    function mint(address account, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= _maxSupply, "Exceeds maximum supply of the token");
        _mint(account, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    function lockedBalanceOf(address account) external view returns (uint256) {
        return _lockedBalances[account];
    }

    function unlockTimestampOf(address account) external view returns (uint256) {
        return _unlockTimestamps[account];
    }

    function maxSupply() external view returns (uint256) {
        return _maxSupply;
    }
}
