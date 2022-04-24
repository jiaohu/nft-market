const {ethers} = require("hardhat");
const {expect} = require("chai");
const utils_abi = require("../utils/abi.js")

describe("NFT721", function () {

    let contract;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    async function createNFT(user, to) {
        await contract.connect(user).createNFT(to)
    }
    it("create", async () => {
        const contract721 = await ethers.getContractFactory("NFT721");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        contract = await contract721.deploy();
        await createNFT(owner, owner.address)
        await createNFT(owner, owner.address)
        await createNFT(owner, owner.address)
        await createNFT(addr1, addr1.address)
        expect(await contract.connect(owner).balanceOf(owner.address)).to.equal(3)
        expect(await contract.connect(addr1).balanceOf(addr1.address)).to.equal(1)
    }).timeout(30000)
})