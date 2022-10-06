const UserReg = require("../models/user-reg");
const UsersLogin = require("../models/user-login");
const Token = require('../models/token.js');

const postRegister = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    const {login, password, passwordConfirmation, fullName, email} = req.body;
    if(!login || !password || !passwordConfirmation || !fullName || !email){
        res.status(404).json({message: "Check fields to input"});
    }
    else if(password === passwordConfirmation){
        let someUserReg = new UserReg(login, password, fullName, email);
        someUserReg.saveOne(res);
     
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

const postRefresh = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
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
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    const AccessToken = req.headers.authorization.replace('Bearer ', '');
    let token = new Token();
    token.findByIDAndDelete(res, AccessToken);
}



const postSendPassword = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
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
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
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
    postRefresh, 
    postLogout, 
    postSendPassword, 
    postResetPassword
};