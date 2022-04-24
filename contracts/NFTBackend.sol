// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "./utils/Ownable.sol";
import "./interfaces/IERC1155.sol";
import "./utils/SafeMath.sol";
import "./exchange/ExchangeDomain.sol";
import "./utils/StringLibrary.sol";
import "./utils/BytesLibrary.sol";
import "./interfaces/IERC721.sol";
import "hardhat/console.sol";

contract NFTBackend is Ownable, ExchangeDomain {
    using SafeMath for uint256;
    using UintLibrary for uint;
    using StringLibrary for string;
    using BytesLibrary for bytes32;

    constructor() {
    }

    address payable public serverAccount; // 平台抽成账户

    uint256 public serverRate; // 抽成比例*10000

    function setServerAccount(address payable newServerAccount) external onlyOwner {
        serverAccount = newServerAccount;
    }

    function setServerRate(uint rate) external onlyOwner {
        serverRate = rate;
    }

    // fee 是售价
    // amount 是数量
    function buyNFT(Order calldata order, Sig calldata sig, uint256 fee, uint256 amount, address buyer) payable external {
        validateOrderSig(order, sig);
        // 总费用
        uint paying = fee * amount;
        validateEthTransfer(paying);
        console.log("paying %d", paying);

        // 如果传进来的buyer是空，那么由合约调用者来购买
        if (buyer == address(0x0)) {
            buyer = msg.sender;
        }

        console.log("hello transfer");
        // 抽成转给平台, 剩下的转给用户
        uint resultValue = transferFeeToBeneficiary(paying , serverRate);
        console.log("resultValue", resultValue);
        // 费用转给持有者
        transferFeeToOwner(order.owner, resultValue);
        // NFT 转
        transferNFT(order.token, order.tokenType, amount, order.tokenId, order.owner, buyer);
    }

    function transferFeeToOwner(address to, uint value) internal {
        console.log("transferFeeToOwner");
        console.log("to %s %d", to, value);
        console.log(address(this).balance);
        if (value > 0) {
            address payable toPay = payable(to);
            toPay.transfer(value);
            console.log("hello", value);
        }
    }

    function transferNFT(address token, AssertType tokenType, uint value, uint256 id, address from, address to) internal {
        // 转NFT给购买者
        console.log("transfer");
        if (tokenType == AssertType.ERC1155) {
            console.log("ERC1155");
            console.log("token %s", token);
            IERC1155(token).safeTransferFrom(from, to, id, value, "");
        } else if (tokenType == AssertType.ERC721) {
            IERC721(token).safeTransferFrom(from, to, id);
        }
    }

    function validateOrderSig(Order memory order, Sig memory sig) internal view {
        console.log("validateOrderSig %s", order.token);
        console.log(order.salt);
        console.log(sig.v);
        console.logBytes32(sig.r);
        console.logBytes32(sig.s);
        console.log("validateOrderSig", prepareMessage(order).recover(sig.v, sig.r, sig.s));
        console.log("signer", order.signer);
        require(prepareMessage(order).recover(sig.v, sig.r, sig.s) == order.signer, "incorrect signature");
    }

    function prepareMessage(Order memory order) public pure returns (string memory) {
        return keccak256(abi.encode(order)).toString();
    }

    function transferFeeToBeneficiary(uint total, uint buyerFee) internal returns (uint) {
        console.log("total", total);
        (uint restValue, uint buyerFeeValue) = subFeeInBp(total, total, buyerFee);
        console.log("buyerFeeValue", buyerFeeValue);
        console.log("restValue", restValue);
        uint beneficiaryFee = buyerFeeValue.add(buyerFeeValue);
        if (buyerFeeValue > 0) {
            serverAccount.transfer(beneficiaryFee);
        }
        return restValue;
    }

    function subFeeInBp(uint value, uint total, uint feeInBp) internal pure returns (uint newValue, uint realFee) {
        return subFee(value, total.bp(feeInBp));
    }

    function validateEthTransfer(uint value) internal view {
        uint256 buyerFeeValue = value.bp(serverRate);
        console.log(msg.value);
        console.log(value);
        require(msg.value == value + buyerFeeValue, "msg.value is incorrect");
    }

    function subFee(uint value, uint fee) internal pure returns (uint newValue, uint realFee) {
        if (value > fee) {
            newValue = value - fee;
            realFee = fee;
        } else {
            newValue = 0;
            realFee = value;
        }
    }

    fallback() external payable {}

    receive() external payable {}
}
