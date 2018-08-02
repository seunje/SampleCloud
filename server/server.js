const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const JWT = require('./jwt/auth.js');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const session = require('client-sessions');
const transporterObject = require('./store.js');
const app = express();
const sessions = [];
const transporter = nodemailer.createTransport(transporterObject);

const setHeaders = (link, to) => {
  const mailOptions = {
    from: 'n3op21@gmail.com', 
    to: to, 
    subject: 'SampleCloud', 
    html: link
  };
  return mailOptions;
}

console.log('Sessions: ', sessions);
mongoose.connect('mongodb://localhost/samplecloud');
const db = mongoose.connection;

//File MetaData
const fileSchema = mongoose.Schema({
  username: String,
  email: String,
  fileName: String,
  friendlyName: String,
  filePath: String,
  category: String,
  dateAdded: Date
});

//User MetaData
const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  dateCreated: String,
  admin: Boolean,
  active: Boolean,
  avatar: String,
  wallpaper: String,
  link: String
});

const User = mongoose.model('user', userSchema);
const File = mongoose.model('file', fileSchema);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to samplecloud DB.');
});

/* EXAMPLE DEFINING DOCUMENT
const sampleFile = new File({
  username: 'Paulius',
  email: 'p@ttt.com',
  fileName: 'test.mp3',
  friendlyName: 'sample300',
  filePath: 'http://localhost:3000/public/paul/test.mp3'
});

EXAMPLE SAVING DOCUMENT
sampleFile.save(function(err) {
  if(err) console.log(err)
  console.log('Saved!');
});
*/

