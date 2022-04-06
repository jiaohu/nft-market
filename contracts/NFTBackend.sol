// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "./utils/Ownable.sol";
import "./exchange/TransferProxy.sol";
import "./utils/SafeMath.sol";
import "./exchange/ExchangeDomain.sol";
import "./exchange/ExchangeOrdersHolder.sol";
import "./utils/StringLibrary.sol";
import "./utils/BytesLibrary.sol";

contract NFTBackend is Ownable, ExchangeDomain {
    using SafeMath for uint256;
    using UintLibrary for uint;
    using StringLibrary for string;
    using BytesLibrary for bytes32;
    TransferProxy public proxy;
    ExchangeOrdersHolder public ordersHolder;

    constructor(TransferProxy _proxy, ExchangeOrdersHolder _ordersHolder) {
        proxy = _proxy;
        ordersHolder = _ordersHolder;
    }

    address payable private serverAccount; // 平台抽成账户

    uint256 private serverRate; // 抽成比例*1000

    function setServerAccount(address payable newServerAccount) external onlyOwner {
        serverAccount = newServerAccount;
    }

    function setServerRate(uint rate) external onlyOwner {
        serverRate = rate;
    }

    function buyNFT(Order calldata order, Sig calldata sig, uint256 fee, uint256 amount, address buyer) payable external {
        validateOrderSig(order, sig);
        // 总费用
        uint paying = fee * amount;

        // 不支持ETH的购买
        require(order.key.sellAsset.assetType != AssetType.ETH, "ETH is not supported on sell side");
        // 如果传进来的buyer是空，那么合约调用者来购买
        if (buyer == address(0x0)) {
            buyer = msg.sender;
        }


        // 抽成转给平台, 剩下的转给用户
        uint resultValue = transferFeeToBeneficiary(paying, serverRate);
        // 费用转给owner设置的第二收款账户以及账户本身
        transferFeeToOwner(order.key.owner, resultValue);
        // NFT 转
        transfer(order.key.sellAsset, amount, order.key.owner, buyer);
    }

    function transferFeeToOwner(address to, uint value) internal {
        if (value > 0) {
            address payable toPay = payable(to);
            toPay.transfer(value);
        }
    }

    function transfer(Asset memory asset, uint value, address from, address to) internal {
        // 转NFT给购买者
        proxy.erc1155safeTransferFrom(IERC1155(asset.token), from, to, asset.tokenId, value, "");
    }

    function validateOrderSig(
        Order memory order,
        Sig memory sig
    ) internal view {
        if (sig.v == 0 && sig.r == bytes32(0x0) && sig.s == bytes32(0x0)) {
            require(ordersHolder.exists(order), "incorrect signature");
        } else {
            require(prepareMessage(order).recover(sig.v, sig.r, sig.s) == order.key.owner, "incorrect signature");
        }
    }

    function prepareMessage(Order memory order) public pure returns (string memory) {
        return keccak256(abi.encode(order)).toString();
    }

    function transferFeeToBeneficiary(uint total, uint buyerFee) internal returns (uint) {
        (uint restValue, uint buyerFeeValue) = subFeeInBp(total, total, buyerFee);
        if (buyerFeeValue > 0) {
            serverAccount.transfer(buyerFeeValue);
        }
        return restValue;
    }

    function subFeeInBp(uint value, uint total, uint feeInBp) internal pure returns (uint newValue, uint realFee) {
        return subFee(value, total.bp(feeInBp));
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
}
