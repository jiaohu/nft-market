// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "./tokens/ERC1155/ERC1155.sol";
import "./utils/Ownable.sol";
import "./tokens/ERC1155/extensions/ERC1155Supply.sol";
import "hardhat/console.sol";

contract NFT1155 is ERC1155, Ownable, ERC1155Supply {

    mapping(uint256 => address) private creators;

    constructor(string memory tokenURIPrefix) ERC1155(tokenURIPrefix) {

    }

    function listingNFT(uint256 tokenId) public {
        return _listingNFT(tokenId);
    }

    function listingRecord(uint256 tokenId) public view returns (uint256) {
        return _listingRecord(tokenId);
    }

    function listingStatus(uint256 tokenId) public view returns (bool) {
        return _listingStatus(tokenId);
    }

    function cancelNFT(uint256 tokenId, uint256 recordId) public {
        _cancelNFT(tokenId, recordId);
    }

    function approvedTo(address _operator, bool _approved) public {
        console.log("approve from %s", msg.sender);
        console.log("approve %s", _operator);
        _setApprovalForAll(msg.sender, _operator, _approved);
    }

    function createNFT(address account, uint256 id, uint256 amount, string memory prefix, bytes memory data) public {
        require(creators[id] == address(0x0), "Token is already minted");
        creators[id] = msg.sender;
        _mint(account, id, amount, data);
        _setTokenURI(id, prefix);
    }

    function createBatch(address to, uint256[] memory ids, uint256[] memory amounts, string[] memory prefixs, bytes memory data) public {
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

    function burn(address account, uint256 id, uint256 value) public {
        require(
            account == msg.sender || isApprovedForAll(account, msg.sender),
            "ERC1155: caller is not owner nor approved"
        );

        _burn(account, id, value);
    }

    function burnBatch(address account, uint256[] memory ids, uint256[] memory values) public {
        require(
            account == msg.sender || isApprovedForAll(account, msg.sender),
            "ERC1155: caller is not owner nor approved"
        );

        _burnBatch(account, ids, values);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
