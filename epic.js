//making express available::::::::::::::::::::::::::::::::::::::::::::::::
var express = require('express');
const epic = express();

//connecting to locahost::::::::::::::::::::::::::::::::::::::::::::::::::
 myPort = epic.listen('process.env.PORT', ()=>{
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

//require mongoose::::::::::::::::::::::::::::::::::::::::::::::::::::::
var mongoose = require('mongoose');

// //mlab connection: optional:::::::::::::::::::::::::::::::::::::::::::::::::::::::
// var opts = {
//     server: {
//        socketOptions: {keepAlive: 1}
//     }
// };
// switch(app.get('env')){
//    case 'development': 
//              mongoose.connect(credentials.mongo.
//              development.connectionString, opts);
//              break;
//    case 'production':                         
//              mongoose.connect(credentials.mongo.
//              production.connectionString, opts);
//              break;
//    default:
//         throw new Error('Unknown execution environment: ' + 
//                          app.get('env'));
// }

//setting promise::::::::::::::::::::::::::::::::::::::::::::::::::::::::
mongoose.Promise = global.Promise;

//database configuration: optional:::::::::::::::::::::::::::::::::::::::::::::::::
// mongoose.connect("mongodb://localhost:27017/epic_db");
//user schema::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
let userSchema = mongoose.Schema({
    username: String,
    mobile: String,
    password: String,
    file: String
});

let user = mongoose.model("users", userSchema);

//friend schema::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
let newFriend = mongoose.Schema({
    friendUsername: String,
    user: String,
    friendPic: String
});

let friend = mongoose.model("friend", newFriend);

//message properties::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
let messages = mongoose.Schema({
    user: String,
    message: String,
    frndUsername: String,
    timeStampMin: Number,
    timeStampHr: Number,
    timeStampSec: Number
});
let message = mongoose.model("message_prop", messages)

//index - onload::::::::::::::::::::::::;:::::::::::::::::::::::::::::::::
epic.get('/', (req, res)=>{
    res.render('index', { status: null, username: null });
});
console.log('here') ;
//routing into signup page::::::::::::::::::::::::::::::::::::::::::::::::

