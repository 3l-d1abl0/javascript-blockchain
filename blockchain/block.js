class Block{

    constructor(idx, nonce, transactions, previousBlock, hash){
        this.index = idx,
        this.timestamp = Date.now(),
        this.transactions= transactions,
        this.nonce = nonce,
        this.hash = hash,
        this.previousBlock = previousBlock
    }
}


module.exports = Block;