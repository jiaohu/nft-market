// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "./tokens/ERC1155/ERC1155.sol";
import "./utils/Ownable.sol";
import "./tokens/ERC1155/extensions/ERC1155Supply.sol";

contract NFT1155 is ERC1155, Ownable, ERC1155Supply {

    mapping(uint256 => address) private creators;

    constructor(string memory tokenURIPrefix) ERC1155(tokenURIPrefix) {

    }

    function createNFT(address account, uint256 id, uint256 amount, string memory prefix, bytes memory data) public onlyOwner {
        require(creators[id] == address(0x0), "Token is already minted");
        creators[id] = msg.sender;
        _mint(account, id, amount, data);
        _setTokenURI(id, prefix);
    }

    function createBatch(address to, uint256[] memory ids, uint256[] memory amounts, string[] memory prefixs, bytes memory data) public onlyOwner {
        require(ids.length == amounts.length && ids.length == prefixs.length, "batch params length should be equal");
        for (uint i = 0; i < ids.length; i++) {
            require(creators[ids[i]] == address(0x0), "Token is already minted");
            creators[ids[i]] = msg.sender;
        }
        _mintBatch(to, ids, amounts, data);
        for (uint i = 0; i < ids.length; i++) {
            _setTokenURI(ids[i], prefixs[i]);
        }
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
