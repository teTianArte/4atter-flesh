// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
let express = require("express");

let app = express();
let cors = require('cors');
let bodyParser = require("body-parser");
app.use(bodyParser.raw({ type: "*/*" }));
app.use(cors())

let tok_num = 5676;
let count = 0;
let tok_string = "";
let getTokNum = () => {
  return ++tok_num;
};

let getToken = () => {
  return "chat_id" + getTokNum().toString();
};

let passwords = new Map();
let tok_map = new Map();
let chan_map = new Map();
let join_map = new Map();
let banned_map = new Map();
let msg_map = new Map();

/*app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});*/
// SOURCE TO SERVER TEST
app.get("/sourcecode", (req, res) => {
res.send(require('fs').readFileSync(__filename).toString())
})
//OPEN PORT
app.listen(4000, () => {
  console.log("server started");
});

//LOGIN endpont-----------------------------------------------
app.post("/login", (req, res) => {
  let parsed = JSON.parse(req.body);
  let username = parsed.username;
  let actualPassword = parsed.password;
  let expectedPassword = passwords.get(username);
  let msg = undefined;
  let token;
  if (!actualPassword || !username) {
    /*default cases*/
    !actualPassword ? (msg = "password field missing"): (msg = "username field missing");
  }
  else if (!passwords.has(username)) msg = "User does not exist";
  else if (expectedPassword !== actualPassword) msg = "Invalid password";
  if (msg) {
    res.send(JSON.stringify({ success: false, reason: msg }));
  }else{
    token = getToken();
    tok_map.set(token, username);
    res.send(JSON.stringify({ success: true, token: token }));
  }
  
});
//SIGNUP endpont--------------------------------------------
app.post("/signup", (req, res) => {
  let parsed = JSON.parse(req.body);
  let username = parsed.username;
  let password = parsed.password;
  let msg = undefined;
  if (!password || !username) {
    /*default cases*/
    !password ? (msg = "password field missing") : (msg = "username field missing");
  }else if (passwords.has(username)) {
      msg =  "Username exists" ;
  }
  if (msg) res.send(JSON.stringify({ success: false, reason: msg }));
  else {
    passwords.set(username, password);
    res.send(JSON.stringify({ success: true }));
  }
});
//CREATE-CHANNEL endpoint---------------------------------------
app.post("/create-channel", (req, res) => {
  let parsed = JSON.parse(req.body);
  let channel_name = parsed.channelName;
  let token = req.headers.token;
  let err_msg = undefined;
  
  if (!token) err_msg = "token field missing";
  else if (!channel_name) err_msg = "channelName field missing";
  else if (tok_map.has(token)) {
    if (chan_map.has(channel_name)) err_msg = "Channel already exists";
    else {
      chan_map.set(channel_name, token);
      res.send(JSON.stringify({ success: true }));
      return;
    }
  } else err_msg = "Invalid token";

  res.send(JSON.stringify({ success: false, reason: err_msg }));

});
//JOIN-CHANNEL endpoint--------------------------------------------
app.post("/join-channel", (req, res) => {
  let parsed = JSON.parse(req.body);
  let channel_name = parsed.channelName;
  let token = req.headers.token;
  let error_join = undefined;
  
  if (!token) {
    error_join = "token field missing";
  } else if (!tok_map.has(token)) {
    error_join = "Invalid token";
  } else if (!channel_name) {
    error_join = "channelName field missing";
  } else if (!chan_map.has(channel_name)) {
    error_join = "Channel does not exist";
  } else if (join_map.has(token)){
    error_join = "User has already joined";
  } else if (banned_map.has(token)){
    error_join = "User is banned";
  }
  
  if (!error_join) {
    join_map.set(token, channel_name);
    res.send(JSON.stringify({ success: true }));
  } else {
    res.send(JSON.stringify({ success: false, reason: error_join }));
  }
});
//BAN endpoint--------------------------------------------
app.post("/ban", (req, res) => {
  let parsed = JSON.parse(req.body);
  let channel_name = parsed.channelName;
  let target = parsed.target;
  let token = req.headers.token;
  let error= undefined;
  let target_token
  if (!token) {
    error = "token field missing";
  } else if (!tok_map.has(token)) {
    error = "Invalid token";
  } else if (!channel_name) {
    error = "channelName field missing";
  } else if (!target){
    error = "target field missing";  
  }else if (token != chan_map.get(channel_name)) {
    error = "Channel not owned by user";
  }

  if (!error) {
    target_token = undefined;
    for (const [key, value] of tok_map.entries()) {
        
        if ( value==target ) 
          {
             target_token = key;
             break;
          }
         
    }
    banned_map.set(target_token, channel_name);
    res.send(JSON.stringify({ success: true }));
  } else {
    res.send(JSON.stringify({ success: false, reason: error }));
  }
});
//LEAVE-CHANNEL endpoint--------------------------------------------
app.post("/leave-channel", (req, res) => {
  
  let parsed = JSON.parse(req.body);
  let channel_name = parsed.channelName;
  let token = req.headers.token;
  let error_leave = undefined;

  if (!token) {
    error_leave = "token field missing";
  } else if (!tok_map.has(token)) {
    error_leave = "Invalid token";
  } else if (!channel_name) {
    error_leave = "channelName field missing";
  } else if (!chan_map.has(channel_name)) {
    error_leave = "Channel does not exist";
  }
  else if (!join_map.has(token)){
     error_leave = "User is not part of this channel";
  }
 
  if (!error_leave) {
    join_map.delete(token);
    res.send(JSON.stringify({ success: true }));
  } else {
    res.send(JSON.stringify({ success: false, reason: error_leave }));
  }
});
//JOINED endpoint--------------------------------------------
app.get("/joined", (req, res) => {
  //console.log("joined started");
  let token = req.headers.token;
  let channel_name = req.query.channelName;
  let joined = [];
  let user;
  
  let error_join = undefined;
  if (!token) {
    error_join = "token field missing";
  }else if (!tok_map.has(token)) {
    error_join = "Invalid token";
  }else if (!chan_map.has(channel_name)) {
    error_join = "Channel does not exist";
  }else if (!join_map.has(token)){
     error_join = "User is not part of this channel";
  }
 
  if (!error_join) {
    for (const [key, value] of join_map.entries()) {
        user = undefined;
        if ( value==channel_name ) 
          user = tok_map.get(key)
        else 
          continue;
        joined.push(user);
    }
    
    res.send(JSON.stringify({ success: true, joined: joined }));
    
  } else {
    res.send(JSON.stringify({ success: false, reason: error_join }));
  }
  
});
//DELETE endpoint--------------------------------------------
app.post("/delete", (req, res) => {
  let parsed = JSON.parse(req.body);
  let token = req.headers.token;
  let channel_name = parsed.channelName;
  let joined = [];
  //console.log(channel_name);
  
  let error = undefined;
    if (!token) {
    error = "token field missing";
  }else if (!tok_map.has(token)) {
    error = "Invalid token";
  }else if (!channel_name){
    error = "channelName field missing";
  }else if (!chan_map.has(channel_name)) {
    error = "Channel does not exist";
  }
  if (!error) {
   chan_map.delete(channel_name);
   res.send(JSON.stringify({ success: true}));
  }else {
    res.send(JSON.stringify({ success: false, reason: error}));
  }
});
//MESSAGE endpoint--------------------------------------------
app.post("/message", (req, res) => {
  let parsed = JSON.parse(req.body);
  let token = req.headers.token;
  let channel_name = parsed.channelName;
  let content = parsed.contents;
  let error = undefined;
  let msg = [];
  if (!token) {
    error = "token field missing";
  }else if (!tok_map.has(token)) {
    error = "Invalid token";
  }else if (!channel_name){
    error = "channelName field missing";
  }else if (!join_map.has(token)){
     error = "User is not part of this channel";
  }else if (!content){
     error = "contents field missing";
  }
  
  if (!error) {
    
   let user = tok_map.get(token);
   if (!msg_map.has(channel_name)) 
   {
     msg.push({from: user, contents:content});
     msg_map.set(channel_name,msg);
   }else
   {
      msg_map.get(channel_name).push({from: user, contents:content});
   }
    
    res.send(JSON.stringify({ success: true}));
  }else {
    res.send(JSON.stringify({ success: false, reason: error}));
  }
 });
