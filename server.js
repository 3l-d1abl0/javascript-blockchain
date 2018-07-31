const http = require('http');
const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));

const port = process.env.PORT || 8080;
const server = http.createServer(app);

server.on('listening', function(){
    //console.log(`Listening : ${server.address().port} in ${server.get('env')}`);
    console.log(`Listening : ${server.address().port}`);
});

server.listen(port);