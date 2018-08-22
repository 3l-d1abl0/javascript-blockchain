const express = require('express');
const router = express.Router();
const Blockchain = require('../../blockchain/blockchain');
const uuid = require('uuid/v1');

bcoin = new Blockchain();

//Generete a Random address for the Network Node
const nodeAddress = uuid().split('-').join('x');
console.log(`Node Address : ${nodeAddress}`);

router.get('/blockchain', (req, res, next)=>{
    res.status(200).send(bcoin);
});

router.post('/transaction', (req, res, next)=>{
    /* Create new transaction , new Bloack Index
    */
   const blockNumber = bcoin.newTransaction(req.body.amount, req.body.sender, req.body.recipient);
   res.status(200).json({
       message: `Transaction will be added to ${blockNumber}`
   });
   
});

router.get('/mine-block', (req, res, next)=>{

    const lastBlock = bcoin.lastBlock();
    const previousBlockHash = lastBlock['hash'];
    //Construct a curretn Block Data
    const currentBlock = {
        transactions : bcoin.newTransactions,
        index: lastBlock['index']
    };
    //Generate a nonce
    const nonce = bcoin.proofOfWork(previousBlockHash, currentBlock);
    //hash the current Block Data with the nonce Generated
    const hashBlock = bcoin.blockHash(nonce, previousBlockHash, currentBlock);

    //Reward the Miner //reward, senderMiningReward, networkNodeAddress
    bcoin.newTransaction(12.5,'miningRewardHash',nodeAddress);

    //Create the New Block
    const newBlock = bcoin.newBlock(nonce, previousBlockHash, hashBlock);

    res.status(200).json({
        message : "New block successfully Mined !",
        block : newBlock
    });
});

module.exports = router;