//GET MESSAGE endpoint--------------------------------------------
app.get("/messages", (req, res) => {
    let msg = [];
    let token = req.headers.token;
    let channel_name = req.query.channelName;
    let error = undefined;
    if (!token) {
      error = "token field missing";
    }else if (!tok_map.has(token)) {
      error = "Invalid token";
    }else if (!channel_name){
      error = "channelName field missing";
    }else if (!chan_map.has(channel_name)) {
      error = "Channel does not exist";
    }else if (!join_map.has(token)){
       error = "User is not part of this channel";}
    
    if (!error)
    {
      msg = msg_map.get(channel_name);
      if (!msg) msg = [];
      //console.log(msg);
      res.send(JSON.stringify({ success: true, messages: msg }))
    }else{
      res.send(JSON.stringify({ success: false, reason: error}));
    }
})
//KICK endpoint--------------------------------------------
app.post("/kick", (req, res) => {
  let parsed = JSON.parse(req.body);
  let token = req.headers.token;
  let channel_name = parsed.channelName;
  let target = parsed.target;
  let error= undefined;
  let target_token;
  if (!token) {
    error = "token field missing";
  } else if (!tok_map.has(token)) {
    error = "Invalid token";
  } else if (!channel_name) {
    error = "channelName field missing";
  } else if (!target){
    error = "target field missing";  
  }else if (token != chan_map.get(channel_name)) {
    error = "Channel not owned by user";
  }
 if (!error) {
   
    target_token = undefined;
    for (const [key, value] of tok_map.entries()) {
        
        if ( value==target ) 
          {
             target_token = key;
             break;
          }
         
    }
    
    join_map.delete(target_token);
    res.send(JSON.stringify({ success: true }));
  } else {
    res.send(JSON.stringify({ success: false, reason: error}));
  }
  
});
//helpers
/*app.get("/tokens", (req, res) => {
  console.log("I am here");
  for (const [key, value] of tok_map.entries()) {
    console.log(key, value);
  }
  res.send("tokens request");
});

app.post("/setToken", (req, res) => {
  let token = req.headers.token;
  tok_map.set(token)
  res.send("good");
});
app.get("/test", (req, res) => {
  res.send("test");
});*/
