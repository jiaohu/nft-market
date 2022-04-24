const ERC721 = "ERC721"
const ERC1155 = "ERC1155"
const BACKEND = "BACKEND"

function contractAbi(type) {
    let file = null;
    switch (type) {
        case "ERC721":
            file = require('/Users/admin/solidity/nft-market/artifacts/contracts/NFT721.sol/NFT721.json')
            break;
        case "ERC1155":
            file = require("/Users/admin/solidity/nft-market/artifacts/contracts/NFT1155.sol/NFT1155.json")
            break;
        case "BACKEND":
            file = require("/Users/admin/solidity/nft-market/artifacts/contracts/NFTBackend.sol/NFTBackend.json");
            break;
    }
    return file || {};
}


module.exports = {
    contractAbi,
    ERC721,
    ERC1155,
    BACKEND,
}