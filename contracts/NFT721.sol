// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "./tokens/ERC721/ERC721.sol";
import "./tokens/ERC721/extensions/ERC721Burnable.sol";
import "./utils/Counters.sol";

contract NFT721 is ERC721, ERC721Burnable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("MyToken", "MTK") {}

    function createNFT(address to) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }
}
