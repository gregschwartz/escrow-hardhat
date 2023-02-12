// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Escrow {
	address public arbiter;
	address[] public beneficiaries;
	address[] public depositors;

	bool public isApproved;

	constructor(address _arbiter, address[] memory _beneficiaries) payable {
		arbiter = _arbiter;
		beneficiaries = _beneficiaries;
		depositors.push(msg.sender);
	}

	//allow multiple depositors
	function deposit() public payable {
		depositors.push(msg.sender);
	}

	event Approved(uint);

	function approve() external {
		require(msg.sender == arbiter);
		uint balance = address(this).balance;
		uint amount = balance / beneficiaries.length;

		for (uint i=0; i<beneficiaries.length; i++){
			(bool sent, ) = payable(beneficiaries[i]).call{value: amount}("");
			require(sent, "Failed to send Ether");
		}
		emit Approved(balance);
		isApproved = true;
	}
}
