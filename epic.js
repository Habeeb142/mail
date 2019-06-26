//making express available::::::::::::::::::::::::::::::::::::::::::::::::
var express = require('express');
const epic = express();

//connecting to locahost::::::::::::::::::::::::::::::::::::::::::::::::::
 myPort = epic.listen('process.env.PORT', ()=>{
     console.log("EPIC is listening to port well sir!");
 });

epic.listen('process.env.PORT', ()=>{
     console.log("EPIC is listening to port well sir!");
 });

//myPort = epic.listen(3000, '192.168.43.57', ()=>{
//    console.log("EPIC is listening to port 3000 sir!");
//});

//setting engine to ejs::::::::::::::::::::::::::::::::::::::::::::::::::
epic.set('view engine', 'ejs');

//middlewares:::
epic.use(express.static(__dirname+'/public'));

//requiring formidable and fs::::::::::::::::::::::::::::::::::::::::::::
var fm = require('formidable');
var fs = require('fs');

//requiring body-parser::::::::::::::::::::::::::::::::::::::::::::::::::::
var bodyParser = require('body-parser');
epic.use(bodyParser.json());
epic.use(bodyParser.urlencoded({extended:true}));
