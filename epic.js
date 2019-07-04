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
//var form = new fm.IncomingForm();

//requiring body-parser::::::::::::::::::::::::::::::::::::::::::::::::::::
var bodyParser = require('body-parser');
epic.use(bodyParser.json());
epic.use(bodyParser.urlencoded({extended:true}));

//requiring mysql::::::::::::::::::::::::::::::::::::::::::::::::::::::
var mysql = require('mysql');

//seting connection:::::::::::::::::::::::::::::::::::::::::
let connection = mysql.createConnection({
    host: "remotemysql.com",
    user: "1JTq39QISa",
    password: "wO8zfGSyqY",
    database: "1JTq39QISa"
});

//connecting::::::::::::::::::::::::::::::::::::::::::::
connection.connect(function(err){
    if(err) throw err;
    console.log('Database connected!')
});

//require mongoose::::::::::::::::::::::::::::::::::::::::::::::::::::::
var mongoose = require('mongoose');

//setting promise::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//mongoose.Promise = global.Promise;

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
                    sql_insert = `INSERT into user (username, mobile, password, file) values('${newUserInfo.username}','${newUserInfo.mobile}','${newUserInfo.password}','${newUserInfo.file}')`;
                    connection.query(sql_insert, (err,data)=>{
                        if(err)throw err;
                        res.render('index', { status: 'signedIn', username: fields.username, mobile: null})
                    });
                    // var nUser = new user(newUserInfo);
                    // nUser.save().then(data=>{
                    //     res.render('index', {status: 'signedIn', username: fields.username, mobile: null})
                    // })
                });
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

//rendering into dashborad if requirement is being met or reload login if otherwise
epic.post('/login', (req, res)=>{
    user.find({ username: req.body.username, password: req.body.password }, (err, myList)=>{
        //console.log(myList);
        if(myList==''){
            res.render('index', { status: 'username_err', username: null});
        }
        else{
            res.render('my-chat', { data: myList, username: req.body.username, status: null });
        }
    })
});

//rendering into add new frient page:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
epic.get('/add-friend/:user',(req,res)=>{
    //er = Empty Request
    res.render('add-friend', { frnd_id: 'er', user: req.params.user });
});

//searchimg for new friend::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
epic.post('/search', (req,res)=>{
    frndUsername = req.body.search_frnd;
    if(frndUsername==''){
        // empty request = er
        res.render('add-friend', { frnd_id: 'er', user: req.body.user })
    }
    user.find({ username: frndUsername }, (err, friends)=>{
        
        if(friends==''){
            // seach not found = nf
            res.render('add-friend', { frnd_id: 'nf', username: frndUsername, user: req.body.user })
        }
        else{
            res.render('add-friend', { frnd_id: 'found', username: friends[0].username, mobile: friends[0].mobile, file: friends[0].file, user: req.body.user })
        }
        //this is used for ajax post request in other to send the fetch information bak to the front end
        //res.send(friends);
    });
});

// //rendering back into add friend page with new friend's data:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// epic.get('/add/:frnd_id/:frnd_username/:frnd_mobile/:frnd_file/:user', (req, res)=>{
//     res.render('add-friend', { frnd_id: 'found', username: req.params.frnd_username, mobile: req.params.frnd_mobile, file: req.params.frnd_file, user: req.params.user })
// });

//submitting new friend's data to data-base:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
epic.post('/adding-new-friend', (req,res)=>{
   
        let newdata = {
            friendUsername: req.body.frnd_username,
            user: req.body.user,
            friendPic: req.body.file
        };

        friend.find({ user: newdata.user, friendUsername: newdata.friendUsername }, (err, data)=>{
            //checking if friends exist:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            if(data==''){
                //new friend into db:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                let nfrnd = new friend(newdata);
                nfrnd.save().then(data=>{
                    //fetching all friends of the user:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                    friend.find({ user: newdata.user }, (err, data)=>{ 
                        res.render('friend-list', {status: true, frnd_details: data, total: data.length, user: newdata.user })
                    })
                })

                // //setting a default message
                // let msg = {
                //     user: req.body.user,
                //     message: 'Welcome',
                //     frndUsername: newdata.friendUsername,
                //     timeStampHr: 0,
                //     timeStampMin: 0,
                //     timeStampSec: 0
                // };
                // let newMessage = new message(msg);
                // newMessage.save().then(data=>{

                // })
            }
            else{
                friend.find({ user: newdata.user }, (err, data)=>{ 
                    res.render('friend-list', {status: false, frnd_details: data, total: data.length, user: newdata.user, friendUsername: newdata.friendUsername })
                })
            }
        })


})

//displaying list of friends:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
epic.get('/friendList/:user', (req, res)=>{
    //fetching all friends of the user:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    friend.find({ user: req.params.user }, (err, data)=>{
        if(data==''){
            res.render('my-chat', { status: 'empty-friend-list', data: null, username: req.params.user});
        }
        else{
            //not empty::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            //user.find({ username: data[0].friendUsername}, (err, frnd_detail)=>{
               res.render('friend-list', {status: 'ne', frnd_details: data, total: data.length, user: req.params.user })
           // })
        }
    })
});

//displaying chat-room:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
epic.get('/chat/:frndUsername/:user', (req, res)=>{
    message.find({ user: req.params.user, frndUsername: req.params.frndUsername }, (err, data)=>{
       res.render('chatroom', { user: req.params.user, frndUsername: req.params.frndUsername });
    })
});

//socket io section start()::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
const io = require('socket.io')(port);

//opening socket connection::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
io.on('connection', (socket)=>{
    console.log('socket connection succesful sir');

    //receiving typing from the user and broadcasting the word typing back to the user:::::::::::::::::::::::::::::::::::::::::::::::
    socket.on('typing', (data)=>{
        socket.broadcast.emit('typing', { sender: data.sender, recipient: data.recipient })
    });

    //receiving not typing and emiting back not typing:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    socket.on('not-typing', (data)=>{
        socket.broadcast.emit('not-typing', { sender: data.sender, recipient: data.recipient })
    });

    //listenung and emitting old messages
    socket.on('old_message', (data)=>{
         message.find({ $or: [{ user: data.user, frndUsername: data.frndUsername}, { user: data.frndUsername, frndUsername: data.user }] }, (err, dat)=>{
            user.find({ username: data.frndUsername }, (err, result)=>{//console.log(dat);
                user.find({ username: data.user }, (err, result1)=>{
                    socket.emit('old_message', { msg_prop: dat, frnd_img: result[0].file , frnd_img1: result1[0].file })
                })
            })
         })
    })

    //emitting message::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    socket.on('new_message', (data)=>{
        let newMessage = new message(data);
        newMessage.save().then(dat=>{
            io.sockets.emit('new_message', { msg_prop: data })
           // user.find({ username: dat.frndUsername }, (err, result)=>{//console.log(result);
              //  user.find({ username: dat.user }, (err, result1)=>{
               // })
           // })
        })
    })
});


