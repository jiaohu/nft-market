var utils = require("./utils.js");
const {ethers} = require("hardhat");

async function createNFT1155(tokenPrefix) {
    try {
        const nft1155 = await ethers.getContractFactory("NFT1155");
        return await nft1155.deploy({tokenURIPrefix: tokenPrefix});
    } catch (e) {
        return {error: e.message};
    }
}

async function createNFTBackend() {
    try {
        const backend = await ethers.getContractFactory("NFTBackend");
        return await backend.deploy();
    } catch (e) {
        return {error: e.message};
    }
}

async function deploy() {
    var filename = "./address_ambg_list.json";
    var data = await utils.readJsonFile(filename);
    console.log("data", data);
    console.log("start deploying...");
    var result = null;
    if (!data.NFT1155) {
        result = await createNFT1155("http://test.io/");
        if (result.error) {
            console.log("create NFT1155 error", result.error, (await ethers.getSigner()).address);
            process.exit();
        }
        console.log("create NFT1155 address:", result.address);
        data.NFT1155 = {
            address: result.address
        }
        await utils.writeJsonFile(filename, data);
    }
    if (!data.NFTBackend) {
        result = await createNFTBackend();
        if (result.error) {
            console.log("create NFTBackend error", result.error, (await ethers.getSigner()).address);
            process.exit();
        }
        console.log("create NFTBackend address:", result.address);
        data.NFTBackend = {
            address: result.address
        }
        await utils.writeJsonFile(filename, data);
    }
}

deploy();