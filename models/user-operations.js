const mysql = require('../db.js');
const Model = require('../model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const configPath = 'config.json';
const parsedConfig = JSON.parse(fs.readFileSync(__dirname + '/../' + configPath, 'utf-8'));


class Users extends Model {
    constructor() {
        super();
    }
    findAllUsers(res, userID){
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user"});
            }
            else{
                if(result[0].role === 'admin') {
                    mysql.query(`SELECT login, fullName, email, rating, role FROM users ORDER BY rating DESC`, (err, result)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!result[0]) {
                            res.status(404).json({message :"No such user"});
                        }
                        else{
                            res.status(200).json(result);
                        }
                    })
                }
                else {
                    res.status(404).json({message: "You do not have the required access rights"});    
                }
            }
        })

    }
    findUserByID(res, userID, wantedId){
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user"});
            }
            else{
                if(result[0].role === 'admin') {
                    mysql.query(`SELECT login, fullName, email, picture, rating, role FROM users WHERE userID='${wantedId}'`, (err, result)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!result[0]) {
                            res.status(404).json({message :"No such user with this ID!"});
                        }
                        else{
                            res.status(200).json(result);
                        }
                    })
                }
                else {
                    res.status(404).json({message: "You do not have the required access rights"});    
                }
            }
        })
    }

    findUserMe(res, userID){
        mysql.query(`SELECT login, fullName, email, rating FROM users WHERE userID='${userID}'`, (err, result)=>{
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user with this ID!"});
            }
            else{
                res.status(200).json(result);
            }
        })
                
    }
    saveOneWithRole(res, userID, login, pass, fullName, email, role){
        const defaultPicure = fs.readFileSync(__dirname + '/../public/default.jpg','base64');
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user"});
            }
            else{
                if(result[0].role === 'admin') {                   
                    mysql.query(`INSERT INTO users(login, password, fullName, email, picture, role) 
                    VALUE("${login}", 
                    "${bcrypt.hashSync(pass, bcrypt.genSaltSync(10))}", 
                    "${fullName}", 
                    "${email}", 
                    "${defaultPicure}", 
                    '${role === 'admin'? 'admin' : 'user'}')`, (err, result)=>{
                        if(err){
                            res.status(404).json({message: err});
                        }
                        else{
                            res.status(200).json({message: "Info successfully added!"}); 
                        }
             
                    });
                }
                else {
                    res.status(404).json({message: "You do not have the required access rights"});    
                }
            }
        })
    }
    deleteUserByID(res, userID, wantedId){
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user"});
            }
            else{
                if(result[0].role === 'admin') {
                    mysql.query(`DELETE FROM users WHERE userID='${wantedId}'`, (err, result)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(result.affectedRows === 0) {
                            res.status(404).json({message :"No such user with this ID!"});
                        }
                        else{
                            res.status(200).json({message: "User with this ID was succesfully deleted!"});
                        }
                    })
                }
                else {
                    res.status(404).json({message: "You do not have the required access rights"});    
                }
            }
        })
    }
    deleteUserMe(res, userID){
        mysql.query(`DELETE FROM users WHERE userID='${userID}'`, (err, result)=>{
            if(err) {
                res.status(404).json({message: err});
            }
            else if(result.affectedRows === 0) {
                res.status(404).json({message :"No such user with this ID!"});
            }
            else{
                res.status(200).json({message: "User with this ID was succesfully deleted!"});
            }
        })
    }
    updateUserByID(res, userID, wantedID, login, email, fullName, role){
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user"});
            }
            else{
                if(result[0].role === 'admin') {
                    mysql.query(`SELECT login, fullName, email, role FROM users WHERE userID='${wantedID}'`, (err, result)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!result[0]) {
                            res.status(404).json({message :"No such user with this ID!"});
                        }
                        else{
                            let roleToAdd;
                            if(role){
                                roleToAdd = role === 'admin'? 'admin' : 'user';
                            }
                            else{
                                roleToAdd = result[0].role;
                            }
                            
                            mysql.query(`UPDATE users 
                                SET 
                                login='${login|| result[0].login}', 
                                fullName='${fullName|| result[0].fullName}', 
                                email='${email|| result[0].email}', 
                                role='${roleToAdd}' 
                                WHERE userID='${wantedID}'`, (err, resultUpdating)=>{
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else{
                                    res.status(200).json("Info succesfully updated");
                                }
                            })
                        }
                    })
                }
                else {
                    res.status(404).json({message: "You do not have the required access rights"});    
                }
            }
        })
    }
    updateUserMe(res, userID, login, email, fullName){
        mysql.query(`SELECT login, fullName, email FROM users WHERE userID='${userID}'`, (err, result)=>{
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user with this ID!"});
            }
            else{               
                mysql.query(`UPDATE users 
                    SET 
                    login='${login|| result[0].login}', 
                    fullName='${fullName|| result[0].fullName}', 
                    email='${email|| result[0].email}'
                    WHERE userID=${userID}`, (err, resultUpdating)=>{
                    if(err) {
                        res.status(404).json({message: err});
                    }
                    else{
                        res.status(200).json("Info succesfully updated");
                    }
                })
            }
        })
                
    
    }
    updateCurrentAvatar(res, userID, avatar, wantedID){
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user"});
            }
            else{
                if(result[0].role === 'admin') {
                    mysql.query(`UPDATE users SET picture='${avatar}' WHERE userID=${wantedID}`, (err, resultUpdating)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(resultUpdating.affectedRows === 0) {
                            res.status(404).json({message :"No such user with this ID"});
                        }
                        else {
                            res.status(200).json({message: "Picture successfully added!"});
                        }
                    })
                }
                else {
                    res.status(404).json({message: "You do not have the required access rights"});    
                }
            }
        })       
    }
    
    updateCurrentAvatarMe(res, userID, avatar){
        mysql.query(`UPDATE users SET picture='${avatar}' WHERE userID=${userID}`, (err, resultUpdating)=>{
            if(err) {
                res.status(404).json({message: err});
            }
            else if(resultUpdating.affectedRows === 0) {
                res.status(404).json({message :"No such user with this ID"});
            }
            else {
                res.status(200).json({message: "Picture successfully added!"});
            }
        })
    }
    getCurrentAvatar(res, userID){

        mysql.query(`SELECT image FROM test WHERE ID=${1}`, (err, result)=>{
            if(err) {
                res.status(404).json({message: err});
            }
            else {
                fs.writeFileSync('./public/toSend.jpg', result[0].image, 'base64');
                //res.send("<img src='./public/toSend.jpg' alt='BAD'>");
                res.sendFile(__dirname + '/../public/test.html')
            }
        })
    }
    
}

module.exports = Users;