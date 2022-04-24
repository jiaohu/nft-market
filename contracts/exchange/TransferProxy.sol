// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "../interfaces/IERC1155.sol";
import "./OperatorRole.sol";
import "hardhat/console.sol";
import "../utils/Ownable.sol";

contract TransferProxy is OperatorRole, Ownable {

    function addOperator(address operator) public onlyOwner {
        _addOperator(operator);
    }

    function erc1155safeTransferFrom(IERC1155 token, address from, address to, uint256 id, uint256 value, bytes calldata data) external onlyOperator {
        console.log(msg.sender);
        token.safeTransferFrom(from, to, id, value, data);
    }

    function erc1155safeBatchTransferFrom(IERC1155 token, address _from, address _to, uint256[] calldata _ids, uint256[] calldata _amounts, bytes calldata _data) external onlyOperator {
        token.safeBatchTransferFrom(_from, _to, _ids, _amounts, _data);
    }
}