// MIDLEWARE
// CLIENT-SESSIONS
app.use(session({
  cookieName: 'session323',
  secret: Math.random().toString(12).slice(2),
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use(fileUpload());
app.use(bodyParser.json());


verifyJWT_MW = (req, res, next) => {
  if(req.cookies.session){
    const currentSession = JSON.parse(req.cookies.session);
    console.log('IDS: ', sessions);
    console.log('Server req.cookies: ', currentSession);
    for(let i = 0; i < sessions.length; i++){
      const id = sessions[i].id;
      if(id.indexOf(currentSession.id) > -1){
        console.log('Mind your session: ', sessions[i]);
        let token = sessions[i];
      }
    }

  JWT.verifyJWT(token).then((decodedToken) => {
    req.user = decodedToken.data;
    console.log('verifyJWT_MW: ', req.user);
    next();
  }).catch((err) => {
    throw err;
  });
  }
}

encrypt = data => {
  let cipher = crypto.createCipher('aes-256-ecb', 'password');
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
};

decrypt = data => {
  let cipher = crypto.createDecipher('aes-256-ecb', 'password');
  return cipher.update(data, 'hex', 'utf8') + cipher.final('utf8');
};


//My Helper:
app.get('/', (req, res) => {
  const s = encrypt('mama');
  console.log(s);
  /*
  File.find({}, (err, files) => {
    for(let i in files) {
      let s = files[i].filePath.slice(21);
      console.log(s);
      File.update({ filePath: files[i].filePath }, { filePath: s }, (err, response) => {
        if(err) throw err
        console.log(response);
      });
    }
  });
  */
  res.send('hi');
});

// CLIENT-SESSIONS
/*
app.get('/s', (req, res) => {
  if(req.session && req.session.user) {
    console.log('req.sessions && req.session.user = true');
    User.findOne({ email: req.session.user.email }, (err, user) => {
      if(user){
        req.user = user;
        delete req.user.password;
        console.log(reg.session);
        res.locals.user = user;
        res.send(true);
      } else {
        req.session.reset();
        res.end();
      }
    });
  }
});
*/

//app.all('/api/session', verifyJWT_MW);

//Main, Sessions
app.get('/api/session', (req, res) => {
  if(req.cookies.session){
    const cookie = JSON.parse(req.cookies.session);
    const token = cookie.token;
    const jwt = {
      connected: true,
      token
    }
    console.log('Cookie: ', cookie);
    res.send(jwt);
  } else {
    console.log('Token was not found.');
  }
  res.end();
});

//User Page
app.get('/api/profile/:user', (req, res) => {
  const data = {
    files: '',
    user: ''
  };
  File.find({ 'username': req.params.user }, (err, files) => {
    data.files = files;
    User.find({ 'username': req.params.user}, (err, user) => {
      data.user = user;
      res.send(data);
    });
  });
});

//Return users avatar from db
app.post('/api/avatar', (req, res) => {
  const username = req.body.sample.username; 
  const email = req.body.sample.email;
  const q = {
    username: username,
    email: email
  };
  User.findOne(q, (err, user) => {
    if(err) throw err;
    res.send(user);
  });
});

//Update Pwd in the DB
app.post('/api/profile/pwd', (req, res) => {
  const username = req.body.user.username;
  const newPwd = req.body.newPwd;
  const email = req.body.user.email;
  console.log('e: ', email);
  const q = { 'username': username, 'email': email };
  User.update(q, { 'password': newPwd }, (err, response) => {
    if (err) throw err;
    console.log('Mongo: ', response);
    res.send({ updated: true });
  }).collation({ locale: 'en', strength: 1 });;
});

//Handle Wallpaper Upload
app.post('/api/profile/wallpaper', (req, res) => {
  const extTypes = ['.png', '.jpg', '.jpeg'];
  const username = req.body.username.toLowerCase();
  const email = req.body.email;
  const data = req.files.file;
  const dotIndex = data.name.lastIndexOf('.');
  const ext = data.name.slice(dotIndex);
  const fullPath = '../client/public/uploads/' + username + '/wallpaper/wallpaper' + ext; 
  const wallpaperURL = '/uploads/' + username + '/wallpaper/wallpaper' + ext;
  const q = {
    username: username,
    email: email
  };

  if(extTypes.indexOf(ext) > -1) {
    data.mv(fullPath, (err) => {
      if(err) throw err;
      console.log('Data.mv(); called');
      User.update(q, { 'wallpaper': wallpaperURL }, (err, response) => {
        console.log('Mongo:', response);
        res.end();
      });
    });
  }
});

//Handle Avatar Upload
app.post('/api/profile/avatar', (req, res) => {
  const extTypes = ['.png', '.jpg', '.jpeg'];
  const username = req.body.username.toLowerCase();
  const email = req.body.email;
  const data = req.files.file;
  const dotIndex = data.name.lastIndexOf('.');
  const ext = data.name.slice(dotIndex);
  const fullPath = '../client/public/uploads/' + username + '/avatar/avatar' + ext; 
  const avatarURL = '/uploads/' + username + '/avatar/avatar' + ext;
  const q = {
    username: username,
    email: email
  };

  if(extTypes.indexOf(ext) > -1) {
    data.mv(fullPath, (err) => {
      if(err) throw err;
      console.log('Data.mv(); called');
      User.update(q, { 'avatar': avatarURL }, (err, response) => {
        console.log('Mongo:', response);
        res.end();
      });
    });
  }
});

//Handle Sample Upload
app.post('/api/profile', (req, res) => {
  const extTypes = ['.mp3', '.wav']; 
  const data = req.files.file;
  const b = req.body;
  const username = b.user.toLowerCase();
  const category = b.category;
  const filePath = "/uploads/" + username + '/' + data.name;
  const userFolder = '../client/public/uploads/' + username;
  const date = Date();
  const files = [];
  const fullPath = userFolder + '/' + data.name;
  const dotIndex = data.name.lastIndexOf('.');
  const ext = data.name.slice(dotIndex);
  const fileMeta = new File({
    username: username,
    email: b.email,
    fileName: data.name,
    friendlyName: b.friendlyName,
    filePath: filePath,
    category: category,
    dateAdded: date 
  });
  // Do something with the file, put it somewhere on the server + ref to db + meta
  fs.readdirSync(userFolder).forEach(file => { 
    if(data.name === file){
      files.push(file);
    }
  });
  console.log('CATEGORY: ', category); 
  console.log('EXTENSION: ', ext); 
  if(files.length === 0 && extTypes.indexOf(ext) > -1){
    console.log('File Meta: ', fileMeta);
    fileMeta.save(function(err) {
      if(err) return console.log(err);
      res.send({ success: true });
    });
    data.mv(fullPath, (err) => {
      console.log('DATA.mv(); called!');
      if(err) console.log('ERROR: ', err);
    });
  } else {
    res.send({ 
      error: 'File already exists or unaccepted format. Accepted formats: [.mp3, .wav].',
      success: false 
    });
  }
});

const createDir = (dir) => {
  const avatarDir = dir + '/avatar/';
  if(!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    fs.mkdirSync(avatarDir);
  }
}

//New User Verification
app.get('/api/verify/:hash', (req, res) => {
  const hash = req.params.hash;
  User.findOne({ 'link': hash }, (err, user) => {
    if(err) throw err;
    if(user) {
      const userFolder = '../client/public/uploads/' + user.username;
      console.log('dir: ', userFolder);
      console.log('User.findOne: ', user);
      createDir(userFolder);
      User.update(user, { 'active': true, 'link': null }, (err, response) => {
        if(err) throw err;
        console.log('User.update: ', response);
        res.send('The account has been activated. <a href="http://n3op2.com">Login</a>');
      });
    } else {
      res.send('The link is no longer active.');
    }
  });
});

//Handle Register Form + Send a verification email
app.post('/api/register', (req, res) => {
  const password = req.body.password;
  const username = req.body.username;
  const email = req.body.email;
  const hash = Math.random().toString(12).substr(2);
  const date = Date();
  const userMeta = new User({
    username: username,
    email: email,
    password: password,
    dateCreated: date, 
    admin: false,
    active: false,
    avatar: '/img/default_avatar.png',
    wallpaper: '',
    link: hash
  });
  const link = 'http://n3op2.com/api/verify/' + hash;
  console.log('hash: ', hash);
  userMeta.save(function(err) {
    if(err) throw err;
      transporter.sendMail(setHeaders(link, email), (err, info) => {
        if(err) throw err;
        console.log(info);
      });
      res.send('The user has been added.');
    });
  });

//Check if username is free
app.post('/api/validate', (req, res) => {
  const b = req.body;
  console.log('/api/checkUsername req: ', b.username);
  // To check against DB if this username is taken or not and return true or false.
  User.findOne({ 'username': b.username }, (err, user) => {
    if(err) throw err;
    if(user){
      console.log('User found!');
      res.send({
        free: true
      });
    } else {
      console.log('User NOT found!');
      res.send({
        free: false
      });
    }
  });
});

//Handle Login Form
app.post('/login', (req, res) => {
  const b = req.body;
  const username = b.username.toLowerCase();
  const password = b.password;
  User.findOne({ 'username': username, 'password': password }, (err, user) => {
    if(err) throw err;
    if(user){
      user.password = Math.random().toString(12).slice(2);
      const data = {
        id: Math.random().toString(12).slice(2),
        token: JWT.createJWT({
          sessionData: user,
          maxAge: 3600
        })
      }
      /*
      console.log('EnCoded Token: ', data.token);
      console.log('Decoded Token: ', jwt.verify(data.token, 'secret', (err, decodedToken) => {
        return decodedToken;
      }));
      */
      sessions.push(data);
      res.send(data);
    } else {
      res.send(null);
    }
  }).collation({ locale: 'en', strength: 1 });
});

//User Page
app.get('/api/user/:username', (req, res) => {
  const username = req.params.username;
  console.log('p :',req.params); 
  User.findOne({ 'username': username }, (err, user) => {
    console.log('User: ', user);
    if(err) console.log( err);
    const q = {
      username: user.username,
      email: user.email
    };
    File.find(q, (err, files) => {
      if(err) throw err;
      res.send({
        user: user,
        files: files
      });
    });
  });
});

//Might need to delete this or move it.
app.get('/api/about', (req, res) => {
  let obj = {
    arg1: 'I like blue apples.',
    arg2: 'There is no way back.'
  };
  res.send(obj);
});

//Selective Search
app.get('/api/browse', (req, res) => {
  const usersArr = [];
  const catsArr = [];
  const allFiles = [];

  File.find(function(err, files){
    allFiles.push(files);
    files.map((item) => {
      if(usersArr.indexOf(item.username.toLowerCase()) === -1){
        usersArr.push(item.username.toLowerCase());
      }
      if(catsArr.indexOf(item.category.toLowerCase()) === -1){
        catsArr.push(item.category.toLowerCase());
      }
    });
    res.send({
      users: usersArr,
      categories: catsArr,
      files: allFiles
    });
  });
});

//Search
app.post('/api/browse/search', (req, res) => {
  const searchVal = req.body.searchInput;
  const searchCond = req.body.searchCond;
  const searchType = req.body.searchType;
  const regExp = new RegExp(['^', searchVal, '$'].join(''), 'i');
  const query = {};

  query[searchType] = searchCond;
  console.log('Search Condition: ', searchCond);
  console.log('Search Type: ', searchType);
  if(searchCond){
    File.find({ $and: [{ 'friendlyName': { $regex: new RegExp("^" + searchVal, 'i') }}, query ]}, (err, files) => {
      if(err) throw err;
      res.send(files);
    }).collation({ locale: 'en', strength: 1 });
  } else {
    File.find({ 'friendlyName': { $regex: searchVal } }, function(err, files){
      if(err) throw err;
      res.send(files);
    });
  }
  // Merge array into a single array //
  /*
  filterArr = [].concat.apply([], tmpArr);
  // Filter by given value indexOf(val) > -1 (if > -1 element found)
  filterArr = filterArr.filter((sample) => sample.toLowerCase().indexOf(b) > -1);
  res.send(filterArr);
  */
});

app.post('/api/browse/getfiles', (req, res) => {
  const value = req.body.val
  const type = req.body.type
  const query = {};

  query[type] = value;
  File.find(query, (err, files) => {
    if(err) return err 
    res.send(files);
  }).collation({ locale: 'en', strength: 1 });

  /* findIndex
  const i = sampleObj.findIndex(file => file.username === b.arg);
  console.log(sampleObj[i]);
  res.send(sampleObj[i]);
  */
});

//HOME
app.get('/api/home', (req, res) => {
  let options = {
    maxAge: 1000 * 60 * 15,
    httpOnly: true,
  }
  const maxSamples = 10;

  File.find({}).sort({dateAdded: -1}).exec((err, files) => {
    const samples = files.splice(0, maxSamples);
    res.send(samples);
  });
});

app.listen(3010, () => {
  console.log('Server has started.');
});
