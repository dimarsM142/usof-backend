const Users = require('../models/user-operations');
const Token = require('../models/token.js');
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

const  getUserID = (req, res) => {
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
            users.findUserByID(res, decodedToken.result.userID, +req.params.id);
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
        if(req._readableState.length === 0){
            res.status(404).json({message: "No file here"});
        }
            else{
                let type = JSON
                .parse(JSON
                    .stringify(req.headers)
                    .replace(/-/g, '_'))
                    .content_type
                    .slice(0, JSON.parse(JSON.stringify(req.headers).replace(/-/g, '_')).content_type.indexOf('/'));
                if(type !=='image'){
                    res.status(404).json({message: "This file is not image"});
                }
                else{
                    let users = new Users();
                    
                    const image = req._readableState.buffer.head.data.toString('base64');
                    users.updateCurrentAvatar(res, decodedToken.result.userID, image, +req.params.id);
                    //users.getCurrentAvatar(res, decodedToken.result.userID);
                    //res.status(200).json({message: "Ok"});
                }
            }
        }
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
        if(req._readableState.length === 0){
            res.status(404).json({message: "No file here"});
        }
        else{
            let type = JSON
            .parse(JSON
                .stringify(req.headers)
                .replace(/-/g, '_'))
                .content_type
                .slice(0, JSON.parse(JSON.stringify(req.headers).replace(/-/g, '_')).content_type.indexOf('/'));
            if(type !=='image'){
                res.status(404).json({message: "This file is not image"});
            }
            else{ 
                let users = new Users();
                const image = req._readableState.buffer.head.data.toString('base64');
                users.updateCurrentAvatarMe(res, decodedToken.result.userID, image);
            }
        }
    }
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


module.exports = {
    getUsers, 
    getUserID, 
    getUserMe,
    postUsers, 
    patchUsersAvatarByID, 
    patchUsersID,
    patchUsersMe, 
    deleteUsersID,
    deleteUsersMe,
    patchUsersAvatarMe
};