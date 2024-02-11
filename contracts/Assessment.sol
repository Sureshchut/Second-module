// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event AccountDisconnected(address account);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        require(checkOwner(msg.sender), "You are not the owner of this account");

        uint _previousBalance = balance;

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    function withdraw(uint256 _withdrawAmount) public {
        require(checkOwner(msg.sender), "You are not the owner of this account");

        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    function checkOwner(address _address) public view returns(bool) {
        return _address == owner;
    }

    function disconnectAccount() public {
        require(msg.sender == owner, "You are not the owner of this account");

        // Emit event to indicate account disconnection
        emit AccountDisconnected(owner);

        // Reset owner address to address(0)
        owner = payable(address(0));
    }

    function getTransactionStatus(bytes32 _txHash) public view returns(string memory) {
        return "Transaction status: Successful";
    }
}
