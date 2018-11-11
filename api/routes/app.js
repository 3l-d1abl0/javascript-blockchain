const express = require('express');
const router = express.Router();
const Blockchain = require('../../blockchain/blockchain');
const uuid = require('uuid/v1');
const reqPromise = require('request-promise');

const logger = require("../logger");

bchain = new Blockchain();

//Generete a Random address for the Network Node
console.log(uuid());
const nodeAddress = uuid().split('-').join('x');
console.log(`Node Address : ${nodeAddress}`);

router.get('/blockchain', (req, res, next)=>{
    res.status(200).send(bchain);
});

router.post('/transaction', (req, res, next)=>{
    /* Create new transaction , new Bloack Index
    */
   const blockNumber = bchain.newTransaction(req.body.amount, req.body.sender, req.body.recipient);
   res.status(200).json({
       message: `Transaction will be added to ${blockNumber}`
   });
   
});


router.get('/mine-block', (req, res, next)=>{

    const lastBlock = bchain.lastBlock();
    const previousBlockHash = lastBlock['hash'];
    //Construct a current Block Data
    const currentBlock = {
        transactions : bchain.newTransactions,
        index: lastBlock['index']
    };
    //Generate a nonce
    const nonce = bchain.proofOfWork(previousBlockHash, currentBlock);
    //hash the current Block Data with the nonce Generated
    const hashBlock = bchain.blockHash(nonce, previousBlockHash, currentBlock);

    //Reward the Miner //reward, senderMiningReward, networkNodeAddress
    bchain.newTransaction(12.5,'miningRewardHash',nodeAddress);

    //Create the New Block
    const newBlock = bchain.newBlock(nonce, previousBlockHash, hashBlock);

    res.status(200).json({
        message : "New block successfully Mined !",
        block : newBlock
    });
});

router.post('/new-node-reg',(req, res, next)=>{
    console.log('/new-node-reg', req.body);


    const newNodeUrl = req.body.newNodeUrl;

    if(bchain.networkNodes.indexOf(newNodeUrl)==-1){
         
 
         const nodePromises = [];
         //Get each Nwtwork Node
         bchain.networkNodes.forEach( networkNode =>{
             console.log(`${networkNode}/api/register-node`);
             nodePromises.push(reqPromise({
                 method: 'POST',
                 body: { newNodeUrl: newNodeUrl },
                 json: true,
                 uri: `${networkNode}/api/register-node`
             }));
         });
         
         console.log('Calling Promise !!');

         bchain.networkNodes.push(newNodeUrl);
         
         Promise.all(nodePromises)
         .then(data=>{
             
             //Request the New Node 
             let otherNodes = {
                 method: 'POST',
                 body: { allNetworkNodes: [...bchain.networkNodes, bchain.currentNode ] },
                 json: true,
                 uri: `${newNodeUrl}/api/register-bulk`
             };
             
             console.log('Sending request to the NewNode : ',otherNodes);
 
             return reqPromise(otherNodes);
         }).then(data=>{
             console.log(`New Node ${newNodeUrl}` );
             res.json({ note: `New Node ${newNodeUrl} Registed in the Network !` });
         }).catch(err=>{
             logger.info("error", err);
             res.json(err);
         });
 
    }//if

    //res.json( req.body );
});


router.post('/broadcast', (req, res, next)=>{
    /*
   const newNodeUrl = req.body.newNodeUrl;

   if(bchain.networkNodes.indexOf(newNodeUrl)==-1){
       
        bchain.networkNodes.push(newNodeUrl); 

        const nodePromises = [];
        //Get each Nwtwork Node
        bchain.networkNodes.forEach( networkNode =>{
            console.log(`${networkNode}/api/register-node`);
            nodePromises.push(reqPromise({
                method: 'POST',
                body: { newNodeUrl: newNodeUrl },
                json: true,
                uri: `${networkNode}/api/register-node`
            }));
        });

        Promise.all(nodePromises)
        .then(data=>{
            
            //Request the New Node 
            let otherNodes = {
                method: 'POST',
                body: { allNetworkNodes: [...bchain.networkNodes, bchain.curretNode ] },
                json: true,
                uri: `${newNodeUrl}/api/register-bulk`
            };
            
            console.log('Sending request to the NewNode : ',othernodes);

            return reqPromise(othernodes);
        }).then(data=>{
            res.json({ note: `New Node ${newNodeUrl} Registed in the Network !` });
        });

   }//if
   */

});

//this endpoint registers the incoming node addres with itself
router.post('/register-node',(req, res, next)=>{
    const newNodeUrl = req.body.newNodeUrl;
    
    if(bchain.networkNodes.indexOf(newNodeUrl) == -1 && bchain.currentNode !== newNodeUrl){
        bchain.networkNodes.push(newNodeUrl);
        res.json({ note : `New Node ${newNodeUrl} Registered !` });
    }
    
});

router.post('/register-bulk',(req, res, next)=>{

    const allNetworkNodes = req.body.allNetworkNodes;

    allNetworkNodes.forEach( networkNode => {

        //Add the Node which already doesn't exist
        if( bchain.networkNodes.indexOf(networkNode)==-1 && bchain.currentNode !== networkNode){
            bchain.networkNodes.push(networkNode);
        }

    } );

    res.json({ note : 'Bulk Registration Done !'});
});

module.exports = router;