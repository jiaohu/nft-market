require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");

// test account
// ---------address-------------------------------| -----------------private -----------------
// 0. 0x065a23D86752477FF27aa4a0A551476C1cFe6fC8  |  bf2f0fb645d9addf158a17599674c40fd1e5562997c3a0b1134b1456dd6e1958
// 1. 0xb5D6146b0220A9DDd463503353951cf701D8e1F8  |  ae461a23ab134a673d10a62977d8a95f59bd02b79932a81304bd9dbd79e08ec6
// 2. 0xb51d0ECbE57cef4fB98A2bf758eC44A1FEdd2922  |  4f9d72a2a2b6d9589db575b9a64bde0a7dac1f8ff750412231bf6a68a68a212c
// 3. 0xC62E81Ac5F82748640aB48fBeB87E6018C2ac018  |  088caa6ce6fc13af1a273b9664ed83d3686826357bc06024830287ee1b5713b2





/**
 * @type import('hardhat/config').HardhatUserConfig
 *
 * */
module.exports = {
  networks: {
    localhost: {
      url: `http://localhost:7545`,
      accounts: [`bf2f0fb645d9addf158a17599674c40fd1e5562997c3a0b1134b1456dd6e1958`],
    }
    // gw_devnet_v1: {
    //   url: `http://127.0.0.1:8024`,
    //   accounts: [`0xdd50cac37ec6dd12539a968c1a2cbedda75bd8724f7bcad486548eaabb87fc8b`, `0x6cd5e7be2f6504aa5ae7c0c04178d8f47b7cfc63b71d95d9e6282f5b090431bf`],
    // },
    // gw_testnet_v1: {
    //   url: `https://godwoken-testnet-web3-v1-rpc.ckbapp.dev`,
    //   accounts: [`0x${PRIVATE_KEY}`, `0x${PRIVATE_KEY2}`],
    // },
    // gw_testnet_v0:{
    //   url :`https://godwoken-testnet-web3-rpc.ckbapp.dev`,
    //   chainId:71393,
    //   accounts:[`0x${PRIVATE_KEY}`, `0x${PRIVATE_KEY2}`],
    // },
    // rinkeby: {
    //   url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
    //   accounts: [`0x${PRIVATE_KEY}`],
    //   // gas: 1_000_000_000_000_001, // Infura seems to cap it at 19981536.
    //   // gasPrice: 1
    // },
    // mainnet: {
    //   url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    //   accounts: [`0x${PRIVATE_KEY}`]
    // },
    // kovan: {
    //   url: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
    //   accounts: [`0x${PRIVATE_KEY}`]
    // },
    // // hardhat: {
    // //   gas: 1000000000000, // Infura seems to cap it at 19981536.
    // //   gasPrice: 1
    // // }
  },
  solidity: {
    compilers: [
      { // for polyjuice contracts
        version: "0.6.6",
        settings: {}
      },
      { version: "0.6.12" },
      { version: "0.7.5" },
      { version: "0.8.4" },
      { version: "0.8.6" }

    ], overrides: {}
  },
  // mocha:{
  //   /** Reporter name or constructor. */
  //   reporter: "json",
  //
  //   /** Reporter settings object. */
  //   reporterOptions: {
  //     output:"test-results.json"
  //   },
  //
  // }
};
