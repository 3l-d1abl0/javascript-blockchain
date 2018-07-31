const express = require('express');
const router = express.Router();

router.get('/blockchain', (req, res, next)=>{
    res.status(200).json({
        blockchain : "Blockchain-Info"
    });
});

router.post('transaction', (req, res, next)=>{
    /* Create new transaction , new Bloack Index
    */
   res.status(200).json({
       success: "Transaction-info"
   });
});

router.get('/mine-block', (req, res, next)=>{
    res.status(200).json({
        success: "New Block Info !"
    });
});

module.exports = router;