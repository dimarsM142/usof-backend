const mysql = require('../db.js');
const Model = require('../model.js');


class Categories extends Model {
    constructor(){
        super();   
    }
    findCategories(res, authorID = -1){
        mysql.query(`SELECT tittle, description FROM categories`, (err, fields)=>{
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!fields[0]) {
                res.status(404).json({message :"No categories in DB!"});
            }
            else{
                res.status(200).json({categories: fields});
            }
            
        })
    }
    findCategoryByID(res, wantedID, authorID = -1){

        mysql.query(`SELECT tittle, description FROM categories WHERE categoryID=${wantedID}`, (err, fields)=>{
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!fields[0]) {
                res.status(404).json({message :"No categories with this ID in DB!"});
            }
            else{
                res.status(200).json({categories: fields});
            }
        })
    }
    createNewCategory(res, userID, tittle, description){
        
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user"});
            }
            else{
                if(result[0].role === 'admin') {
                    mysql.query(`INSERT INTO categories(tittle, description) VALUES('${tittle}', '${description}')`, (err, fieldsAdding)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else{
                            res.status(200).json({message: "Info succesfully added!"});
                        }
                    })
                }
                else {
                    res.status(403).json({message: "You do not have access right!"});
                }
            }
        })
    }
    updateCategory(res, userID, wantedID, tittle, description){
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user"});
            }
            else{
                if(result[0].role === 'admin') {
                    mysql.query(`UPDATE categories 
                    SET tittle='${tittle}', description='${description}' 
                    WHERE categoryID=${wantedID}`, (err, fieldsAdding)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(fieldsAdding.affectedRows === 0){
                            res.status(200).json({message: "No categories with this ID"});
                        }
                        else{
                            res.status(200).json({message: "Info succesfully updated!"});
                        }
                    })
                }
                else {
                    res.status(403).json({message: "You do not have access right!"});
                }
            }
        })
    }
    deleteOneCategory(res, userID, wantedID){
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user"});
            }
            else{
                if(result[0].role === 'admin') {
                    mysql.query(`DELETE FROM categories WHERE categoryID=${wantedID}`, (err, fieldsAdding)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(fieldsAdding.affectedRows === 0){
                            res.status(200).json({message: "No categories with this ID"});
                        }
                        else{
                            res.status(200).json({message: "Info succesfully deleted!"});
                        }
                    })
                }
                else {
                    res.status(403).json({message: "You do not have access right!"});
                }
            }
        })
    }
    findPostsByCategoryID(res, wantedID, userID){
        mysql.query(`SELECT tittle, description FROM categories WHERE categoryID=${wantedID}`, (err, fields)=>{
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!fields[0]) {
                res.status(404).json({message :"No categories with this ID in DB!"});
            }
            else{
                mysql.query(`SELECT categoryID, tittle, content FROM posts`, (err, fieldsPosts)=>{
                    if(err) {
                        res.status(404).json({message: err});
                    }
                    else{
                        let arrOfPosts = [];
                        for(let i = 0; i < fieldsPosts.length; i++){
                            for(let j = 0; j < fieldsPosts[i].categoryID.arr.length; j++){
                                if(fieldsPosts[i].categoryID.arr[j] === wantedID){
                                   
                                    let tempObj = {
                                        nameOfPost: fieldsPosts[i].tittle,
                                        ContentOfPost: fieldsPosts[i].content
                                    }
                                    arrOfPosts.push(tempObj);
                                    break;
                                }
                            }
                        }
                        if(arrOfPosts.length === 0){
                            res.status(200).json({message: "No one post, that associated with this"});
                        }
                        else{
                            res.status(200).json({nameOfCategory: fields[0].tittle, posts: arrOfPosts});
                        }
                        
                    }
                })
                
            }
        })
    }
}

module.exports = Categories;