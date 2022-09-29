pragma solidity ^0.5.16;

contract Marketplace {
    string public name;
    mapping(uint => Product) public products;
    uint public productCount = 0;

    constructor() public {
        name = 'Web3 Marketplace';
    }

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    function createProduct(string memory _name, uint _price) public {
        //validate the product
        require(bytes(_name).length > 0); //validate name
        require(_price > 0); //validate price
        //increment the product counter
        productCount++;
        //create product
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
        //trigger an event to inform the blockchain
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable{
        //fetch product
        Product memory _product = products[_id];
        //address owner
        address payable _seller = _product.owner;
        //product valid
        require(_product.id > 0 && _product.id <= productCount);
        require(msg.value >= _product.price);
        require(!_product.purchased);
        require(_seller != msg.sender);
        //purchase it - transfer the owner
        _product.owner = msg.sender;
        //update product status
        _product.purchased = true;
        //update product
        products[_id] = _product;
        //pay seller
        address(_seller).transfer(msg.value);
        //trigger event
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);
    }
}