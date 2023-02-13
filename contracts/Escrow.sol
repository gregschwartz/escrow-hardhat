// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Escrow {
	address public arbiter;
	address[] public beneficiaries;
	address public depositor;

	enum Status { Ready, Approved, Cancelled }
	Status public status;

	constructor(address _arbiter, address[] memory _beneficiaries) payable {
		arbiter = _arbiter;
		beneficiaries = _beneficiaries;
		depositor = msg.sender;
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
		status = Status.Approved;
	}

	event Cancelled(uint);

	function cancel() external {
		require(msg.sender == arbiter);
		uint balance = address(this).balance;

		(bool sent, ) = payable(depositor).call{value: balance}("");
		require(sent, "Failed to send Ether");

		emit Cancelled(balance);
		status = Status.Cancelled;
	}

}
