const UserReg = require("../models/user-reg");
const UsersLogin = require("../models/user-login");
const Token = require('../models/token.js');
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'dimonars11032003@gmail.com',
        pass:'ejlguxmwvxxsfkxq'
    }
});

const postRegister = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    const {login, password, passwordConfirmation, fullName, email} = req.body;
    if(!login || !password || !passwordConfirmation || !fullName || !email){
        res.status(404).json({message: "Check fields to input"});
    }
    else if(password === passwordConfirmation){
        let mailOptions = {
            from: 'dimonars11032003@gmail.com',
            to: email,
            subject: 'Welcome you in our site - "usof"!',
            text: `Thanks for registration`
        }
    
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                res.status(400).json({message: "Bad Email!"});
            }
            else{
                let someUserReg = new UserReg(login, password, fullName, email);
                someUserReg.saveOne(res);
            }
        })
     
    }
    else{
        res.status(404).json({message: "Password do not match"});
    }
    
}


const postLogin = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    let loginDB = new UsersLogin();
    const {login, password} = req.body;
    if(!login || !password){
        res.status(404).json({message: "Check fields to input"});
    }
    else{
        loginDB.userLogin(res, login, password);
        
    }
}

const getRefresh = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    const {refreshToken} = req.body;
    if(!refreshToken){
        res.status(400).json({message: "Token not found"});
    }
    else{
        let token = new Token();
        token.generateNewToken(res, refreshToken);
    }
}

const postLogout = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    const AccessToken = req.headers.authorization.replace('Bearer ', '');
    let token = new Token();
    token.findByIDAndDelete(res, AccessToken);
}



const postSendPassword = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    const {email} = req.body;
    if(!email){
        res.status(404).json({message: "Check fields to input"});
    }
    else{
        let newUser = new UsersLogin();
        newUser.checkAndSendPassword(res, email, req.url, req.headers.host);
    }
}

const postResetPassword = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    const {password} = req.body;
    if(!password){
        res.status(404).json({message: "Check fields to input"});
    }
    else{
        let token = new Token();
        token.findPasswordToken(res, req.params.token, password)
    }

}

module.exports = {
    postRegister, 
    postLogin, 
    getRefresh, 
    postLogout, 
    postSendPassword, 
    postResetPassword
};