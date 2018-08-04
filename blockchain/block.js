class Block{

    constructor(nonce, previousBlock, hash){
        this.index : 0,
        this.timestamp : Date.now(),
        this.transactions: "",
        this.nonce = nonce,
        this.hash = hash,
        this.previousBlock: previousBlock
    }
}


module.exports = Block;