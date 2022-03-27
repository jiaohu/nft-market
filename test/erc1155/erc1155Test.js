const {ethers} = require("hardhat");
const {expect} = require("chai");
const {defaultAccounts} = require("ethereum-waffle");

// uri: https://ipfs.io/ipfs/QmSrKe2by16E921ZJGVJvH99BC5R8cG42i2QwBKMH7TTCm?filename=ac345982b2b7d0a2f86247cdcdef76094b369a33.jpeg

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
        contract = await blockInfoContract.deploy({tokenURIPrefix: "http://hello.io/"});
        await contract.deployed();
        console.log("contractAddress:", contract.address);
    });


    it("create", async () => {
        //  function mint(address account, uint256 id, uint256 amount, bytes memory data)
        await invokeMint("0xedfb055A0F3092b7Fa03A3269e2859C78840b23D", 1, 1, "http://my.hello.io", "0x675f")
    })

    async function invokeMint(account, id, amount, prefix, data) {
        let tx  = await contract.createNFT(account, id, amount, prefix, data)
        let reipt = await tx.wait()
        console.log("pass")
    }

    it("transfer", async () => {
        console.log("transfer")
        // 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
        invokeMint("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", 1, 1, "http://my.test.io", "0x675f")
        // function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _amount, bytes memory _data) public virtual override {
        let tx  = await contract.safeTransferFrom("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", 1, 1, "0x12")
        console.log(tx)
    })

})