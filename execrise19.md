# Debugging Scenario:
# Debugging Steps:

1. Noticed users could burn tokens even when they were locked.
2. Reviewed the `burn` function in the contract to identify potential oversights.
3. Identified the need to check if tokens are locked before allowing burning.

# Solution Implemented:

To prevent users from burning locked tokens, a straightforward check was added to the `burn` function.

## Updated `burn` Function:

```solidity
function burn(uint256 amount) external {
    require(_lockedBalances[msg.sender] == 0, "Cannot burn locked tokens");
    _burn(msg.sender, amount);
}
