const express = require('express');
const router = express.Router();
const Blockchain = require('../../blockchain/blockchain');

bcoin = new Blockchain();

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
    res.status(200).json({
        success: "New Block Info !"
    });
});

module.exports = router;