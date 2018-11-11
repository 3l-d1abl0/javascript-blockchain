const http = require('http');
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const api = require('./api/routes/app');
const logger = require("./api/logger");

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use('/api', api);

app.use((req, res, next)=>{
    const error = new Error('Not Found !');
    error.status = 404;
    next(error);
});

//Custom Error Handler
app.use((error, req, res, next)=>{
        logger.info(req.url);
        logger.info("error", error );
        res.status(error.status || 500);
        res.json({
            error:{
                message: error.message
            }
        });
});

app.use((req, res, next)=>{
    console.log(req.url);
    res.status(200).json({
        message: "Default handler !"
    });
});

//const port = process.env.PORT || 8080;
const port = process.argv[2];
console.log(`Port : ${port}`);

const server = http.createServer(app);

server.on('listening', function(){
    //console.log(`Listening : ${server.address().port} in ${server.get('env')}`);
    //console.log(server.address());
    console.log(`Listening : ${server.address().port}`);
});

server.listen(port);