// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "./tokens/ERC721/ERC721.sol";
import "./tokens/ERC721/extensions/ERC721Burnable.sol";
import "./utils/Counters.sol";

contract NFT721 is ERC721, ERC721Burnable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor(string memory tokenURIPrefix) ERC721("MyToken", "MTK", tokenURIPrefix) {}

    function createNFT(address to, uint256 tokenId, string memory tokenURI) public {
        //        uint256 tokenId = _tokenIdCounter.current();
        //        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    function listingNFT(uint256 tokenId) public {
        _listingNFT(tokenId);
    }

    function cancelNFT(uint256 tokenId) public {
        _cancelListNFT(tokenId);
    }

    function listingStatus(uint256 tokenId) public view returns (bool) {
        return _listingStatus(tokenId);
    }
}
