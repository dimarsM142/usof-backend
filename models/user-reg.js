const mysql = require('../db.js');
const Model = require('../model.js');
const bcrypt = require('bcrypt');
const fs = require('fs');
const {generateAccessToken, generateRefreshToken} = require('../helper/authHelper');
class SaveOne extends Model {
    constructor(login, pass, fullName, email){
        super();
        this.login = login;
        this.pass = pass;
        this.fullName = fullName;
        this.email = email;
    }
    saveOne(res){
        const defaultPicure = fs.readFileSync(__dirname + '/../public/default.jpg','base64');
        const sql = `INSERT INTO users(login, password, fullName, email, picture) 
        VALUE("${this.login}", "${bcrypt.hashSync(this.pass, bcrypt.genSaltSync(10))}", "${this.fullName}", "${this.email}", "${defaultPicure}")`;
            mysql.query(sql, (err, result)=>{
                if(err){
                    res.status(404).json({message: err.sqlMessage});
                }
                else{
                    
                    res.status(200).json("Info successfully added!"); 
                }
     
            });


    }
  
}

module.exports = SaveOne;