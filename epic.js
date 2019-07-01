//making express available::::::::::::::::::::::::::::::::::::::::::::::::
var express = require('express');
const epic = express();
var request = require('request');
//connecting to locahost::::::::::::::::::::::::::::::::::::::::::::::::::
const port = epic.listen(process.env.PORT || 3000, ()=>{
    console.log("app is listening to port 3000 sir!");
});

//setting engine to ejs::::::::::::::::::::::::::::::::::::::::::::::::::
epic.set('view engine', 'ejs');

//middlewares:::
epic.use(express.static(__dirname+'/public'));

//requiring formidable and fs::::::::::::::::::::::::::::::::::::::::::::
var fm = require('formidable');
var fs = require('fs');

//creating a method from formidable class::::::::::::::::::::::::::::::
var form = new fm.IncomingForm();

//requiring body-parser::::::::::::::::::::::::::::::::::::::::::::::::::::
var bodyParser = require('body-parser');
epic.use(bodyParser.json());
epic.use(bodyParser.urlencoded({extended:true}));

//require mongoose::::::::::::::::::::::::::::::::::::::::::::::::::::::
var mongoose = require('mongoose');

//setting promise::::::::::::::::::::::::::::::::::::::::::::::::::::::::
mongoose.Promise = global.Promise;

//index - onload::::::::::::::::::::::::;:::::::::::::::::::::::::::::::::
epic.get('/', (req, res)=>{
    res.render('index', { status: null, username: null });
});


//signup:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
epic.get('/sign_up', (req,res)=>{
     res.render('signup', {status: null, username: null, mobile: null});
});

//submitting sign-up data:::::::::::::::::::::::::::::::::::::::::::::::::
epic.post('/signup', (req, res)=>{
    //creating a method from formidable class::::::::::::::::::::::::::::::
    var form = new fm.IncomingForm();
    
    //submitting files and fields to database:::::::::::::::::::::::
    form.parse(req, (err, fields, files)=>{
        if(fields.username !="" && fields.mobile !="" && fields.cpassword !="" && fields.password != ""){
            //checking passowrd and confirm passowrd are equal::::::::::::::::::::
            if(fields.cpassword == fields.password){
                
                let tmp = files.file.path;
                let pix = files.file.name;
                let img = pix;
                let imgLink = "public/userImages/"+pix;

                let newUserInfo = {
                    username: fields.username,
                    mobile: fields.mobile,
                    password: fields.password,
                    file: img
                }
        
                //putting into database and sending from temporary location to permanent location::::::::::::::::::::::::::::::::::::
                fs.rename(tmp, imgLink, ()=>{
                    
                    var nUser = new user(newUserInfo);
                    nUser.save().then(data=>{
                        res.render('index', {status: 'signedIn', username: fields.username, mobile: null})
                    })
                })
            }
        else{
            res.render('signup', { status: 'password_err', username: fields.username, mobile: fields.mobile })
        }
    }
    else{
        res.render('signup', { status: 'fillform_err', username: fields.username, mobile: fields.mobile })
    }     
})
})

