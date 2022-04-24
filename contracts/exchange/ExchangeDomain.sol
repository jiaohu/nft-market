// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

contract ExchangeDomain {




    enum AssertType {ERC1155, ERC721}

    struct Order {
        address signer; //  签名者，相当于是购买者
        /* random number */
        uint salt;
        address token; // 合约地址
        uint256 tokenId; // tokenid
        address owner; // NFT持有者
        AssertType tokenType; // token类型
    }

    /* An ECDSA signature. */
    struct Sig {
        /* v parameter */
        uint8 v;
        /* r parameter */
        bytes32 r;
        /* s parameter */
        bytes32 s;
    }
}
