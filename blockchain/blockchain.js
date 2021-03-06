const Block = require('./block');
const Transaction = require('./transaction');
const sha256 = require('sha256');
const currentNode = process.argv[3];


class Blockchain{

    constructor(){
        this.newTransactions = [];
        this.chain = [this.genesis()];
        this.currentNode = currentNode;
        this.networkNodes = [];
    }

    genesis(){
        //idx, nonce, transactions, previousBlock, hash
        //nonce previousBlock hash
        return new Block(0,999,'someTranscations','previousBlockHash','hash');
    }

    newBlock(nonce, previousBlockHash, hash){
        const block = new Block(this.chain.length, nonce, this.newTransactions, previousBlockHash, hash);
        this.newTransactions =[];
        this.chain.push(block);

        return block;
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

    proofOfWork(previousBlockHash, currentBlockData){
        let nonce = 0;
        let hash = this.blockHash(nonce, previousBlockHash, currentBlockData);
        
        while(hash.substring(0,4)!=='0000'){
            nonce++;
            hash = this.blockHash(nonce, previousBlockHash, currentBlockData);
        }
        return nonce;
    }
}

module.exports = Blockchain;