const Block = require('./block');
const Transaction = require('./transaction');
const sha256 = require('sha256');


class Blockchain{

    constructor(){
        this.newTransactions = [];
        this.chain = [this.genesis()];
    }

    genesis(){
        //nonce previousBlock hash
        return new Block(0,999,'someTranscatins','previousBlockHash','hash');
    }

    newBlock(nonce, previousBlock, hash){
        const block = new Block(this.chain.length, nonce, this.newTransactions, previousBlock, hash);
        this.newTransactions =[]
        this.chain.push(block)
    }

    lastBlock(){
        return this.chain[this.chain.length-1];
    }

    newTransaction(amount, sender, recipient){
        this.newTransactions.push(new Transaction(amount, sender, recipient));
        return this.chain.length+1;
    }

    blockHash(nonce, prevBlockHash, currBlockData){
        const stringData = nonce.toString()+prevBlockHash+JSON.stringify(currBlockData);
        const hashedBlock = sha256(stringData);
        return hashedBlock;
    }

    proofOfWork(previousBlockhash, currentBlockData){
        let nonce = 0;
        let hash = this.blockHash(previousBlockhash, currentBlockData, nonce);
        
        while(hash.substring(0,4)!=='0000'){
            nonce++;
            hash = this.blockHash(previousBlockhash, currentBlockData, nonce);
            console.log(hash);
        }

        return nonce;
    }
}

module.exports = Blockchain;