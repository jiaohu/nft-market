const {ethers} = require("hardhat");
const {expect} = require("chai");
const utils_abi = require("../utils/abi.js")

describe("NFT721", function () {

    let contract;
    let backend;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    async function createContract() {
        const contract721 = await ethers.getContractFactory("NFT721");
        contract = await contract721.deploy({tokenURIPrefix: "https://hello.io/"});
        await contract.deployed();
    }

    async function createBackend() {
        const backendContract = await ethers.getContractFactory("NFTBackend");
        backend = await backendContract.deploy()
        await backend.deployed();
    }

    async function initUser() {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    }

    async function createNFT(user, to, tokenId, uri) {
        await contract.connect(user).createNFT(to, tokenId, uri)
    }

    async function setApproveForAll(user, operator, approved) {
        await contract.connect(user).setApprovalForAll(operator, approved)
    }

    async function isApprovedForAll(user, owner, address) {
        return await contract.connect(user).isApprovedForAll(owner, address);
    }

    async function listingNFT(user, tokenId) {
        await contract.connect(user).listingNFT(tokenId);
    }

    async function cancelNFT(user, tokenId) {
        await contract.connect(user).cancelNFT(tokenId)
    }

    async function listingStatus(user, tokenId) {
        return await contract.connect(user).listingStatus(tokenId)
    }

    // --------------------------------------------
    // |              platform                    |
    // --------------------------------------------
    async function invokeSetRate(user, rate) {
        await backend.connect(user).setServerRate(rate)
    }

    async function getServerRate(user) {
        return await backend.connect(user).serverRate()
    }

    async function invokeSetServerAccount(user, account) {
        await backend.connect(user).setServerAccount(account)
    }

    async function invokeServerAccount(user) {
        return await backend.connect(user).serverAccount();
    }

    async function invokeBuyNFT(user, order, sig, fee, amount, buyer, value) {
        let tx = await backend.connect(user).buyNFT(order, sig, fee, amount, buyer, {
            value: value,
        })
        return await tx.wait()
    }

    async function invokeTransferOwnership(user, addr) {
        return await backend.connect(user).transferOwnership(addr)
    }

    async function invokeOwner(user) {
        return await backend.connect(user).owner();
    }

    it("create", async () => {
        await createContract();
        await initUser();
        await createNFT(owner, owner.address, 1, "http")
        await createNFT(owner, owner.address, 2, "http")
        await createNFT(owner, owner.address, 3, "http")
        await createNFT(addr1, addr1.address, 4, "http")
        expect(await contract.connect(owner).balanceOf(owner.address)).to.equal(3)
        expect(await contract.connect(addr1).balanceOf(addr1.address)).to.equal(1)
    }).timeout(30000)

    it("approveAll", async () => {
        await createContract();
        await initUser();
        await createBackend()
        await createNFT(owner, owner.address, 1, "http")
        await setApproveForAll(owner, backend.address, true)
        expect(await isApprovedForAll(owner, owner.address, backend.address)).to.equal(true)
    }).timeout(30000)


    it("listing", async () => {
        await createContract();
        await initUser();
        await createBackend()
        await createNFT(owner, owner.address, 1, "http")
        await setApproveForAll(owner, backend.address, true)
        expect(await isApprovedForAll(owner, owner.address, backend.address)).to.equal(true)
        await listingNFT(owner, 1)
        expect(await listingStatus(owner, 1)).to.equal(true)
    }).timeout(30000)


    it("buyNFT", async () => {
        await createContract();
        await initUser();
        await createBackend()
        await invokeSetRate(owner, 1000) // 设置rate
        await invokeSetServerAccount(owner, owner.address) // 设置收款账户
        console.log("backend", backend.address)

        // addr1 创建NFT
        await createNFT(addr1, addr1.address, 1, "http");
        // addr1 setApprove
        await setApproveForAll(addr1, backend.address, true);
        expect(await isApprovedForAll(addr1, addr1.address, backend.address)).to.equal(true)
        // addr1 list
        await listingNFT(addr1, 1)

        // addr2 buy
        let order = [addr2.address, 2345, contract.address, 1, addr1.address, 1]
        let encodedData = ethers.utils.defaultAbiCoder.encode(["address", "uint256", "address", "uint256", "address", "uint8"], order);
        const orderData = ethers.utils.keccak256(encodedData)
        const sig = (await addr2).signMessage(orderData.substring(2))
        let a = ethers.utils.splitSignature(await sig)
        console.log(a)
        let siggg = [a.v, a.r, a.s]
        console.log("before buy")
        console.log("serveAccount balance", await owner.getBalance())
        console.log("owner of nft balance", await addr1.getBalance())
        console.log("buyer of nft balance", await addr2.getBalance())
        await invokeBuyNFT(addr2, order, siggg, 100, 1, addr2.address, 110)
        console.log("after buy")
        console.log("serveAccount balance", await owner.getBalance())
        console.log("owner of nft balance", await addr1.getBalance())
        console.log("buyer of nft balance", await addr2.getBalance())
    }).timeout(30000)


})