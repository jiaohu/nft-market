var Web3 = require('web3');
const InputDataDecoder = require('ethereum-input-data-decoder');
var web3 = new Web3('http://node.arcscan.io');
var conf = require("./config.js")


describe("test", function () {
    it("transfer", async () => {
        // TODO 改成你的账户
        web3.eth.defaultAccount = '0x635F555F77D0491842590d9e64C2450a31780E5E';
        // try {
        //     let from = await web3.eth.accounts[0]
        //     console.log(from)
        // } catch (e) {
        //     console.log(e)
        // }
        // TODO 填你的私钥
        let privateKEY = "e8a429fbde5db05ec659edd9afcb1b7741cb784ea8aca3eb436768cd901a4f15"
        let contractAddress = "0x1217cf38b0d2d1508F13149C252E665233c686Bb"
        let myContract = new web3.eth.Contract(await file_util.readJsonFile("　../../artifacts/contracts/NFT1155.sol/NFT1155.json").abi, contractAddress);
        // 编码abi
        let funcEncode = myContract.methods.createNFT("0x635F555F77D0491842590d9e64C2450a31780E5E", 4673647336465, 1, "http://my.test.io2", "0x675f").encodeABI()
        web3.eth.sendTransaction({
            from: "0x635F555F77D0491842590d9e64C2450a31780E5E",
            data: funcEncode,
        })
        // 签名
        var sign = web3.eth.accounts.signTransaction({
            gas: 3000000,
            to: contractAddress,
            data: funcEncode,
        }, privateKEY)
        // 交易发送
        let result = await web3.eth.sendSignedTransaction((await sign).rawTransaction)
        console.log(result.transactionHash)

    }).timeout(30000)
    it("setApprove", async () => {
        web3.eth.defaultAccount = '0x635F555F77D0491842590d9e64C2450a31780E5E';
        // try {
        //     let from = await web3.eth.accounts[0]
        //     console.log(from)
        // } catch (e) {
        //     console.log(e)
        // }
        // TODO 填你的私钥
        let privateKEY = "e8a429fbde5db05ec659edd9afcb1b7741cb784ea8aca3eb436768cd901a4f15"
        let contractAddress = "0x1217cf38b0d2d1508F13149C252E665233c686Bb"
        let myContract = new web3.eth.Contract([
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "tokenURIPrefix",
                        "type": "string"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_operator",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "_approved",
                        "type": "bool"
                    }
                ],
                "name": "ApprovalForAll",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "previousOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_operator",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256[]",
                        "name": "_ids",
                        "type": "uint256[]"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256[]",
                        "name": "_amounts",
                        "type": "uint256[]"
                    }
                ],
                "name": "TransferBatch",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_operator",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "_id",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                    }
                ],
                "name": "TransferSingle",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_id",
                        "type": "uint256"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address[]",
                        "name": "_owners",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "_ids",
                        "type": "uint256[]"
                    }
                ],
                "name": "balanceOfBatch",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "",
                        "type": "uint256[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "burn",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "ids",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "values",
                        "type": "uint256[]"
                    }
                ],
                "name": "burnBatch",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "ids",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "amounts",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "string[]",
                        "name": "prefixs",
                        "type": "string[]"
                    },
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "name": "createBatch",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "prefix",
                        "type": "string"
                    },
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "name": "createNFT",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    }
                ],
                "name": "exists",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_operator",
                        "type": "address"
                    }
                ],
                "name": "isApprovedForAll",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "_ids",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "_amounts",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bytes",
                        "name": "_data",
                        "type": "bytes"
                    }
                ],
                "name": "safeBatchTransferFrom",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "_data",
                        "type": "bytes"
                    }
                ],
                "name": "safeTransferFrom",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_operator",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "_approved",
                        "type": "bool"
                    }
                ],
                "name": "setApprovalForAll",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes4",
                        "name": "_interfaceID",
                        "type": "bytes4"
                    }
                ],
                "name": "supportsInterface",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "pure",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "tokenURIPrefix",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    }
                ],
                "name": "totalSupply",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "uri",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ], contractAddress);
        let funcEncode = myContract.methods.setApprovalForAll("0xaf052407a534Fc438734d1E804F3f110129aEDF3", true).encodeABI()
        var sign = web3.eth.accounts.signTransaction({
            gas: 3000000,
            to: contractAddress,
            data: funcEncode,
        }, privateKEY)
        // 交易发送
        let result = await web3.eth.sendSignedTransaction((await sign).rawTransaction)
        console.log(result.transactionHash)

    }).timeout(30000)

    it("isApprove", async () => {
        web3.eth.defaultAccount = '0x635F555F77D0491842590d9e64C2450a31780E5E';
        // try {
        //     let from = await web3.eth.accounts[0]
        //     console.log(from)
        // } catch (e) {
        //     console.log(e)
        // }
        // TODO 填你的私钥
        let privateKEY = "e8a429fbde5db05ec659edd9afcb1b7741cb784ea8aca3eb436768cd901a4f15"
        let contractAddress = "0x1217cf38b0d2d1508F13149C252E665233c686Bb"
        let myContract = new web3.eth.Contract([
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "tokenURIPrefix",
                        "type": "string"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_operator",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "_approved",
                        "type": "bool"
                    }
                ],
                "name": "ApprovalForAll",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "previousOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_operator",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256[]",
                        "name": "_ids",
                        "type": "uint256[]"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256[]",
                        "name": "_amounts",
                        "type": "uint256[]"
                    }
                ],
                "name": "TransferBatch",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_operator",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "_id",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                    }
                ],
                "name": "TransferSingle",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_id",
                        "type": "uint256"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address[]",
                        "name": "_owners",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "_ids",
                        "type": "uint256[]"
                    }
                ],
                "name": "balanceOfBatch",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "",
                        "type": "uint256[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "burn",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "ids",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "values",
                        "type": "uint256[]"
                    }
                ],
                "name": "burnBatch",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "ids",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "amounts",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "string[]",
                        "name": "prefixs",
                        "type": "string[]"
                    },
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "name": "createBatch",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "prefix",
                        "type": "string"
                    },
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "name": "createNFT",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    }
                ],
                "name": "exists",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_operator",
                        "type": "address"
                    }
                ],
                "name": "isApprovedForAll",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "_ids",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "_amounts",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bytes",
                        "name": "_data",
                        "type": "bytes"
                    }
                ],
                "name": "safeBatchTransferFrom",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "_data",
                        "type": "bytes"
                    }
                ],
                "name": "safeTransferFrom",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_operator",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "_approved",
                        "type": "bool"
                    }
                ],
                "name": "setApprovalForAll",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes4",
                        "name": "_interfaceID",
                        "type": "bytes4"
                    }
                ],
                "name": "supportsInterface",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "pure",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "tokenURIPrefix",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    }
                ],
                "name": "totalSupply",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "uri",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ], contractAddress);
        let x = await myContract.methods.isApprovedForAll("0x635F555F77D0491842590d9e64C2450a31780E5E", '0xaf052407a534Fc438734d1E804F3f110129aEDF3').call({
            from: '0x635F555F77D0491842590d9e64C2450a31780E5E',
            gas: 30000,
        }).then(console.log)
    }).timeout(30000)

    it("setRate", async () => {
        web3.eth.defaultAccount = '0x861456bA02dF1EaFB4f0AFeDBBe0F8e4043ee2e3';
        // try {
        //     let from = await web3.eth.accounts[0]
        //     console.log(from)
        // } catch (e) {
        //     console.log(e)
        // }
        // TODO 填你的私钥
        let privateKEY = "32ef27941103f14a1377dadfe2f8b967bdbd3f0f3b087ca742bd264a39f66e9b"
        let contractAddress = "0xa11A71B0742824AaBEE1CC51ac94fd639AbAC1E7"
        let myContract = new web3.eth.Contract([
            {
                "inputs": [
                    {
                        "internalType": "contract TransferProxy",
                        "name": "_proxy",
                        "type": "address"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "previousOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "signer",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "salt",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "token",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "internalType": "enum ExchangeDomain.AssertType",
                                "name": "tokenType",
                                "type": "uint8"
                            }
                        ],
                        "internalType": "struct ExchangeDomain.Order",
                        "name": "order",
                        "type": "tuple"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint8",
                                "name": "v",
                                "type": "uint8"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "r",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "s",
                                "type": "bytes32"
                            }
                        ],
                        "internalType": "struct ExchangeDomain.Sig",
                        "name": "sig",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fee",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "buyer",
                        "type": "address"
                    }
                ],
                "name": "buyNFT",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "signer",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "salt",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "token",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "internalType": "enum ExchangeDomain.AssertType",
                                "name": "tokenType",
                                "type": "uint8"
                            }
                        ],
                        "internalType": "struct ExchangeDomain.Order",
                        "name": "order",
                        "type": "tuple"
                    }
                ],
                "name": "prepareMessage",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "pure",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "proxy",
                "outputs": [
                    {
                        "internalType": "contract TransferProxy",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address payable",
                        "name": "newServerAccount",
                        "type": "address"
                    }
                ],
                "name": "setServerAccount",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "rate",
                        "type": "uint256"
                    }
                ],
                "name": "setServerRate",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ], contractAddress);
        // 编码abi
        let funcEncode = myContract.methods.setServerRate(1000).encodeABI()
        // 签名
        var sign = web3.eth.accounts.signTransaction({
            gas: 3000000,
            to: contractAddress,
            data: funcEncode,
        }, privateKEY)
        // 交易发送
        let result = await web3.eth.sendSignedTransaction((await sign).rawTransaction)
        console.log(result.transactionHash)
    }).timeout(30000)

    it("setServerAccount", async () => {
        web3.eth.defaultAccount = '0x861456bA02dF1EaFB4f0AFeDBBe0F8e4043ee2e3';
        // TODO 填你的私钥
        let privateKEY = "32ef27941103f14a1377dadfe2f8b967bdbd3f0f3b087ca742bd264a39f66e9b"
        let contractAddress = "0xa11A71B0742824AaBEE1CC51ac94fd639AbAC1E7"
        let myContract = new web3.eth.Contract([
            {
                "inputs": [
                    {
                        "internalType": "contract TransferProxy",
                        "name": "_proxy",
                        "type": "address"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "previousOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "signer",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "salt",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "token",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "internalType": "enum ExchangeDomain.AssertType",
                                "name": "tokenType",
                                "type": "uint8"
                            }
                        ],
                        "internalType": "struct ExchangeDomain.Order",
                        "name": "order",
                        "type": "tuple"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint8",
                                "name": "v",
                                "type": "uint8"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "r",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "s",
                                "type": "bytes32"
                            }
                        ],
                        "internalType": "struct ExchangeDomain.Sig",
                        "name": "sig",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fee",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "buyer",
                        "type": "address"
                    }
                ],
                "name": "buyNFT",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "signer",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "salt",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "token",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "internalType": "enum ExchangeDomain.AssertType",
                                "name": "tokenType",
                                "type": "uint8"
                            }
                        ],
                        "internalType": "struct ExchangeDomain.Order",
                        "name": "order",
                        "type": "tuple"
                    }
                ],
                "name": "prepareMessage",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "pure",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "proxy",
                "outputs": [
                    {
                        "internalType": "contract TransferProxy",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address payable",
                        "name": "newServerAccount",
                        "type": "address"
                    }
                ],
                "name": "setServerAccount",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "rate",
                        "type": "uint256"
                    }
                ],
                "name": "setServerRate",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ], contractAddress);
        // 编码abi
        let funcEncode = myContract.methods.setServerAccount("0x861456bA02dF1EaFB4f0AFeDBBe0F8e4043ee2e3").encodeABI()
        // 签名
        var sign = web3.eth.accounts.signTransaction({
            gas: 3000000,
            to: contractAddress,
            data: funcEncode,
        }, privateKEY)
        // 交易发送
        let result = await web3.eth.sendSignedTransaction((await sign).rawTransaction)
        console.log(result.transactionHash)
    }).timeout(30000)

    it("transferOwnership", async () => {
        web3.eth.defaultAccount = '0x861456bA02dF1EaFB4f0AFeDBBe0F8e4043ee2e3';
        // TODO 填你的私钥
        let privateKEY = "32ef27941103f14a1377dadfe2f8b967bdbd3f0f3b087ca742bd264a39f66e9b"
        let contractAddress = "0xaf052407a534Fc438734d1E804F3f110129aEDF3"





        let myContract = new web3.eth.Contract([
            {
                "inputs": [
                    {
                        "internalType": "contract TransferProxy",
                        "name": "_proxy",
                        "type": "address"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "previousOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "signer",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "salt",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "token",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "internalType": "enum ExchangeDomain.AssertType",
                                "name": "tokenType",
                                "type": "uint8"
                            }
                        ],
                        "internalType": "struct ExchangeDomain.Order",
                        "name": "order",
                        "type": "tuple"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint8",
                                "name": "v",
                                "type": "uint8"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "r",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "s",
                                "type": "bytes32"
                            }
                        ],
                        "internalType": "struct ExchangeDomain.Sig",
                        "name": "sig",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fee",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "buyer",
                        "type": "address"
                    }
                ],
                "name": "buyNFT",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "signer",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "salt",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "token",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "internalType": "enum ExchangeDomain.AssertType",
                                "name": "tokenType",
                                "type": "uint8"
                            }
                        ],
                        "internalType": "struct ExchangeDomain.Order",
                        "name": "order",
                        "type": "tuple"
                    }
                ],
                "name": "prepareMessage",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "pure",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "proxy",
                "outputs": [
                    {
                        "internalType": "contract TransferProxy",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address payable",
                        "name": "newServerAccount",
                        "type": "address"
                    }
                ],
                "name": "setServerAccount",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "rate",
                        "type": "uint256"
                    }
                ],
                "name": "setServerRate",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ], contractAddress);
        // 编码abi
        let funcEncode = myContract.methods.transferOwnership("0xbF130FAD2B251293493BF72A81838bB2055DDb5c").encodeABI()
        // 签名
        var sign = web3.eth.accounts.signTransaction({
            gas: 3000000,
            to: contractAddress,
            data: funcEncode,
        }, privateKEY)
        // 交易发送
        let result = await web3.eth.sendSignedTransaction((await sign).rawTransaction)
        console.log(result.transactionHash)
    }).timeout(30000)

    it("owner", async () => {
        web3.eth.defaultAccount = '0x861456bA02dF1EaFB4f0AFeDBBe0F8e4043ee2e3';
        // TODO 填你的私钥
        let privateKEY = "32ef27941103f14a1377dadfe2f8b967bdbd3f0f3b087ca742bd264a39f66e9b"
        let contractAddress = "0xaf052407a534Fc438734d1E804F3f110129aEDF3"
        let myContract = new web3.eth.Contract([
            {
                "inputs": [
                    {
                        "internalType": "contract TransferProxy",
                        "name": "_proxy",
                        "type": "address"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "previousOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "signer",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "salt",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "token",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "internalType": "enum ExchangeDomain.AssertType",
                                "name": "tokenType",
                                "type": "uint8"
                            }
                        ],
                        "internalType": "struct ExchangeDomain.Order",
                        "name": "order",
                        "type": "tuple"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint8",
                                "name": "v",
                                "type": "uint8"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "r",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "s",
                                "type": "bytes32"
                            }
                        ],
                        "internalType": "struct ExchangeDomain.Sig",
                        "name": "sig",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fee",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "buyer",
                        "type": "address"
                    }
                ],
                "name": "buyNFT",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "signer",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "salt",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "token",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "internalType": "enum ExchangeDomain.AssertType",
                                "name": "tokenType",
                                "type": "uint8"
                            }
                        ],
                        "internalType": "struct ExchangeDomain.Order",
                        "name": "order",
                        "type": "tuple"
                    }
                ],
                "name": "prepareMessage",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "pure",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "proxy",
                "outputs": [
                    {
                        "internalType": "contract TransferProxy",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address payable",
                        "name": "newServerAccount",
                        "type": "address"
                    }
                ],
                "name": "setServerAccount",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "rate",
                        "type": "uint256"
                    }
                ],
                "name": "setServerRate",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ], contractAddress);
        // 编码abi
        let funcEncode = myContract.methods.owner().encodeABI()
        // 签名
        var sign = web3.eth.accounts.signTransaction({
            gas: 3000000,
            to: contractAddress,
            data: funcEncode,
        }, privateKEY)
        // 交易发送
        let result = await web3.eth.sendSignedTransaction((await sign).rawTransaction)
        console.log(result.transactionHash)
        console.log(result)
    }).timeout(30000)

    it("buyNFT", async () => {
        web3.eth.defaultAccount = '0x861456bA02dF1EaFB4f0AFeDBBe0F8e4043ee2e3';
        // TODO 填你的私钥
        let privateKEY = "32ef27941103f14a1377dadfe2f8b967bdbd3f0f3b087ca742bd264a39f66e9b"
        let contractAddress = "0x1217cf38b0d2d1508F13149C252E665233c686Bb"
        let myContract = new web3.eth.Contract([
            {
                "inputs": [
                    {
                        "internalType": "contract TransferProxy",
                        "name": "_proxy",
                        "type": "address"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "previousOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "signer",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "salt",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "token",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "internalType": "enum ExchangeDomain.AssertType",
                                "name": "tokenType",
                                "type": "uint8"
                            }
                        ],
                        "internalType": "struct ExchangeDomain.Order",
                        "name": "order",
                        "type": "tuple"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint8",
                                "name": "v",
                                "type": "uint8"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "r",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "s",
                                "type": "bytes32"
                            }
                        ],
                        "internalType": "struct ExchangeDomain.Sig",
                        "name": "sig",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fee",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "buyer",
                        "type": "address"
                    }
                ],
                "name": "buyNFT",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "signer",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "salt",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "token",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "internalType": "enum ExchangeDomain.AssertType",
                                "name": "tokenType",
                                "type": "uint8"
                            }
                        ],
                        "internalType": "struct ExchangeDomain.Order",
                        "name": "order",
                        "type": "tuple"
                    }
                ],
                "name": "prepareMessage",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "pure",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "proxy",
                "outputs": [
                    {
                        "internalType": "contract TransferProxy",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address payable",
                        "name": "newServerAccount",
                        "type": "address"
                    }
                ],
                "name": "setServerAccount",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "rate",
                        "type": "uint256"
                    }
                ],
                "name": "setServerRate",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ], "0xaf052407a534Fc438734d1E804F3f110129aEDF3");
        let order = {
            token: contractAddress,
            tokenId: "4673647336465",
            owner: "0x635F555F77D0491842590d9e64C2450a31780E5E",
            signer: "0x861456bA02dF1EaFB4f0AFeDBBe0F8e4043ee2e3",
            salt: 2345,
            tokenType: 0,
        };
        let orderString = JSON.stringify(order).toString()
        let x = web3.eth.accounts.sign(orderString, privateKEY)
        console.log(x)
        let sig = {
            v: x.v,
            r: x.r,
            s: x.s,
        }
        // 编码abi
        let funcEncode = myContract.methods.buyNFT(order, sig, 1000000, 1, "0x861456bA02dF1EaFB4f0AFeDBBe0F8e4043ee2e3").encodeABI()
        console.log("xxxxxxxx")

        // 签名
        var sign = web3.eth.accounts.signTransaction({
            gas: 3000000,
            to: contractAddress,
            data: funcEncode,
        }, privateKEY)
        // 交易发送
        let result = await web3.eth.sendSignedTransaction((await sign).rawTransaction)
        console.log(result.transactionHash)
        console.log(result)
    }).timeout(40000)

    it("decode", async () => {
        const decoder = new InputDataDecoder([
            {
                "inputs": [
                    {
                        "internalType": "contract TransferProxy",
                        "name": "_proxy",
                        "type": "address"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "previousOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "signer",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "salt",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "token",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "internalType": "enum ExchangeDomain.AssertType",
                                "name": "tokenType",
                                "type": "uint8"
                            }
                        ],
                        "internalType": "struct ExchangeDomain.Order",
                        "name": "order",
                        "type": "tuple"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint8",
                                "name": "v",
                                "type": "uint8"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "r",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "s",
                                "type": "bytes32"
                            }
                        ],
                        "internalType": "struct ExchangeDomain.Sig",
                        "name": "sig",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fee",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "buyer",
                        "type": "address"
                    }
                ],
                "name": "buyNFT",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "signer",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "salt",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "token",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "internalType": "enum ExchangeDomain.AssertType",
                                "name": "tokenType",
                                "type": "uint8"
                            }
                        ],
                        "internalType": "struct ExchangeDomain.Order",
                        "name": "order",
                        "type": "tuple"
                    }
                ],
                "name": "prepareMessage",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "pure",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "proxy",
                "outputs": [
                    {
                        "internalType": "contract TransferProxy",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address payable",
                        "name": "newServerAccount",
                        "type": "address"
                    }
                ],
                "name": "setServerAccount",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "rate",
                        "type": "uint256"
                    }
                ],
                "name": "setServerRate",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]);
        let testData = "0xe7f25deb0000000000000000000000008f65300c70c6fef9f790645499a6ed1b7fa9d7b800000000000000000000000000000000000000000000000000000000000009290000000000000000000000001217cf38b0d2d1508f13149c252e665233c686bb000000000000000000000000000000003791e97b022da0e9c281d901f7e11a4a0000000000000000000000008f65300c70c6fef9f790645499a6ed1b7fa9d7b80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001bec829ba9a536880cfd74801a2f4ec0a1fc74a652ecf7660771d22ee56a3e6fbd4284914142018075268fa7a9c5f197027b65391adfd95fe14dc2a5e1919ec57e000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000008f65300c70c6fef9f790645499a6ed1b7fa9d7b8"
        let x = decoder.decodeData(testData)
        console.log(x)
    })

})

