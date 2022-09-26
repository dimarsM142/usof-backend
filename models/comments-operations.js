const mysql = require('../db.js');
const Model = require('../model.js');


class Comments extends Model {
    constructor(){
        super();   
    }
    findCommentByID(res, wantedID ,authorID = -1){
        mysql.query(`SELECT role FROM users WHERE userID=${authorID}`, (err, fieldsAuthor)=>{
            if(err){
                res.status(404).json({message: err});
            }
            else{
                mysql.query(`SELECT * FROM comment WHERE commentID=${wantedID}`, (err, fieldsComment)=>{
                    if(err) {
                        res.status(404).json({message: err});
                    }
                    else if(!fieldsComment[0]) {
                        res.status(404).json({message :"No comments with this ID in DB!"});
                    }
                    else{
                        mysql.query(`SELECT userID, login FROM users WHERE userID=${fieldsComment[0].authorID}`,(err, fieldsUser)=>{
                            if(err) {
                                res.status(404).json({message: err});
                            }
                            else {
                                mysql.query(`SELECT authorID, tittle, status, rating, locking FROM posts WHERE postID=${fieldsComment[0].postID}`, (err, fieldsPost)=>{
                                    if(err) {
    
                                        res.status(404).json({message: err});
                                    }
                                    else {
                                        if(fieldsAuthor[0] && fieldsAuthor[0].role === 'admin'){
                                            res.status(200).json({
                                                authorOfComment: fieldsUser[0].login,
                                                post: fieldsPost[0].tittle,
                                                comment: fieldsComment[0].content,
                                                dateOfComment: fieldsComment[0].publishDate
    
                                            });       
                                        }
                                        else{
                                            if((fieldsPost[0].status === 'active' || authorID === fieldsPost[0].authorID) && fieldsPost[0].locking == 'unlocked' && fieldsComment[0].locking == 'unlocked'){
                                                res.status(200).json({
                                                    authorOfComment: fieldsUser[0].login,
                                                    post: fieldsPost[0].tittle,
                                                    comment: fieldsComment[0].content,
                                                    dateOfComment: fieldsComment[0].publishDate
    
                                                });
                                            }
                                            else{
                                                res.status(404).json({message:"Not active comment"});
                                            }
    
                                        }
                                    }
                                })
                            }
                        })
                        
                    }
                })
            }
        })
    }
    findLikesOnComment(res, wantedID, userID = -1){
        
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else{
                if(result[0] && result[0].role === 'admin') {
                    mysql.query(`SELECT * FROM comment WHERE commentID=${wantedID}`, (err, fieldsComments)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsComments[0]) {
                            res.status(404).json({message :"No such comments with this 'comment_id'"});
                        }
                        else{
                            mysql.query(`SELECT * FROM likes WHERE commentID=${wantedID}`, (err, fieldsLikes)=>{ 
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else if(!fieldsLikes[0]) {
                                    res.status(404).json({message :"0 likes on this comment"});
                                }
                                else{
                                    mysql.query(`SELECT login, userID FROM users`, (err, fieldsUser)=>{
                                        if(err) {
                                            res.status(404).json({message: err});
                                        }
                                        else if(!fieldsUser[0]) {
                                            res.status(404).json({message :"No users in database"});
                                        }
                                        else{
                                            let finalRes = [];
                                            for(let i = 0; i < fieldsLikes.length; i++){ 
                                                let curAuthor = '';     
                                                for(let j = 0; j < fieldsUser.length; j++){
                                                    if(fieldsLikes[i].authorID == fieldsUser[j].userID){
                                                        curAuthor = fieldsUser[j].login;
                                                        break;
                                                    }
                                                }
                                                let currentObj = {
                                                    whoLiked: curAuthor,
                                                    comment: fieldsComments[0].tittle,
                                                    date: fieldsLikes[i].publishDate,
                                                    type: fieldsLikes[i].type
                                                }
                                                finalRes.push(currentObj);
                                            }
                                            res.status(200).json(finalRes);
                                            
                                        }
                                    })
                                }
                            })
                            
                        }
                    })
                }
                else{
                    mysql.query(`SELECT * FROM comment WHERE commentID=${wantedID} AND locking='unlocked'`, (err, fieldsComments)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsComments[0]) {
                            res.status(404).json({message :"No such unlocked comments with this 'comment_id'"});
                        }
                        else{
                            mysql.query(`SELECT * FROM posts WHERE (status='active' OR (status='inactive' AND authorID='${userID}')) AND postID=${fieldsComments[0].postID} AND locking='unlocked'`,(err, fieldsPost)=>{
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else if(!fieldsPost[0]) {
                                    res.status(404).json({message :"No such active comments!'"});
                                }
                                else{
                                    mysql.query(`SELECT * FROM likes WHERE commentID=${wantedID}`, (err, fieldsLikes)=>{ 
                                        if(err) {
                                            res.status(404).json({message: err});
                                        }
                                        else if(!fieldsLikes[0]) {
                                            res.status(404).json({message :"0 likes on this comment"});
                                        }
                                        else{                                           
                                            mysql.query(`SELECT login, userID FROM users`, (err, fieldsUser)=>{
                                                if(err) {
                                                    res.status(404).json({message: err});
                                                }
                                                else if(!fieldsUser[0]) {
                                                    res.status(404).json({message :"No users in database"});
                                                }
                                                else{
                                                    let finalRes = [];
                                                    for(let i = 0; i < fieldsLikes.length; i++){ 
                                                        let curAuthor = '';     
                                                        for(let j = 0; j < fieldsUser.length; j++){
                                                            if(fieldsLikes[i].authorID == fieldsUser[j].userID){
                                                                curAuthor = fieldsUser[j].login;
                                                                break;
                                                            }
                                                        }
                                                        let currentObj = {
                                                            whoLiked: curAuthor,
                                                            comment: fieldsComments[0].tittle,
                                                            date: fieldsLikes[i].publishDate,
                                                            type: fieldsLikes[i].type
                                                        }
                                                        finalRes.push(currentObj);
                                                    }
                                                    res.status(200).json(finalRes);
                                                    
                                                }
                                            })
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
    createNewLikeUnderComment(res, userID, wantedID, type){
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user"});
            }
            else{
                if(result[0].role === 'admin') {
                    mysql.query(`SELECT * FROM comment WHERE commentID=${wantedID}`, (err, fieldsComments)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsComments[0]) {
                            res.status(404).json({message :"No such comments with this 'comment_id'"});
                        }
                        else{
                            mysql.query(`SELECT * FROM posts WHERE postID=${fieldsComments[0].postID}`,(err, fieldsPost)=>{
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else if(!fieldsPost[0]) {
                                    res.status(404).json({message :"No such active comment!'"});
                                }
                                else{
                                    mysql.query(`SELECT * FROM likes WHERE commentID=${wantedID} AND authorID=${userID}`, (err, fieldsLikes)=>{
                                        if(err) {
                                            res.status(404).json({message: err});
                                        }
                                        else if(fieldsLikes.length !== 0){ 
                                            res.status(401).json({message :"This comment has already been liked"});
                                        }
                                        else {
                                            mysql.query(`INSERT INTO likes(authorID, commentID, type) VALUES(${userID}, ${wantedID}, '${type}')`, (err, fieldsLikesAdding)=>{ 
                                                
                                                if(err) {
                                                    res.status(404).json({message: err});
                                                }
                                                else{
                                                
                                                    //HERE
                                                    mysql.query(`SELECT * FROM users WHERE userID=${fieldsComments[0].authorID}`,(err, fieldsUsers)=>{
                                                        if(err) {
                                                            res.status(404).json({message: err});
                                                        }
                                                        else{
                                                            if(type === 'like'){
                                                                mysql.query(`UPDATE users SET rating='${+fieldsUsers[0].rating + 1}' WHERE userID=${fieldsComments[0].authorID}`,(err, fieldsRating)=>{
                                                                    if(err) {
                                                                        res.status(404).json({message: err});
                                                                    }
                                                                    else{
                                                                        mysql.query(`UPDATE comment SET rating='${+fieldsComments[0].rating + 1}' WHERE commentID=${fieldsComments[0].commentID}`,(err, fieldsRating)=>{
                                                                            if(err) {
                                                                                res.status(404).json({message: err});
                                                                            }
                                                                            else{
                                                                                res.status(200).json({message :"Like successfully added!"});     
                                                                            }   
                                                                        })   
                                                                    }   
                                                                })   
                                                            }
                                                            else{
                                                                mysql.query(`UPDATE users SET rating='${+fieldsUsers[0].rating - 1}' WHERE userID=${fieldsComments[0].authorID}`,(err, fieldsRating)=>{
                                                                    if(err) {
                                                                        res.status(404).json({message: err});
                                                                    }
                                                                    else{
                                                                        mysql.query(`UPDATE comment SET rating='${+fieldsComments[0].rating - 1}' WHERE commentID=${fieldsComments[0].commentID}`,(err, fieldsRating)=>{
                                                                            if(err) {
                                                                                res.status(404).json({message: err});
                                                                            }
                                                                            else{
                                                                                res.status(200).json({message :"Like successfully added!"});     
                                                                            }   
                                                                        })       
                                                                    }   
                                                                })   
                                                            }
                                                        } 
                                                    })           
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })                   
                }
                else{
                    mysql.query(`SELECT * FROM comment WHERE commentID=${wantedID} AND locking='unlocked'`, (err, fieldsComments)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsComments[0]) {
                            res.status(404).json({message :"No such comments with this 'comment_id'"});
                        }
                        else{
                            mysql.query(`SELECT * FROM posts WHERE (status='active' OR (status='inactive' AND authorID='${userID}')) AND postID=${fieldsComments[0].postID} AND locking='unlocked'`,(err, fieldsPost)=>{
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else if(!fieldsPost[0]) {
                                    res.status(404).json({message :"No such active comments!'"});
                                }
                                else{
                                    mysql.query(`SELECT * FROM likes WHERE commentID=${wantedID} AND authorID=${userID}`, (err, fieldsLikes)=>{
                                        if(err) {
                                            res.status(404).json({message: err});
                                        }
                                        else if(fieldsLikes.length !== 0){ 
                                            res.status(401).json({message :"This comment has already been liked"});
                                        }
                                        else {
                                            mysql.query(`INSERT INTO likes(authorID, commentID, type) VALUES(${userID}, ${wantedID}, '${type}')`, (err, fieldsLikesAdding)=>{ 
                                                if(err) {
                                                    res.status(404).json({message: err});
                                                }
                                                else{
                                                    //HERE
                                                    mysql.query(`SELECT * FROM users WHERE userID=${fieldsComments[0].authorID}`,(err, fieldsUsers)=>{
                                                        if(err) {
                                                            res.status(404).json({message: err});
                                                        }
                                                        else{
                                                            if(type === 'like'){
                                                                mysql.query(`UPDATE users SET rating='${+fieldsUsers[0].rating + 1}' WHERE userID=${fieldsComments[0].authorID}`,(err, fieldsRating)=>{
                                                                    if(err) {
                                                                        res.status(404).json({message: err});
                                                                    }
                                                                    else{
                                                                        mysql.query(`UPDATE comment SET rating='${+fieldsComments[0].rating + 1}' WHERE commentID=${fieldsComments[0].commentID}`,(err, fieldsRating)=>{
                                                                            if(err) {
                                                                                res.status(404).json({message: err});
                                                                            }
                                                                            else{
                                                                                res.status(200).json({message :"Like successfully added!"});     
                                                                            }   
                                                                        })   
                                                                    }   
                                                                })   
                                                            }
                                                            else{
                                                                mysql.query(`UPDATE users SET rating='${+fieldsUsers[0].rating - 1}' WHERE userID=${fieldsComments[0].authorID}`,(err, fieldsRating)=>{
                                                                    if(err) {
                                                                        res.status(404).json({message: err});
                                                                    }
                                                                    else{
                                                                        mysql.query(`UPDATE comment SET rating='${+fieldsComments[0].rating - 1}' WHERE commentID=${fieldsComments[0].commentID}`,(err, fieldsRating)=>{
                                                                            if(err) {
                                                                                res.status(404).json({message: err});
                                                                            }
                                                                            else{
                                                                                res.status(200).json({message :"Like successfully added!"});     
                                                                            }   
                                                                        })       
                                                                    }   
                                                                })   
                                                            }
                                                        } 
                                                    })                
                                                }
                                            })
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
    updateComment(res, wantedID, userID, content){
        mysql.query(`UPDATE comment SET content='${content}' WHERE authorID=${userID} AND commentID=${wantedID}`, (err, result)=>{
            if(err){
                res.status(404).json({message: err});
            }
            else if(result.affectedRows === 0){
                res.status(404).json({message :"No such your comments with this ID'"});
            }
            else{
                res.status(200).json({message: "Info succesfully updated!"});
            }
        })
    }

    updateCommentLocking(res, wantedID, userID){
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, resultUser) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!resultUser[0]) {
                res.status(404).json({message :"No such user"});
            }
            else{
                if(resultUser[0].role === 'admin') {
                    mysql.query(`SELECT locking FROM comment WHERE commentID='${wantedID}'`, (err, result)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!result[0]) {
                            res.status(404).json({message :"No such comment with this ID!"});
                        }
                        else{
                            if(result[0].locking ==='locked'){
                                mysql.query(`UPDATE comment SET locking='unlocked' WHERE commentID=${wantedID}`, (err, fieldsUpdating)=>{
                                    if(err) {
                                        res.status(404).json({message: err});
                                    }
                                    else {
                                        res.status(200).json({message :"This comment was unlocked"});
                                    }
                                })
                            }
                            else if(result[0].locking ==='unlocked'){
                                mysql.query(`UPDATE comment SET locking='locked' WHERE commentID=${wantedID}`, (err, fieldsUpdating)=>{
                                    if(err) {
                                        res.status(404).json({message: err});
                                    }
                                    else {
                                        res.status(200).json({message :"This comment was locked"});
                                    }
                                })
                            }
                        } 
                    })
                }
                else{
                    res.status(404).json({message: "You do not have access right!"});
                }
            }
        })
    }

    deleteOneComment(res, wantedID, userID){
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user"});
            }
            else{
                if(result[0].role === 'admin') {
                    mysql.query(`DELETE FROM comment WHERE commentID='${wantedID}'`, (err, result)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(result.affectedRows === 0) {
                            res.status(404).json({message :"No comment with this ID!"});
                        }
                        else{
                            res.status(200).json({message: "Comment with this ID was succesfully deleted!"});
                        } 
                    })
                }
                else{
                    mysql.query(`DELETE FROM comment WHERE commentID=${wantedID} AND authorID=${userID}`, (err, result)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(result.affectedRows === 0) {
                            res.status(404).json({message :"No such your comments with this ID!"});
                        }
                        else{
                            res.status(200).json({message: "Comment with this ID was succesfully deleted!"});
                        } 
                    })
                }
            }
        })
    }
    deleteOneLikeUnderComment(res, wantedID, userID){
        mysql.query(`SELECT * FROM likes WHERE commentID=${wantedID} AND authorID=${userID}`, (err, fieldsLikes)=>{
            if(err) {
                res.status(404).json({message: err});
            }
            else{
                mysql.query(`DELETE FROM likes WHERE commentID=${wantedID} AND authorID=${userID}`, (err, result)=>{
                    if(err) {
                        res.status(404).json({message: err});
                    }
                    else if(result.affectedRows === 0) {
                        res.status(404).json({message :"No such your like on comment with this ID!"});
                    }
                    else{
                        mysql.query(`SELECT * FROM comment WHERE commentID=${wantedID}`, (err, fieldsComments)=>{
                            if(err) {
                                res.status(404).json({message: err});
                            }
                            else{
                                mysql.query(`SELECT * FROM users WHERE userID=${fieldsComments[0].authorID}`,(err, fieldsUsers)=>{
                                    if(err) {
                                        res.status(404).json({message: err});
                                    }
                                    else{
                                        if(fieldsLikes[0].type === 'like'){
                                            mysql.query(`UPDATE users SET rating='${+fieldsUsers[0].rating - 1}' WHERE userID=${fieldsComments[0].authorID}`,(err, fieldsRating)=>{
                                                if(err) {
                                                    res.status(404).json({message: err});
                                                }
                                                else{
                                                    mysql.query(`UPDATE comment SET rating='${+fieldsComments[0].rating - 1}' WHERE commentID=${fieldsComments[0].commentID}`,(err, fieldsRating2)=>{
                                                        if(err) {
                                                            res.status(404).json({message: err});
                                                        }
                                                        else{
                                                            res.status(200).json({message :"This like was succesfully deleted"});     
                                                        }   
                                                    })   
                                                }   
                                            })   
                                        }
                                        else{
                                            mysql.query(`UPDATE users SET rating='${+fieldsUsers[0].rating + 1}' WHERE userID=${fieldsComments[0].authorID}`,(err, fieldsRating)=>{
                                                if(err) {
                                                    res.status(404).json({message: err});
                                                }
                                                else{
                                                    mysql.query(`UPDATE comment SET rating='${+fieldsComments[0].rating + 1}' WHERE commentID=${fieldsComments[0].commentID}`,(err, fieldsRating)=>{
                                                        if(err) {
                                                            res.status(404).json({message: err});
                                                        }
                                                        else{
                                                            res.status(200).json({message :"This like was succesfully deleted"});     
                                                        }   
                                                    })       
                                                }   
                                            })   
                                        }
                                    } 
                                })
                            }
                        })
                    } 
                })
            }
        })
    }

}

module.exports = Comments;