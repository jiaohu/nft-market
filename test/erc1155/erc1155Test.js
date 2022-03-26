const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("erc1155", function () {

    // ethers.provider.on('debug', (info) => {
    //     console.log("begin ------------------")
    //     console.log("action:", info.action);
    //     console.log("request", info.request);
    //     console.log("response:", info.response);
    //     console.log("end ------------------")
    // });


    let contract;

    before(async function () {
        const blockInfoContract = await ethers.getContractFactory("NFT1155");
        contract = await blockInfoContract.deploy();
        await contract.deployed();
        console.log("contractAddress:", contract.address);
    });


    it("set uri", async () => {
        let tx = await contract.setURI("http://baidu.com")
        let reipt = await tx.wait()
        console.log(contract)
        console.log("pass")

    })


})