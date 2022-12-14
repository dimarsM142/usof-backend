const mysql = require('../db.js');
const Model = require('../model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const configPath = 'config.json';
const Posts = require('./post-operations.js');
const parsedConfig = JSON.parse(fs.readFileSync(__dirname + '/../' + configPath, 'utf-8'));
const imgbbUploader = require('imgbb-uploader');

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
                    mysql.query(`SELECT userID, login, fullName, email, rating, role, picture FROM users ORDER BY rating DESC`, (err, result)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!result[0]) {
                            res.status(200).json({message :"No such user"});
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
    findUserByID(res, wantedId, userID = -1){
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else{
                if(result[0] && result[0].role === 'admin') {
                    mysql.query(`SELECT userID, login, fullName, email, rating, role, picture FROM users WHERE login='${wantedId}'`, (err, result)=>{
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
                    mysql.query(`SELECT userID, login, fullName, rating FROM users WHERE login='${wantedId}'`, (err, result)=>{
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
            }
        })
    }

    findUserMe(res, userID){
        mysql.query(`SELECT userID, login, fullName, email, rating FROM users WHERE userID='${userID}'`, (err, result)=>{
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
        const defaultPicure = 'https://i.ibb.co/jyqT1by/3-E482896-06-CC-4-D2-A-91-DC-C19-CDBFCBC2-B-w1200-r1.webp';
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
                    let imageFile = avatar;
                    imageFile.mv('file.jpg', (err)=>{
                        if(err){
                            res.status(400).json({message:'error'});
                        }
                        imgbbUploader('cbfb2ed4fcb5a79cfbf40e535e8b532d', 'file.jpg')
                        .then((response =>{
                            mysql.query(`UPDATE users SET picture='${response.url}' WHERE userID=${wantedID}`, (err, resultUpdating)=>{
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
                        }))
                        .catch((error)=>{res.status(400).json({message:"error"})})
                    });
                }
                else {
                    res.status(404).json({message: "You do not have the required access rights"});    
                }
            }
        })       
    }
    
    updateCurrentAvatarMe(res, userID, avatar){
        let imageFile = avatar;
            imageFile.mv('file.jpg', (err)=>{
                if(err){
                    res.status(400).json({message:'error'});
                }
                imgbbUploader('cbfb2ed4fcb5a79cfbf40e535e8b532d', 'file.jpg')
                .then((response =>{
                    mysql.query(`UPDATE users SET picture='${response.url}' WHERE userID=${userID}`, (err, resultUpdating)=>{
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
                }))
                .catch((error)=>{res.status(400).json({message:"error"})})
            });
        
    }

    getCurrentAvatarMe(res, userID){
        mysql.query(`SELECT picture FROM users WHERE userID=${userID}`, (err, result)=>{
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user with this ID"});
            }
            else {
                res.status(200).json({picture: result[0].picture});
            }
        })
        
    }
    getCurrentAvatar(res, login){
        mysql.query(`SELECT picture FROM users WHERE login='${login}'`, (err, result)=>{
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user with this ID"});
            }
            else {
                res.status(200).json({picture: result[0].picture});
            }
        })
    }

    getFavouritesByPostsByLogin(res, login, page, userID = -1) {
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else{
                if(result[0] && result[0].role === 'admin') {
                    mysql.query(`SELECT userID FROM users WHERE login='${login}'`, (err, fieldsUsers)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsUsers[0]) {
                            res.status(404).json({message :"No such user"});
                        }
                        else{
                            mysql.query(`SELECT * FROM favourites WHERE authorID=${fieldsUsers[0].userID}`, (err, fieldsFavourites)=>{
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else if(!fieldsFavourites[0]) {
                                    res.status(404).json({message :"No favourites"});
                                }
                                else{
                                    mysql.query('SELECT * FROM posts ORDER BY rating DESC', (err, fieldsPosts)=>{
                                        if(err) {
                                            res.status(404).json({message: err});
                                        }
                                        else if(!fieldsPosts[0]) {
                                            res.status(404).json({message :"No posts"});
                                        }
                                        else{
                                            let resArr = [];
                                            
                                            for(let j = 0; j < fieldsPosts.length; j++){
                                                for(let i = 0; i < fieldsFavourites.length; i++){
                                                    if(fieldsFavourites[i].postID === fieldsPosts[j].postID){
                                                        resArr.push(fieldsPosts[j]);
                                                        break;
                                                    }
                                                }
                                            }
                                            let posts = new Posts();
                                            posts.printAllPosts(res, resArr, [], page);
                                        }
                                    })
                                    
                                }
                            })
                            
                        }
                    })
    
                }
                else{

                    mysql.query(`SELECT userID FROM users WHERE login='${login}'`, (err, fieldsUsers)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsUsers[0]) {
                            res.status(404).json({message :"No such user"});
                        }
                        else{
                            mysql.query(`SELECT * FROM favourites WHERE authorID=${fieldsUsers[0].userID}`, (err, fieldsFavourites)=>{
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else if(!fieldsFavourites[0]) {
                                    res.status(200).json({message :"No favourites"});
                                }
                                else{
                                    
                                    mysql.query(`SELECT * FROM posts WHERE (status='active' OR (status='inactive' AND authorID='${userID}')) AND locking='unlocked' ORDER BY rating DESC`, (err, fieldsPosts)=>{
                                        if(err) {
                                            res.status(404).json({message: err});
                                        }
                                        else if(!fieldsPosts[0]) {
                                            res.status(200).json({message :"No posts"});
                                        }
                                        else{
                                            let resArr = [];
                                            
                                            for(let j = 0; j < fieldsPosts.length; j++){
                                                for(let i = 0; i < fieldsFavourites.length; i++){
                                                    if(fieldsFavourites[i].postID === fieldsPosts[j].postID){
                                                        resArr.push(fieldsPosts[j]);
                                                        break;
                                                    }
                                                }
                                            }
                                            let posts = new Posts();
                                            posts.printAllPosts(res, resArr, [], page);
                                        }
                                    })
                                    
                                }
                            })
                            
                        }
                    })
                
                }
            }
        })
    }
    
}

module.exports = Users;