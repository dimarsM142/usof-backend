const mysql = require('../db.js');
const Model = require('../model.js');
const Token = require('./token.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { generatePasswordToken } = require('../helper/authHelper.js');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'dimonars11032003@gmail.com',
        pass:'ejlguxmwvxxsfkxq'
    }
});

class UsersLogin extends Model {
    constructor(){
        super();
    }
    userLogin(res, login, pass){
        const sql = `SELECT userID, login, password FROM users WHERE login='${login}'`;
        mysql.query(sql, (err, result)=>{
            if(err){
                res.status(404).json({message: err});
            }
            else if(!result[0]){
                res.status(404).json({message :"No such user"});
            }
            else{
                bcrypt.compare(pass, result[0].password, (err, resultPass)=>{
                    if(resultPass){
                        let token = new Token();
                        token.updateOneToken(res, result[0].userID);
                        //res.status(200).json({token: token, userID: result[0].userID, Login: result[0].Login, email: result[0].email, password: result[0].password});
                    }
                    else{
                        res.status(404).json({message:"Incorrect password"});
                    }
                })                
            }
        })
    }
    checkAndSendPassword(res, email, url, host){
        mysql.query(`SELECT email FROM users WHERE email='${email}'`, (err, result)=>{
            if(err){
                res.status(400).json({message: "ERROR:" + err});
            }
            else if(!result[0]){
                res.status(404).json({message: "This email is not registred"})
            }
            else{
                mysql.query(`DELETE FROM emailToReset WHERE email='${email}'`, (err, result) =>{
                    if(err){
                        res.status(400).json({message: "ERROR:" + err});
                    }
                    else{
                        let passToken = generatePasswordToken();
                        
                        mysql.query(`INSERT INTO emailToReset(tokenID, email) Value('${passToken.id}', '${email}')`, (err, result)=>{
                            if(err){
                                res.status(404).json({message: err});
                            }
                            else{
                                let mailOptions = {
                                    from: 'dimonars11032003@gmail.com',
                                    to: email,
                                    subject: 'Sending EMAIL to reset your password',
                                    text: `This link is only valid for 5 minutes. To change this password copy this link http://localhost:3000/forgot-password/${passToken.token}` 
                                }
                            
                                transporter.sendMail(mailOptions, function(error, info){
                                    if(error){
                                        res.status(400).json({message: "Bad email!"});
                                    }
                                    else{
                                        res.status(200).json({message: 'Email sent: ' + info.response});
                                    }
                                })
                            }
                        });
                    }
                })
            }
        })
        
    }
}

module.exports = UsersLogin;