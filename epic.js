//making express available::::::::::::::::::::::::::::::::::::::::::::::::
var express = require('express');
const app = express();
var request = require('request');
//connecting to locahost::::::::::::::::::::::::::::::::::::::::::::::::::
const port = app.listen(process.env.PORT || 3000, ()=>{
    console.log("app is listening to port 3000 sir!");
});

//declaring my secret key::::::::::::::::::::::::::::::::::::::::::::::::
        // live url
        // let url = 'https://api.ravepay.co/v2/kyc/bvn/';

        //developing url::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        let url = 'https://ravesandboxapi.flutterwave.com/v2/kyc/bvn/';
        let secret_key = 'FLWSECK-7e256e58ed1b03574a5fdc7205ed2b0f-X';

//setting engine to ejs::::::::::::::::::::::::::::::::::::::::::::::::::
app.set('view engine', 'ejs');

//middlewares:::
app.use(express.static(__dirname+'/public'));

//requiring formidable and fs::::::::::::::::::::::::::::::::::::::::::::
var fm = require('formidable');
var fs = require('fs');

//creating a method from formidable class::::::::::::::::::::::::::::::
var form = new fm.IncomingForm();

//requiring body-parser::::::::::::::::::::::::::::::::::::::::::::::::::::
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//require mongoose::::::::::::::::::::::::::::::::::::::::::::::::::::::
var mongoose = require('mongoose');

//setting promise::::::::::::::::::::::::::::::::::::::::::::::::::::::::
mongoose.Promise = global.Promise;

//database configuration:::::::::::::::::::::::::::::::::::::::::::::::::
//mongoose.connect("mongodb://localhost:27017/bvn_app");

//index - onload::::::::::::::::::::::::;:::::::::::::::::::::::::::::::::
app.get('/', (req, res)=>{
    res.render('index', { status: null, username: null });
});

