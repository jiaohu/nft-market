// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4;

import "../../utils/SafeMath.sol";
import "../../interfaces/IERC1155TokenReceiver.sol";
import "../../interfaces/IERC1155.sol";
import "../../utils/Address.sol";
import "../../utils/ERC165.sol";
import "./extensions/IERC1155MetadataURI.sol";
import "hardhat/console.sol";
import "../../exchange/HasTokenURI.sol";


/**
 * @dev Implementation of Multi-Token Standard contract
 */
contract ERC1155 is IERC1155, ERC165, IERC1155MetadataURI, HasTokenURI {
    using SafeMath for uint256;
    using Address for address;

    /***********************************|
    |        Variables and Events       |
    |__________________________________*/

    // onReceive function signatures
    bytes4 constant internal ERC1155_RECEIVED_VALUE = 0xf23a6e61;
    bytes4 constant internal ERC1155_BATCH_RECEIVED_VALUE = 0xbc197c81;


    // Mapping from token ID to account balances
    mapping(uint256 => mapping(address => uint256)) private _balances;

    // Mapping from account to operator approvals
    mapping(address => mapping(address => bool)) internal _operatorApprovals;

    // Mapping from token Id to royalty information 版税？？



    constructor(string memory _tokenURIPrefix) HasTokenURI(_tokenURIPrefix){
    }


    /***********************************|
    |     Public Transfer Functions     |
    |__________________________________*/


    /**
   * @dev See {IERC1155MetadataURI-uri}.
   *
   * This implementation returns the same URI for *all* token types. It relies
   * on the token type ID substitution mechanism
   * https://eips.ethereum.org/EIPS/eip-1155#metadata[defined in the EIP].
   *
   * Clients calling this function must replace the `\{id\}` substring with the
   * actual token type ID.
   */
    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        return _tokenURI(tokenId);
    }

    /**
     * @notice Transfers amount amount of an _id from the _from address to the _to address specified
     * @param _from    Source address
     * @param _to      Target address
     * @param _id      ID of the token type
     * @param _amount  Transfered amount
     * @param _data    Additional data with no specified format, sent in call to `_to`
     */
    function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _amount, bytes memory _data) public virtual override {
        console.log("safeTransferFrom", _from, _to, _id);
        console.log(msg.sender);
        console.log(_from);
        require((msg.sender == _from) || isApprovedForAll(_from, msg.sender), "ERC1155#safeTransferFrom: INVALID_OPERATOR, caller is not owner nor approved");

        _safeTransferFrom(_from, _to, _id, _amount, _data);
    }

    /**
     * @notice Send multiple types of Tokens from the _from address to the _to address (with safety call)
     * @param _from     Source addresses
     * @param _to       Target addresses
     * @param _ids      IDs of each token type
     * @param _amounts  Transfer amounts per token type
     * @param _data     Additional data with no specified format, sent in call to `_to`
     */
    function safeBatchTransferFrom(address _from, address _to, uint256[] memory _ids, uint256[] memory _amounts, bytes memory _data) public virtual override {
        // Requirements
        require((msg.sender == _from) || isApprovedForAll(_from, msg.sender), "ERC1155#safeBatchTransferFrom: INVALID_OPERATOR");

        _safeBatchTransferFrom(_from, _to, _ids, _amounts, _data);
    }


    /***********************************|
    |    Internal Transfer Functions    |
    |__________________________________*/

    /**
     * @notice Transfers amount amount of an _id from the _from address to the _to address specified
     * @param _from    Source address
     * @param _to      Target address
     * @param _id      ID of the token type
     * @param _amount  Transfered amount
     */
    function _safeTransferFrom(address _from, address _to, uint256 _id, uint256 _amount, bytes memory _data) internal virtual {
        require(_to != address(0), "ERC1155#_safeTransferFrom: INVALID_RECIPIENT, transfer to the zero address");

        address operator = msg.sender;

        _beforeTokenTransfer(operator, _from, _to, _asSingletonArray(_id), _asSingletonArray(_amount), _data);
        // Update balances
        require(_balances[_id][_from] >= _amount, "ERC1155#_safeTransferFrom, insufficient balance for transfer");
        // Subtract amount
        _balances[_id][_from] = _balances[_id][_from].sub(_amount);
        // Add amount
        _balances[_id][_to] = _balances[_id][_to].add(_amount);


        // Emit event
        emit TransferSingle(msg.sender, _from, _to, _id, _amount);

        _doSafeTransferAcceptanceCheck(operator, _from, _to, _id, _amount, _data);
    }

    /**
     * @notice Send multiple types of Tokens from the _from address to the _to address (with safety call)
     * @param _from     Source addresses
     * @param _to       Target addresses
     * @param _ids      IDs of each token type
     * @param _amounts  Transfer amounts per token type
     */
    function _safeBatchTransferFrom(address _from, address _to, uint256[] memory _ids, uint256[] memory _amounts, bytes memory _data) internal virtual {
        require(_ids.length == _amounts.length, "ERC1155#_safeBatchTransferFrom: INVALID_ARRAYS_LENGTH");
        require(_to != address(0), "ERC1155: transfer to the zero address");

        // Executing all transfers
        for (uint256 i = 0; i < _ids.length; i++) {
            // Update storage balance of previous bin
            require(_balances[_ids[i]][_from] >= _amounts[i], "ERC1155: insufficient balance for transfer");
            _balances[_ids[i]][_from] = _balances[_ids[i]][_from].sub(_amounts[i]);
            _balances[_ids[i]][_to] = _balances[_ids[i]][_to].add(_amounts[i]);
        }

        // Emit event
        emit TransferBatch(msg.sender, _from, _to, _ids, _amounts);

        _doSafeBatchTransferAcceptanceCheck(msg.sender, _from, _to, _ids, _amounts, _data);
    }


    /**
     * @dev Creates `amount` tokens of token type `id`, and assigns them to `to`.
     *
     * Emits a {TransferSingle} event.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
     * acceptance magic value.
     */
    function _mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) internal virtual {
        console.log("to", to);
        require(to != address(0), "ERC1155: mint to the zero address");

        address operator = msg.sender;

        _beforeTokenTransfer(operator, address(0), to, _asSingletonArray(id), _asSingletonArray(amount), data);

        _balances[id][to] += amount;
        console.log("_balance", _balances[id][to]);
        emit TransferSingle(operator, address(0), to, id, amount);

        _doSafeTransferAcceptanceCheck(operator, address(0), to, id, amount, data);
    }

    /**
     * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {_mint}.
     *
     * Requirements:
     *
     * - `ids` and `amounts` must have the same length.
     * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the
     * acceptance magic value.
     */
    function _mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual {
        require(to != address(0), "ERC1155: mint to the zero address");
        require(ids.length == amounts.length, "ERC1155: ids and amounts length mismatch");

        address operator = msg.sender;

        _beforeTokenTransfer(operator, address(0), to, ids, amounts, data);

        for (uint256 i = 0; i < ids.length; i++) {
            _balances[ids[i]][to] += amounts[i];
        }

        emit TransferBatch(operator, address(0), to, ids, amounts);

        _doSafeBatchTransferAcceptanceCheck(operator, address(0), to, ids, amounts, data);
    }


    /**
     * @dev Destroys `amount` tokens of token type `id` from `from`
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `from` must have at least `amount` tokens of token type `id`.
     */
    function _burn(
        address from,
        uint256 id,
        uint256 amount
    ) internal virtual {
        require(from != address(0), "ERC1155: burn from the zero address");

        address operator = msg.sender;

        _beforeTokenTransfer(operator, from, address(0), _asSingletonArray(id), _asSingletonArray(amount), "");

        uint256 fromBalance = _balances[id][from];
        require(fromBalance >= amount, "ERC1155: burn amount exceeds balance");
    unchecked {
        _balances[id][from] = fromBalance - amount;
    }

        emit TransferSingle(operator, from, address(0), id, amount);
    }

    /**
     * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {_burn}.
     *
     * Requirements:
     *
     * - `ids` and `amounts` must have the same length.
     */
    function _burnBatch(
        address from,
        uint256[] memory ids,
        uint256[] memory amounts
    ) internal virtual {
        require(from != address(0), "ERC1155: burn from the zero address");
        require(ids.length == amounts.length, "ERC1155: ids and amounts length mismatch");

        address operator = msg.sender;

        _beforeTokenTransfer(operator, from, address(0), ids, amounts, "");

        for (uint256 i = 0; i < ids.length; i++) {
            uint256 id = ids[i];
            uint256 amount = amounts[i];

            uint256 fromBalance = _balances[id][from];
            require(fromBalance >= amount, "ERC1155: burn amount exceeds balance");
        unchecked {
            _balances[id][from] = fromBalance - amount;
        }
        }

        emit TransferBatch(operator, from, address(0), ids, amounts);
    }

    /***********************************|
    |         Operator Functions        |
    |__________________________________*/

    /**
     * @notice Enable or disable approval for a third party ("operator") to manage all of caller's tokens
     * @param _operator  Address to add to the set of authorized operators
     * @param _approved  True if the operator is approved, false to revoke approval
     */
    function setApprovalForAll(address _operator, bool _approved) public virtual override {
        _setApprovalForAll(msg.sender, _operator, _approved);
    }

    /**
       * @dev Approve `operator` to operate on all of `owner` tokens
       *
       * Emits a {ApprovalForAll} event.
       */
    function _setApprovalForAll(
        address owner,
        address operator,
        bool approved
    ) internal virtual {
        require(owner != operator, "ERC1155#_setApprovalForAll: setting approval status for self");
        _operatorApprovals[owner][operator] = approved;
        emit ApprovalForAll(owner, operator, approved);
    }

    /**
     * @notice Queries the approval status of an operator for a given owner
     * @param _owner     The owner of the Tokens
     * @param _operator  Address of authorized operator
     * @return isOperator True if the operator is approved, false if not
     */
    function isApprovedForAll(address _owner, address _operator) public view virtual override returns (bool){
        console.log("isApprovedForAll");
        return _operatorApprovals[_owner][_operator];
    }


    /***********************************|
    |         Balance Functions         |
    |__________________________________*/

    /**
    * Requirements:
       *
       * - `account` cannot be the zero address.
     * @notice Get the balance of an account's Tokens
     * @param _owner  The address of the token holder
     * @param _id     ID of the Token
     * @return The _owner's balance of the Token type requested
     */
    function balanceOf(address _owner, uint256 _id) public view virtual override returns (uint256){
        require(_owner != address(0), "ERC1155#balanceOf: balance query for the zero address");
        return _balances[_id][_owner];
    }

    /**
     * @notice Get the balance of multiple account/token pairs
     * @param _owners The addresses of the token holders
     * @param _ids    ID of the Tokens
     * @return        The _owner's balance of the Token types requested (i.e. balance for each (owner, id) pair)
     */
    function balanceOfBatch(address[] memory _owners, uint256[] memory _ids)
    public view virtual override returns (uint256[] memory)
    {
        require(_owners.length == _ids.length, "ERC1155#balanceOfBatch: accounts and ids length mismatch");

        // Variables
        uint256[] memory batchBalances = new uint256[](_owners.length);

        // Iterate over each owner and token ID
        for (uint256 i = 0; i < _owners.length; i++) {
            batchBalances[i] = balanceOf(_owners[i], _ids[i]);
        }

        return batchBalances;
    }


    /***********************************|
    |          ERC165 Functions         |
    |__________________________________*/

    /**
     * @notice Query if a contract implements an interface
     * @param _interfaceID  The interface identifier, as specified in ERC-165
     * @return `true` if the contract implements `_interfaceID` and
     */
    function supportsInterface(bytes4 _interfaceID) public override(ERC165, IERC165) virtual pure returns (bool) {
        if (_interfaceID == type(IERC1155).interfaceId) {
            return true;
        }
        return super.supportsInterface(_interfaceID);
    }

    /**
      * @dev Hook that is called before any token transfer. This includes minting
      * and burning, as well as batched variants.
      *
      * The same hook is called on both single and batched variants. For single
      * transfers, the length of the `id` and `amount` arrays will be 1.
      *
      * Calling conditions (for each `id` and `amount` pair):
      *
      * - When `from` and `to` are both non-zero, `amount` of ``from``'s tokens
      * of token type `id` will be  transferred to `to`.
      * - When `from` is zero, `amount` tokens of token type `id` will be minted
      * for `to`.
      * - when `to` is zero, `amount` of ``from``'s tokens of token type `id`
      * will be burned.
      * - `from` and `to` are never both zero.
      * - `ids` and `amounts` have the same, non-zero length.
      *
      * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
      */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual {}

    function _doSafeTransferAcceptanceCheck(
        address operator,
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) internal {
        if (to.isContract()) {
            try IERC1155TokenReceiver(to).onERC1155Received(operator, from, id, amount, data) returns (bytes4 response) {
                if (response != IERC1155TokenReceiver.onERC1155Received.selector) {
                    revert("ERC1155: ERC1155Receiver rejected tokens");
                }
            } catch Error(string memory reason) {
                revert(reason);
            } catch {
                revert("ERC1155: transfer to non ERC1155Receiver implementer");
            }
        }
    }

    function _doSafeBatchTransferAcceptanceCheck(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal {
        if (to.isContract()) {
            try IERC1155TokenReceiver(to).onERC1155BatchReceived(operator, from, ids, amounts, data) returns (
                bytes4 response
            ) {
                if (response != IERC1155TokenReceiver.onERC1155BatchReceived.selector) {
                    revert("ERC1155: ERC1155Receiver rejected tokens");
                }
            } catch Error(string memory reason) {
                revert(reason);
            } catch {
                revert("ERC1155: transfer to non ERC1155Receiver implementer");
            }
        }
    }

    function _asSingletonArray(uint256 element) private pure returns (uint256[] memory) {
        uint256[] memory array = new uint256[](1);
        array[0] = element;

        return array;
    }
}
