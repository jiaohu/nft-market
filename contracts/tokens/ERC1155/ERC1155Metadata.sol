// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4;
import "../../interfaces/IERC1155Metadata.sol";
import "../../utils/ERC165.sol";
import "../../utils/Strings.sol";


/**
 * @notice Contract that handles metadata related methods.
 * @dev Methods assume a deterministic generation of URI based on token IDs.
 *      Methods also assume that URI uses hex representation of token IDs.
 */
contract ERC1155Metadata is IERC1155Metadata, ERC165 {
  using Strings for uint256;
  // URI's default URI prefix
  string public baseURI;
  string public name;

  // set the initial name and base URI
  constructor(string memory _name, string memory _baseURI) {
    name = _name;
    baseURI = _baseURI;
  }

  /***********************************|
  |     Metadata Public Functions     |
  |__________________________________*/

  /**
   * @notice A distinct Uniform Resource Identifier (URI) for a given token.
   * @dev URIs are defined in RFC 3986.
   *      URIs are assumed to be deterministically generated based on token ID
   * @return URI string
   */
  function uri(uint256 _id) public override view returns (string memory) {
    return string(abi.encodePacked(baseURI, Strings.toString(_id), ".json"));
  }


  /***********************************|
  |    Metadata Internal Functions    |
  |__________________________________*/

  /**
   * @notice Will emit default URI log event for corresponding token _id
   * @param _tokenIDs Array of IDs of tokens to log default URI
   */
  function _logURIs(uint256[] memory _tokenIDs) internal {
    string memory baseURL = baseURI;
    string memory tokenURI;

    for (uint256 i = 0; i < _tokenIDs.length; i++) {
      tokenURI = string(abi.encodePacked(baseURL, Strings.toString(_tokenIDs[i]), ".json"));
      emit URI(tokenURI, _tokenIDs[i]);
    }
  }

  /**
   * @notice Will update the base URL of token's URI
   * @param _newBaseMetadataURI New base URL of token's URI
   */
  function _setBaseMetadataURI(string memory _newBaseMetadataURI) internal {
    baseURI = _newBaseMetadataURI;
  }

  /**
   * @notice Will update the name of the contract
   * @param _newName New contract name
   */
  function _setContractName(string memory _newName) internal {
    name = _newName;
  }

  /**
   * @notice Query if a contract implements an interface
   * @param _interfaceID  The interface identifier, as specified in ERC-165
   * @return `true` if the contract implements `_interfaceID` and
   */
  function supportsInterface(bytes4 _interfaceID) public override virtual pure returns (bool) {
    if (_interfaceID == type(IERC1155Metadata).interfaceId) {
      return true;
    }
    return super.supportsInterface(_interfaceID);
  }
}
