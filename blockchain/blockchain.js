const Block = require('./block');


class Blockchain{

    constructor(){
        this.newTransactions = [];
        this.chain = [this.Genesis()];
    }

    Genesis(){
                    //nonce previousBlock hash
        return new Block();
    }
}