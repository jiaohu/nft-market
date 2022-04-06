// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

contract OperatorRole {
    mapping (address => bool) private _operators;

    event OperatorAdded(address indexed account);
    event OperatorRemoved(address indexed account);

    constructor() {}

    modifier onlyOperator() {
        require(isOperator(msg.sender), "OperatorRole: caller does not have the Operator role");
        _;
    }

    function isOperator(address account) public view returns (bool) {
        return _operators[account];
    }

    function _addOperator(address account) internal {
        _operators[account] = true;
        emit OperatorAdded(account);
    }

    function _removeOperator(address account) internal {
        _operators[account] = false;
        emit OperatorRemoved(account);
    }

}
