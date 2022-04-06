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

async function createTransferProxy() {
    try {
        const proxy = await ethers.getContractFactory("TransferProxy");
        return await proxy.deploy();
    } catch (e) {
        return {error: e.message};
    }
}

async function createOrderHolders() {
    try {
        const holder = await ethers.getContractFactory("ExchangeOrdersHolder");
        return await holder.deploy();
    } catch (e) {
        return {error: e.message};
    }
}

async function createNFTBackend(_proxy, _ordersHolder) {
    try {
        const backend = await ethers.getContractFactory("NFTBackend");
        return await backend.deploy(_proxy, _ordersHolder);
    } catch (e) {
        return {error: e.message};
    }
}

async function deploy() {
    var filename = "./hello.json";
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
    if (!data.transferProxy) {
        console.log("create TransferProxy...");
        result = await createTransferProxy();
        if (result.error) {
            console.log("create TransferProxy error", result.error, (await ethers.getSigner()).address);
            process.exit();
        }
        console.log("create TransferProxy address:", result.address);
        data.transferProxy = {
            address: result.address,
        };
        await utils.writeJsonFile(filename, data);
    }

    if (!data.exchangeOrderHolder) {
        console.log("create ExchangeOrderHolder...");
        result = await createOrderHolders();
        if (result.error) {
            console.log("create ExchangeOrderHolder error", result.error, (await ethers.getSigner()).address);
            process.exit();
        }
        console.log("create ExchangeOrderHolder address:", result.address);
        data.exchangeOrderHolder = {
            address: result.address,
        }
        await utils.writeJsonFile(filename, data);
    }
    if (!data.NFTBackend) {
        result = await createNFTBackend(data.transferProxy.address, data.exchangeOrderHolder.address);
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