const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("backend", function () {

    let contract;

    before(async function () {

        const transferProxy = await ethers.getContractFactory("TransferProxy");
        let transferContract = await transferProxy.deploy();
        console.log("transfer", transferContract.address)

        const exchangeOrdersHolder = await ethers.getContractFactory("ExchangeOrdersHolder")
        let exchangeOrdersContract = await exchangeOrdersHolder.deploy()
        console.log("exchangeOrdersContract", exchangeOrdersContract.address)

        const backend = await ethers.getContractFactory("NFTBackend")
        contract = await backend.deploy(transferContract.address, exchangeOrdersContract.address);
        console.log("contractAddress:", contract.address);
    });


    // it("create",  async () =>  {
    //     await contract.setServerAccount("0xb5D6146b0220A9DDd463503353951cf701D8e1F8");
    //     await contract.setServerRate(20);
    //     // buyNFT(Order calldata order, Sig calldata sig, uint256 fee, uint256 amount, address buyer)
    //     let order = {key: {owner: 0x861456ba02df1eafb4f0afedbbe0f8e4043ee2e3} };
    //     let sig = {v: 27, r: 0x7846ee3eb649c18dc5bb8a391f88789c16037900b3b76ad7e1a143552020a451, s: 0x4b12420a4d7ed19a861ae7bb5fdb5502555c4e89b47f6d99f49deebc54b1dbff};
    //     await contract.buyNFT(order, sig, 1000, 2, "0x861456bA02dF1EaFB4f0AFeDBBe0F8e4043ee2e3");
    // })
    it("sign", async () => {
        const signer = ethers.getSigner()
        const ethAddress = (await signer).address
        console.log(ethAddress)
        const hash = ethers.utils.keccak256(ethAddress)
        console.log(hash)
        const sig = (await signer).signMessage(ethers.utils.arrayify(hash))
        let b = ethers.utils.splitSignature('0x0cb5f2707779110c28efda5e2851758a6efaf578ac497b5ea346a622523bd3781d2e53642fada98a44b46ed9eb2a47a296751737df7deea330d3cb05836f00721b')
        console.log(b)
        let a = ethers.utils.verifyMessage(ethers.utils.arrayify(hash), (await sig).toLowerCase())
        console.log(a)
        console.log(a === ethAddress)
    })

})