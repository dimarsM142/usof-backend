const mysql = require('../db.js');
const Model = require('../model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../helper/authHelper.js');
const fs = require('fs');
const configPath = 'config.json';
const parsedConfig = JSON.parse(fs.readFileSync(__dirname + '/../' + configPath, 'utf-8'));

class Token extends Model {
    constructor(){
        super();   
    }
    updateOneToken(res, userID, role){

        let tokens = {
            Access: generateAccessToken(userID),
            Refresh: generateRefreshToken()
        }
        mysql.query(`INSERT INTO tokens(tokenID, userID) Value('${tokens.Refresh.id}', ${userID});`, (err, result)=>{
            if(err){
                res.status(404).json("BAD INPUT");
            }
            else{
                res.status(200).json({
                    AccessToken: tokens.Access,
                    RefreshToken: tokens.Refresh.token,
                    role: role
                });
            }
        });

    }
    generateNewToken(res, refreshToken){
        try{
           jwt.verify(refreshToken , parsedConfig.jwt);
        }
        catch(e){
            if(e instanceof jwt.TokenExpiredError){
                res.status(400).json({message: "Token expired!"})
                return;
            }
            else if (e instanceof jwt.JsonWebTokenError){
                res.status(400).json({message: "Invalid token"});
                return;
            }
            else{
                res.status(400).json({message: "Input error!"});
                return;
            }
        }    
        const refreshTokenID = jwt.verify(refreshToken , parsedConfig.jwt).id;

        if(jwt.verify(refreshToken , parsedConfig.jwt).type === 'refresh'){
            const sql = `SELECT userID FROM tokens WHERE tokenID='${refreshTokenID}'`;
            mysql.query(sql,(err, result)=>{
                if(err){
                    res.status(404).json({message: err});
                }
                else if(!result[0]){
                    res.status(404).json({message: "No such refresh token"});
                }
                else{
                    mysql.query(`SELECT role FROM users WHERE userID=${result[0].userID}`, (err, fieldsUsers)=>{
                        if(err){
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsUsers[0]){
                            res.status(404).json({message: "No such refresh token"});
                        }
                        else{
                            this.updateOneToken(res, result[0].userID, fieldsUsers[0].role);
                        }
                    })
                    
                }
            })
        }
        else{
            res.status(404).json({message: "Please, input refresh token. This one is access token!"});
        }
    }
    findByIDAndDelete(res, accessToken){
        try{
            jwt.verify(accessToken , parsedConfig.jwt);
        }
        catch(e){
            if(e instanceof jwt.TokenExpiredError){
                res.status(400).json({message: "Token expired!"})
                return;
            }
            else if (e instanceof jwt.JsonWebTokenError){
                res.status(400).json({message: "Invalid token"});
                return;
            }
            else{
                res.status(400).json({message: "Input error!"});
                return;
            }
        }    
        const userID = jwt.verify(accessToken, parsedConfig.jwt).userID;
        const sql = `DELETE FROM tokens WHERE userID='${userID}'`;
        mysql.query(sql, (err, result) =>{
            if(err){
                res.status(404).json({message:err});
            }
            else{
                res.status(200).json({
                    AccessToken: "",
                    RefreshToken: ""
                });
            }
        })
    }
    findPasswordToken(res, passToken, newPassword){
        try{
            jwt.verify(passToken , parsedConfig.jwt);
            if(jwt.verify(passToken , parsedConfig.jwt).type !== 'password'){
                res.status(400).json({message: "This token is not valid for this type of operation"});
                return;
            }
        }
        catch(e){
            if(e instanceof jwt.TokenExpiredError){
                res.status(400).json({message: "Token expired!"})
                return;
            }
            else if (e instanceof jwt.JsonWebTokenError){
                res.status(400).json({message: "Invalid token"});
                return;
            }
            else{
                res.status(400).json({message: "Input error!"});
                return;
            }
        } 
        let passTokenDecoded = jwt.verify(passToken , parsedConfig.jwt);
        mysql.query(`SELECT email FROM emailToReset WHERE tokenID='${passTokenDecoded.id}'`,(err, result)=>{
            if(err){
                res.status(404).json({message: err});
            }
            else if(!result[0]){
                res.status(404).json({message: "This token still not valid!"})
            }
            else{
                mysql.query(`DELETE FROM emailToReset WHERE tokenID='${passTokenDecoded.id}'`, (err, resultDeleting)=>{
                    if(err){
                        res.status(404).json({message: err});
                    }
                    else{
                        mysql.query(`UPDATE users SET password="${bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10))}" WHERE email='${result[0].email}'`, (err, resultChange)=>{
                            if(err){
                                res.status(404).json(err);
                            }
                            else{
                                res.status(200).json({message:"Password succesfully updated"});
                            }
                        })
                    }
                })
                
            }
        })

    }
    decodeToken(accessToken){
        try{
            jwt.verify(accessToken , parsedConfig.jwt);
        }
        catch(e){
            if(e instanceof jwt.TokenExpiredError){
                return {isErr: true, result: "Token expired"};
            }
            else if (e instanceof jwt.JsonWebTokenError){
                return {isErr: true, result: "Invalid token"};
            }
            else{
                return {isErr: true, result: "Input error!"};
            }
        }
        if(jwt.verify(accessToken , parsedConfig.jwt).type !== 'access'){
            return {isErr: true, result: "Not correct type of Token"};
        }
        else{
            return{isErr: false, result: jwt.verify(accessToken, parsedConfig.jwt)};
        }
        
    }
}

module.exports = Token;