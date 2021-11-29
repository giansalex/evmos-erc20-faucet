pragma solidity >=0.7.0 <0.9.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.2.0/contracts/token/ERC20/ERC20.sol";

contract NationToken is ERC20 {

    constructor () ERC20("Nation Token", "NTN") {
        _mint(msg.sender, 10000000 * (10 ** uint256(decimals())));
    }

    function mint(address to, uint256 value) public returns (bool) {
        require(value <= 1000 * (10 ** uint256(decimals())), "dont be greedy");
        _mint(to, value);
        return true;
    }
}