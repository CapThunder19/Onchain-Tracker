// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Supplychain is ERC721URIStorage, AccessControl{
    bytes32 public constant Manufactor_role = keccak256("Manufactor");
    bytes32 public constant Retailer_role = keccak256("Retailer");
    bytes32 public constant Transporter_role = keccak256("Transporter");
    bytes32 public constant Warehouse_role = keccak256("Warehouse");
    bytes32 public constant Consumer_role = keccak256("Consumer");

    struct location{
        uint256 latitude;
        uint256 longitude;
        uint256 timestamp;
        address updatedBy;
    }

    struct product{
        uint256 id;
        string metadata;
        string qrCode;
        address currentOwner;
        uint256 trustscore;
        bool exists;
        bool verified;
    }

    mapping(uint256 => product) public products;
    mapping(uint256 => location[]) public productLocations;
    uint256 public nextProductId;

    event ProductCreated(uint256 indexed productId, string metadata, string qrCode, address indexed owner);
    event trustScoreUpdated(uint256 indexed productId, uint256 newTrustScore);
    event ProductVerified(uint256 indexed productId, address indexed verifier);
    event ProductTransferred(uint256 indexed productId, address indexed from, address indexed to);
    event locationUpdated(uint256 indexed productId, uint256 latitude, uint256 longitude, address indexed updatedBy);

    constructor() ERC721("Supplychain", "SUP") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }


    function createproduct(string memory metadata, string memory tokenURI, string memory qrCode) public onlyRole(Manufactor_role) returns (uint256) {
        uint256 productid = nextProductId++;
        products[productid] = product({
            id: productid,
            metadata: metadata,
            qrCode: qrCode,
            currentOwner: msg.sender,
            trustscore: 0,
            exists: true,
            verified: false
        });

        _safeMint(msg.sender, productid);
        _setTokenURI(productid, tokenURI);
        emit ProductCreated(productid, metadata, qrCode, msg.sender);
        return productid;
    }

    function updateloction(uint256 productId, uint256 latitude, uint256 longitude) public {
        require(products[productId].exists, "Product does not exist");
        require(hasRole(Transporter_role, msg.sender) || hasRole(Warehouse_role,msg.sender) || hasRole(Manufactor_role,msg.sender) || hasRole(Retailer_role,msg.sender), "Unauthorized");
        productLocations[productId].push(location({
            latitude: latitude,
            longitude: longitude,
            timestamp: block.timestamp,
            updatedBy: msg.sender
        }));
        products[productId].trustscore += 1;
        emit locationUpdated(productId, latitude, longitude, msg.sender);
        emit trustScoreUpdated(productId, products[productId].trustscore);
    }

    function transferownership(uint256 productId, address newOwner) public {
        require(products[productId].exists, "Product does not exist");
        require(msg.sender == products[productId].currentOwner, "Only current owner can transfer ownership");
        require(newOwner != address(0), "New owner cannot be zero address");

        _transfer(msg.sender, newOwner, productId);
        products[productId].currentOwner = newOwner;
        emit ProductTransferred(productId, msg.sender, newOwner);
    }

    function getProductLocationHistory(uint256 productId) public view returns (location[] memory) {
        require(products[productId].exists, "Product does not exist");
        return productLocations[productId];
    }

    function verifyproduct(uint256 productId) public onlyRole(Consumer_role) {
        require(products[productId].exists, "Product does not exist");
        products[productId].verified = true;
        emit ProductVerified(productId, msg.sender);
    }



    function getproductdetails(uint256 productId) public view returns (product memory) {
        require(products[productId].exists, "Product does not exist");
        return products[productId];
    }

    function grantManufactorRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(Manufactor_role, account);
    }
    function grantTransporterRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(Transporter_role, account);
    }
    function grantRetailerRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(Retailer_role, account);
    }
    function grantConsumerRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(Consumer_role, account);
    }
    function grantWarehouseRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(Warehouse_role, account);
    }

    function existsProduct(uint256 productId) public view returns (bool) {
        return products[productId].exists;
    }
}