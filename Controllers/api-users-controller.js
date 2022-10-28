const Users = require('../models/user-operations');
const Token = require('../models/token.js');
const fs = require('fs');
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'dimonars11032003@gmail.com',
        pass:'ejlguxmwvxxsfkxq'
    }
});

const getUsers = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    const accessToken = req.headers.authorization.replace('Bearer ', '');
    let token = new Token();

    const decodedToken = token.decodeToken(accessToken);
    if(decodedToken.isErr){
        res.status(400).json({message:decodedToken.result});
    }
    else{
        let users = new Users();
        users.findAllUsers(res, decodedToken.result.userID);
    }
    
}

const  getUserLogin = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!req.params.login){
        res.status(404).json({message: "No login"});
    }
    else{
        const accessToken = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : ' ';
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
        let users = new Users();
        if(decodedToken.isErr){
            users.findUserByID(res, req.params.login);
        }
        else{
          
            users.findUserByID(res, req.params.login, decodedToken.result.userID);
        }
    }
}

const  getUserMe = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    const accessToken = req.headers.authorization.replace('Bearer ', '');
    let token = new Token();
    const decodedToken = token.decodeToken(accessToken);
    if(decodedToken.isErr){
        res.status(400).json({message: decodedToken.result});
    }
    else{
        let users = new Users();
        users.findUserMe(res, decodedToken.result.userID);
    }
}

const postUsers = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    const {login, password, passwordConfirmation, fullName, email, role} = req.body;
    if(!login || !password || !passwordConfirmation || !fullName || !email || !role){
        res.status(404).json({message: "Check fields to input"});
    }
    else if(role !== 'admin' && role !=='user'){
        res.status(404).json({message: "please use correct name of field 'role': 'user' or 'admin'"});
    }
    else if(password !== passwordConfirmation){
        res.status(404).json({message: "Password do not match"});     
    }
    else{
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
        if(decodedToken.isErr){
            res.status(400).json({message: decodedToken.result});
        }
        else{
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
                    let users = new Users();
                    users.saveOneWithRole(res, decodedToken.result.userID, login, password, fullName, email, role);

                }
            })
        }   
    }   
}

const  patchUsersAvatarByID = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!Number.isInteger(+req.params.id) || +req.params.id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
        if(decodedToken.isErr){
            res.status(400).json({message: decodedToken.result});
        }
        else{
            let users = new Users();
            users.updateCurrentAvatar(res, decodedToken.result.userID, req.files.file, +req.params.id);
        }
        
    }
}

const  patchUsersAvatarMe = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    const accessToken = req.headers.authorization.replace('Bearer ', '');
    let token = new Token();
    const decodedToken = token.decodeToken(accessToken);
    if(decodedToken.isErr){
        res.status(400).json({message: decodedToken.result});
    }
    else{
        let users = new Users();
        users.updateCurrentAvatarMe(res, decodedToken.result.userID, req.files.file);
    }
}

const patchUsersID = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    
    if(!Number.isInteger(+req.params.id) || +req.params.id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        id = +req.params.id;
        const {login, fullName, email, role} = req.body;
        if(!login && !fullName && !email && !role){
            res.status(404).json({message: "USAGE: Input fields, which you want to change(login, fullName, email, role).",
            example: {
                nameOfField1:"value1",
                nameOfField2:"value2",
            }});
        }
        else if(!id){
            res.status(404).json({message: "USAGE: Input fields, which you want to change(login, fullName, email, role).",
                example: {
                    nameOfField1:"value1",
                    nameOfField2:"value2",
                }});
        } 
        else if(role !== 'admin' && role !=='user' && role){
            res.status(404).json({message: "please use correct name of field 'role': 'user' or 'admin'"});
        }
        else{
            if(!Number.isInteger(+id) || +id <= 0){
                res.status(404).json({message: "This id is not natural number"});
            }
            else{
                const accessToken = req.headers.authorization.replace('Bearer ', '');
                let token = new Token();
                const decodedToken = token.decodeToken(accessToken);
                if(decodedToken.isErr){
                    res.status(400).json({message: decodedToken.result});
                }
                else{
        
                    let users = new Users();
                    users.updateUserByID(res, decodedToken.result.userID, +id, login, email, fullName, role);
                }
            }

        }
    }
    
}

const patchUsersMe = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    const {login, fullName, email} = req.body;
    if(!login && !fullName && !email){
        res.status(404).json({message: "USAGE: Input fields, which you want to change(login, fullName, email).",
        example: {
            nameOfField1:"value1",
            nameOfField2:"value2",
        }});
    }
    else{
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
        if(decodedToken.isErr){
            res.status(400).json({message: decodedToken.result});
        }
        else{
            let users = new Users();
            users.updateUserMe(res, decodedToken.result.userID, login, email, fullName);
        }
    }
}

const  getUsersAvatarMe = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    const accessToken = req.headers.authorization.replace('Bearer ', '');
    let token = new Token();
    const decodedToken = token.decodeToken(accessToken);
    if(decodedToken.isErr){
        res.status(400).json({message: decodedToken.result});
    }
    else{
        let users = new Users();
        users.getCurrentAvatarMe(res, decodedToken.result.userID);
    }
}

const  getUserAvatarLogin = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    console.log(req.params.login);   
    if(!req.params.login){
        res.status(404).json({message:'No such user'});
    } 
    else{
        let users = new Users();
        users.getCurrentAvatar(res, req.params.login);
    }
   
        //users.updateCurrentAvatarMe(res, decodedToken.result.userID, req.files.file);
}


const  deleteUsersID = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!Number.isInteger(+req.params.id) || +req.params.id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
        if(decodedToken.isErr){
            res.status(400).json({message: decodedToken.result});
        }
        else{
            let users = new Users();
            users.deleteUserByID(res, decodedToken.result.userID, +req.params.id);
        }
    }
}

const deleteUsersMe = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    const accessToken = req.headers.authorization.replace('Bearer ', '');
    let token = new Token();
    const decodedToken = token.decodeToken(accessToken);
    if(decodedToken.isErr){
        res.status(400).json({message: decodedToken.result});
    }
    else{
        let users = new Users();
        users.deleteUserMe(res, decodedToken.result.userID);
    }
    
}

const getFavouritesUserLogin = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    const accessToken = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : ' ';
    let token = new Token();
    let users = new Users();
    const decodedToken = token.decodeToken(accessToken);
    if(!Number.isInteger(+req.query.page) || +req.query.page <= 0){
        res.status(404).json({message: "This page is not natural number"});
    }
    else{
        if(decodedToken.isErr){
            users.getFavouritesByPostsByLogin(res, req.params.login, +req.query.page)
        }
        else{
            users.getFavouritesByPostsByLogin(res, req.params.login, +req.query.page, decodedToken.result.userID);
        }
    }
   
}

module.exports = {
    getUsers, 
    getUserLogin, 
    getUserMe,
    postUsers, 
    patchUsersAvatarByID, 
    patchUsersID,
    patchUsersMe, 
    deleteUsersID,
    deleteUsersMe,
    patchUsersAvatarMe,
    getUsersAvatarMe,
    getUserAvatarLogin,
    getFavouritesUserLogin

};