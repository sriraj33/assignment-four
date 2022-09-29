const Marketplace = artifacts.require('Marketplace');
const { assert } = require('chai');

contract('Marketplace', ([deployer, seller, buyer]) => {
    let marketplace;
    
    before(async () => {
        marketplace = await Marketplace.deployed();
    })

    describe('deployment', async () => {
        it('deploy successfully', async() => {
            const address = await marketplace.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })
        it('it has a name', async() => {
            const name = await marketplace.name();
            assert.equal(name, 'Web3 Marketplace')
        })
    })

    describe('products', async() => {
        let result, productCount;
        before(async() => {
            result =await marketplace.createProduct('Music 1', web3.utils.toWei('1', 'ether'), {from: seller});
            productCount = await marketplace.productCount();
        })
        it('create products', async() => {
            //success cases
            assert.equal(productCount, 1);
            const event = result.logs[0].args;
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct');
        })
        it('sells products', async() => {
            result = await marketplace.purchaseProduct(productCount, {from: buyer, value: web3.utils.toWei('1', 'ether')});
            const event = result.logs[0].args;
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct');
            assert.equal(event.name, 'Music 1', 'name is correct');
            assert.equal(event.price, '1000000000000000000', 'price is correct');
            assert.equal(event.owner, buyer, 'id is correct');
            assert.equal(event.purchased, true, 'purchase is correct');
        })

    })
})