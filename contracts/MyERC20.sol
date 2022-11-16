// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// contract MyERC20 is ERC20 {
//  constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {
//   _mint(msg.sender, initialSupply);
//  }
// }

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MyERC20 is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("MyToken", "MTK") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}


// pragma solidity ^0.8.9;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/AccessControl.sol";

// contract MyToken is ERC20, AccessControl {
//     bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

//     constructor() ERC20("MyToken", "MTK") {
//         _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
//         _grantRole(MINTER_ROLE, msg.sender);
//     }

//     function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
//         _mint(to, amount);
//     }
// }
