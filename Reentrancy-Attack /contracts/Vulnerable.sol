// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vulnerable {
    mapping(address => uint) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public{
        uint bal = balances[msg.sender];
        require(bal > 0);// eth >0

        (bool sent, ) = msg.sender.call{value: bal}("");//contract transfet to msg.sender
        require(sent, "Failed to send Ether");

        balances[msg.sender] = 0;
    }

    function callerAddress() public view returns(address){
        return msg.sender;
    }

}