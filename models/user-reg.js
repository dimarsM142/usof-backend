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
        const defaultPicure = 'https://i.ibb.co/jyqT1by/3-E482896-06-CC-4-D2-A-91-DC-C19-CDBFCBC2-B-w1200-r1.webp';
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