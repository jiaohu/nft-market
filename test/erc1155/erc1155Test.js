var utils = require("./utils.js");
var conf = require("./config.js")
const {ethers} = require("hardhat");
const {defaultAbiCoder} = require("ethers/lib/utils");
const eth_util = require("ethereumjs-util");

// uri: https://ipfs.io/ipfs/QmSrKe2by16E921ZJGVJvH99BC5R8cG42i2QwBKMH7TTCm?filename=ac345982b2b7d0a2f86247cdcdef76094b369a33.jpeg


const {expect} = require("chai");
const utils_abi = require("../utils/abi.js")


describe("NFT1155", function () {

    let contract;
    let backend;
    let owner;
    let addr1;
    let addr2;
    let addrs;


    async function initUser() {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    }

    async function createContract() {
        const blockInfoContract = await ethers.getContractFactory("NFT1155");
        contract = await blockInfoContract.deploy({tokenURIPrefix: "https://hello.io/"});
        await contract.deployed();
        await initUser();
    }

    async function createBackend() {
        const backendContract = await ethers.getContractFactory("NFTBackend");
        backend = await backendContract.deploy()
        await backend.deployed();
    }

    // --------------------------------------------
    // |              user                        |
    // --------------------------------------------
    async function invokeMint(user, account, id, amount, prefix, data) {
        let tx = await contract.connect(user).createNFT(account, id, amount, prefix, data)
        return tx.wait()
    }

    async function invokeSetApprove(user, addr) {
        let tx = await contract.connect(user).approvedTo(addr, true)
        await tx.wait()
    }

    async function invokeIsApprovedForAll(user, addr) {
        return await contract.connect(user).isApprovedForAll(user.address, addr)
    }

    async function listing(user, id) {
        return await contract.connect(user).listingNFT(id)
    }

    async function listingRecord(user, id) {
        return await contract.connect(user).listingRecord(id)
    }

    async function cancel(user, id, recordId) {
        let tx = await contract.connect(user).cancelNFT(id, recordId)
        await tx.wait()
    }

    async function invokeListingStatus(user, tokenId) {
        return contract.connect(user).listingStatus(tokenId)
    }

    async function getBalance(user, id) {
        return await contract.connect(user).balanceOf(owner.address, id);
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


    describe("user", function () {
        it("createNFT", async () => {
            await createContract();
            await invokeMint(owner, owner.address, 1, 3, "https://hello.io/", "0x675f");
            expect(await contract.connect(owner).balanceOf(owner.address, 1)).to.equal(3)
        }).timeout(30000)

        it("approve", async () => {
            await createContract();
            await invokeMint(owner, owner.address, 1, 3, "https://hello.io/", "0x675f");
            await createBackend();
            expect(await invokeIsApprovedForAll(owner, backend.address)).to.equal(false);
            await invokeSetApprove(owner, backend.address);
            let x = await invokeIsApprovedForAll(owner, backend.address);
            expect(x).to.equal(true);
        }).timeout(30000)

        it("list", async () => {
            await createContract();
            await invokeMint(owner, owner.address, 1, 3, "https://hello.io/", "0x675f");
            let a = await getBalance(owner, 1);
            await listing(owner, 1)
            expect(await listingRecord(owner, 1)).to.equal(1)

            await invokeMint(owner, owner.address, 2, 3, "https://hello.io/", "0x675f");
            await listing(owner, 2)
            expect(await listingRecord(owner, 2)).to.equal(2)
        }).timeout(30000)

        it("cancel", async () => {
            await createContract();
            await invokeMint(owner, owner.address, 1, 3, "https://hello.io/", "0x675f");
            let a = await getBalance(owner, 1);
            await listing(owner, 1)
            let status1 = await invokeListingStatus(owner, 1)
            expect(status1).to.equal(true)
            let recordId = await listingRecord(owner, 1);
            expect(recordId).to.equal(1)
            await cancel(owner, 1, recordId)
            let status2 = await invokeListingStatus(owner, 1)
            expect(status2).to.equal(false)
        }).timeout(30000)
    })

    describe("platform", function () {
        it("rate", async () => {
            await initUser()
            await createBackend()
            await invokeSetRate(owner, 1000)
            let rate = await getServerRate(owner)
            expect(rate).to.equal(1000)
            expect(await invokeOwner(owner)).to.equal(owner.address)
        }).timeout(30000)

        it("serverAccount", async () => {
            await initUser()
            await createBackend()
            await invokeSetServerAccount(owner, addr1.address)
            expect(await invokeServerAccount(owner)).to.equal(addr1.address)
        }).timeout(30000)

        it("transferOwner", async () => {
            await initUser()
            await createBackend()
            expect(await invokeOwner(owner)).to.equal(owner.address)
            await invokeTransferOwnership(owner, addr1.address)
            expect(await invokeOwner(owner)).to.equal(addr1.address)
        }).timeout(30000)

        it("buyNFT", async () => {
            // 部署合约
            await createContract();
            await createBackend()
            await invokeSetRate(owner, 1000) // 设置rate
            await invokeSetServerAccount(owner, owner.address) // 设置收款账户
            console.log("backend", backend.address)

            // addr1 创建NFT
            await invokeMint(addr1, addr1.address, 1, 2, "https://hello.io/", "0x675f");
            // addr1 setApprove
            await invokeSetApprove(addr1, backend.address);
            // addr1 list
            await listing(addr1, 1)

            // addr2 buy
            let order = [addr2.address, 2345, contract.address, 1, addr1.address, 0]
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

})
