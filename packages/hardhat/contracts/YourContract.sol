//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
// import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
//import "@openzeppelin/contracts/access/Ownable.sol";
//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourContract {

	uint256 public price = 0.01 ether;
	mapping (address => uint256) public balanceOf;
	uint8 public NUM = 100;
	uint8 public DEN = 93;


	function buy() public payable {
		require(msg.value == price, "Not enough Ether sent");
		balanceOf[msg.sender] += 1;
		price = (price * NUM) / DEN;
	}

	function sell() public {
		require(balanceOf[msg.sender] > 0, "You don't have any tokens");
		balanceOf[msg.sender] -= 1;
		price = ((price * DEN) / NUM) +1;
		payable(msg.sender).transfer(price);
		
	}


	/**
	 * Function that allows the contract to receive ETH
	 */
	receive() external payable {}
}
