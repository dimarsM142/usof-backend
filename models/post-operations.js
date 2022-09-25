const mysql = require('../db.js');
const Model = require('../model.js');

class Posts extends Model {
    constructor(){
        super();   
    }
    filterResArr(arrOfFilters, finalRes){
        if(!arrOfFilters || (!arrOfFilters.category && !arrOfFilters.status && !arrOfFilters.startDate && !arrOfFilters.endDate)){
            return finalRes;
        }
        else{
            if(arrOfFilters.category){
                let tempArr = [];
                let arrOfCategories = arrOfFilters.category.split(',');
                let isAdded = false;
                for(let i = 0; i < finalRes.length; i++){
                    isAdded = false;
                    for(let j = 0; j < finalRes[i].categories.length; j++){
                        if(isAdded){
                            break;
                        }
                        else{
                            for(let k = 0; k < arrOfCategories.length; k++){
                                if(finalRes[i].categories[j].tittle === arrOfCategories[k]){
                                    tempArr.push(finalRes[i]);
                                    isAdded = true;
                                    break;
                                }
                            }
                        }                      
                    }                   
                }
                finalRes = [];
                for(let i = 0; i < tempArr.length; i++){
                    finalRes[i] = tempArr[i];
                }               
            }
            if(arrOfFilters.status){
                let tempArr = [];
                for(let i = 0; i < finalRes.length; i++){
                    if(finalRes[i].status === arrOfFilters.status){
                        tempArr.push(finalRes[i]);
                    }
                }
                finalRes = [];
                for(let i = 0; i < tempArr.length; i++){
                    finalRes[i] = tempArr[i];
                } 
            }
            if(arrOfFilters.startDate){
                let tempArr = [];
                const arrStart = arrOfFilters.startDate.split('-');
                const start = new Date(`${arrStart[2]}-${arrStart[1]}-${arrStart[0]}`);
                for(let i = 0; i < finalRes.length; i++){
                    if(finalRes[i].date.getTime() > start.getTime()){
                        tempArr.push(finalRes[i]);
                    }                  
                }
                finalRes = [];
                for(let i = 0; i < tempArr.length; i++){
                    finalRes[i] = tempArr[i];
                } 
            }
            if(arrOfFilters.endDate){
                let tempArr = [];
                const arrFinish = arrOfFilters.endDate.split('-');
                const finish = new Date(`${arrFinish[2]}-${arrFinish[1]}-${arrFinish[0]}`);
                for(let i = 0; i < finalRes.length; i++){
                    if(finalRes[i].date.getTime() < finish.getTime()){
                        tempArr.push(finalRes[i]);
                    }                  
                }
                finalRes = [];
                for(let i = 0; i < tempArr.length; i++){
                    finalRes[i] = tempArr[i];
                } 
            }
            if(!finalRes.length){
                return {message: "There are no posts matching these filters"};
            }
            else{
                return finalRes;
            }
            
        }
        

    }
    printAllPosts(res, arrOfData, arrOfFilters){
        let finalRes = [];
        for(let i = 0; i < arrOfData.length; i++){
            //let result = this.printOnePost(res, arrOfData, i, finalRes, arrOfFilters, isErr);
            this.printOnePost(res, arrOfData, i, finalRes, arrOfFilters);
        }       
    }
    printOnePost(res, arrOfData, i, finalRes, arrOfFilters){
        mysql.query(`SELECT login FROM users WHERE userID=${arrOfData[i].authorID}`, (err, fields)=>{
                
            if(err) {
                res.status(404).json({message: err});
            }
            else{
                let categories = [];
                let isErr = false;
                //console.log(arrOfData[i].categoryID);
                for(let j = 0; j < arrOfData[i].categoryID.arr.length; j++){
                    mysql.query(`SELECT tittle FROM categories WHERE categoryID=${arrOfData[i].categoryID.arr[j]}`, (err, fieldsCategories)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsCategories[0]) {
                            res.status(404).json({message :"No such category with this ID"});                         
                        }
                        else{
                            categories.push({tittle: fieldsCategories[0].tittle});
                            if(j === arrOfData[i].categoryID.arr.length - 1){
                                let currentObj = {
                                    author: fields[0].login,
                                    tittle: arrOfData[i].tittle,
                                    content: arrOfData[i].content,
                                    date: arrOfData[i].publishDate,
                                    status: arrOfData[i].status,
                                    rating: arrOfData[i].rating,
                                    categories: categories
                                }
                                finalRes.push(currentObj);
                                if(i === arrOfData.length - 1){
                                    //ТУТ ТРЕБА ФІЛЬТР
                                    res.status(200).json(this.filterResArr(arrOfFilters, finalRes));  
                                }
                                //res.status(200).json({post: fieldsPosts[0].tittle,categoriesToPost: categories});                           
                            }
                        }
                    })
                }
            }
        })
    }
    findAllPosts(res, sort,  arrOfFilters ,userID = -1){
        sort = (sort === 'date' ? 'publishDate' : 'rating');
        if(userID === -1){
            mysql.query(`SELECT * FROM posts WHERE status='active' AND locking='unlocked' ORDER BY ${sort} DESC`, (err, fields) => {
                if(err) {
                    res.status(404).json({message: err});
                }
                else if(!fields[0]) {
                    res.status(404).json({message :"No posts in DB!"});
                }
                else{
                    this.printAllPosts(res, fields, arrOfFilters);
                }
            })
        }
        else{
            mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
                if(err) {
                    res.status(404).json({message: err});
                }
                else if(!result[0]) {
                    res.status(404).json({message :"No such user"});
                }
                else{
                    if(result[0].role === 'admin') {
                        mysql.query(`SELECT * FROM posts  ORDER BY ${sort} DESC`, (err, fields)=>{
                            if(err) {
                                res.status(404).json({message: err});
                            }
                            else if(!fields[0]) {
                                res.status(404).json({message :"No posts in DB!"});
                            }
                            else{
                                this.printAllPosts(res, fields, arrOfFilters);
                            }
                        })
                    }
                    else {
                        mysql.query(`SELECT * FROM posts WHERE (status='active' OR (status='inactive' AND authorID='${userID}')) AND locking='unlocked' ORDER BY ${sort} DESC`, (err, fields) => {
                            if(err) {
                                res.status(404).json({message: err});
                            }
                            else if(!fields[0]) {
                                res.status(404).json({message :"No posts in DB!"});
                            }
                            else{
                                this.printAllPosts(res, fields, arrOfFilters);
                            }
                        })
                    }
                }
            })
        }
    }
    findOneByID(res, wantedID, userID = -1){
        if(userID === -1){
            mysql.query(`SELECT * FROM posts WHERE status='active' AND postID=${wantedID} AND locking='unlocked'`, (err, fields) => {
                if(err) {
                    res.status(404).json({message: err});
                }
                else if(!fields[0]) {
                    res.status(404).json({message :"No posts in DB with this ID!"});
                }
                else{
                    this.printOnePost(res, fields, 0, [], []);
                }
            })
        }
        else{
            mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
                if(err) {
                    res.status(404).json({message: err});
                }
                else if(!result[0]) {
                    res.status(404).json({message :"No such user"});
                }
                else{
                    if(result[0].role === 'admin') {
                        mysql.query(`SELECT * FROM posts WHERE postID=${wantedID}`, (err, fields) => {
                            if(err) {
                                res.status(404).json({message: err});
                            }
                            else if(!fields[0]) {
                                res.status(404).json({message :"No posts in DB with this ID!"});
                            }
                            else{
                                this.printOnePost(res, fields, 0, [], []);
                            }
                        })
                    }
                    else {
                       
                        mysql.query(`SELECT * FROM posts WHERE  (status='active' OR (status='inactive' AND authorID='${userID}')) AND postID=${wantedID} AND locking='unlocked'`, (err, fields) => {
                            if(err) {
                                res.status(404).json({message: err});
                            }
                            else if(!fields[0]) {
                                res.status(404).json({message :"No posts in DB with this ID!"});
                            }
                            else{

                                this.printOnePost(res, fields, 0, [], []);
                            }
                        })
                    }
                }
            })
        }
    }
    findCommentByPostID(res, wantedID, sort, userID = -1){
        sort = (sort === 'date' ? 'publishDate' : 'rating');
        if(userID === -1){
            mysql.query(`SELECT * FROM posts WHERE status='active' AND postID=${wantedID} AND locking='unlocked'`, (err, fieldsPosts) => {
                if(err) {
                    res.status(404).json({message: err});
                }
                else if(!fieldsPosts[0]) {
                    res.status(404).json({message :"No posts in DB with this ID!"});
                }
                else{
                    mysql.query(`SELECT * FROM comment WHERE postID=${wantedID} AND locking='unlocked' ORDER BY ${sort} DESC`, (err, fieldsComments)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsComments[0]) {
                            res.status(404).json({message :"No comment to this Post"});
                        }
                        else{
                            let finalRes = [];
                            for(let i = 0; i < fieldsComments.length; i++){
                                mysql.query(`SELECT login FROM users WHERE userID=${fieldsComments[i].authorID}`, (err, fieldsUsers)=>{
                                    if(err) {
                                        res.status(404).json({message: err});
                                    }
                                    else{
                                        finalRes[i] = {
                                            author: fieldsUsers[0].login,
                                            post: fieldsPosts[0].tittle,
                                            comment: fieldsComments[i].content,
                                            commentDate:fieldsComments[i].publishDate,
                                            rating: fieldsComments[i].rating
                                        }
                                        if(i === fieldsComments.length - 1){
                                            res.status(200).json(finalRes);
                                        }
                                    }
                                })
                            }
                            //res.status(200).json(fieldsComments);
                        }
                    })
                    //this.printOnePost(res, fields, 0, []);
                }
            })
        }
        else{
            mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
                if(err) {
                    res.status(404).json({message: err});
                }
                else if(!result[0]) {
                    res.status(404).json({message :"No such user"});
                }
                else{
                    if(result[0].role === 'admin') {
                        mysql.query(`SELECT * FROM posts WHERE postID=${wantedID}`, (err, fieldsPosts) => {
                            if(err) {
                                res.status(404).json({message: err});
                            }
                            else if(!fieldsPosts[0]) {
                                res.status(404).json({message :"No posts in DB with this ID!"});
                            }
                            else{
                                mysql.query(`SELECT * FROM comment WHERE postID=${wantedID} ORDER BY ${sort} DESC`, (err, fieldsComments)=>{

                                    if(err) {
                                        res.status(404).json({message: err});
                                    }
                                    else if(!fieldsComments[0]) {
                                        res.status(404).json({message :"No comment to this Post"});
                                    }
                                    else{
                                        let finalRes = [];
                                        for(let i = 0; i < fieldsComments.length; i++){
                                            mysql.query(`SELECT login FROM users WHERE userID=${fieldsComments[i].authorID}`, (err, fieldsUsers)=>{
                                                if(err) {
                                                    res.status(404).json({message: err});
                                                }
                                                else{
                                                    finalRes[i] = {
                                                        author: fieldsUsers[0].login,
                                                        post: fieldsPosts[0].tittle,
                                                        comment: fieldsComments[i].content,
                                                        commentDate:fieldsComments[i].publishDate,
                                                        rating: fieldsComments[i].rating
                                                    }
                                                    if(i === fieldsComments.length - 1){
                                                        res.status(200).json(finalRes);
                                                    }
                                                }
                                            })
                                        }
                                        //res.status(200).json(fieldsComments);
                                    }
                                })
                            }
                        })
                    }
                    else {
                       
                        mysql.query(`SELECT * FROM posts WHERE (status='active' OR (status='inactive' AND authorID='${userID}')) AND postID=${wantedID} AND locking='unlocked'`, (err, fieldsPosts) => {
                            if(err) {
                                res.status(404).json({message: err});
                            }
                            else if(!fieldsPosts[0]) {
                                res.status(404).json({message :"No posts in DB with this ID!"});
                            }
                            else{

                                mysql.query(`SELECT * FROM comment WHERE postID=${wantedID} AND locking='unlocked' ORDER BY ${sort} DESC`, (err, fieldsComments)=>{
                                    if(err) {
                                        res.status(404).json({message: err});
                                    }
                                    else if(!fieldsComments[0]) {
                                        res.status(404).json({message :"No comment to this Post"});
                                    }
                                    else{
                                        let finalRes = [];
                                        for(let i = 0; i < fieldsComments.length; i++){
                                            mysql.query(`SELECT login FROM users WHERE userID=${fieldsComments[i].authorID}`, (err, fieldsUsers)=>{
                                                if(err) {
                                                    res.status(404).json({message: err});
                                                }
                                                else{
                                                    finalRes[i] = {
                                                        author: fieldsUsers[0].login,
                                                        post: fieldsPosts[0].tittle,
                                                        comment: fieldsComments[i].content,
                                                        commentDate:fieldsComments[i].publishDate,
                                                        rating: fieldsComments[i].rating
                                                    }
                                                    if(i === fieldsComments.length - 1){
                                                        res.status(200).json(finalRes);
                                                    }
                                                }
                                            })
                                        }
                                        //res.status(200).json(fieldsComments);
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    }
    CreateCommentToPostID(res, wantedID, userID, content){
        mysql.query(`SELECT * FROM posts WHERE postID=${wantedID} AND locking='unlocked' AND status='active'`, (err, fieldsPosts)=>{
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!fieldsPosts[0]) {
                res.status(404).json({message :"No such active posts with this 'post_id'"});
            }
            else{
                mysql.query(`INSERT INTO comment(authorID, postID, content) 
                VALUES('${userID}','${wantedID}', '${content}')`, (err, fields)=>{
                    if(err){
                        res.status(400).json({error: err});
                    }
                    else{
                        res.status(200).json("Comment succesfully added!");
                    }
                })
            }
        })
        
        
    }
    findCategoriesToPost(res, wantedID, userID){
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user"});
            }
            else{
                if(result[0].role === 'admin') {
                    mysql.query(`SELECT categoryID, tittle FROM posts WHERE postID=${wantedID}`, (err, fieldsPosts)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsPosts[0]) {
                            res.status(404).json({message :"No such posts with this 'post_id'"});
                        }
                        else{
                            //
                            let categories = [];
                            for(let j = 0; j < fieldsPosts[0].categoryID.arr.length; j++){
                                mysql.query(`SELECT tittle, description FROM categories WHERE categoryID=${fieldsPosts[0].categoryID.arr[j]}`, (err, fieldsCategories)=>{
                                    if(err) {
                                        res.status(404).json({message: err});
                                    }
                                    else if(!fieldsCategories[0]) {
                                        res.status(404).json({message :"No such category with this ID"});
                                        
                                    }
                                    else{
                                        let tempObj = {
                                            tittle: fieldsCategories[0].tittle,
                                            description:fieldsCategories[0].description
                                        }
                                        categories.push(tempObj);
                                        if(j === fieldsPosts[0].categoryID.arr.length - 1){
                                            res.status(200).json({post: fieldsPosts[0].tittle,categoriesToPost: categories});                           
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
                else{
                    mysql.query(`SELECT categoryID, tittle FROM posts WHERE (status='active' OR (status='inactive' AND authorID='${userID}')) AND postID=${wantedID} AND locking='unlocked'`, (err, fieldsPosts)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsPosts[0]) {
                            res.status(404).json({message :"No such active posts with this 'post_id'"});
                        }
                        else{
                            let categories = [];
                            for(let j = 0; j < fieldsPosts[0].categoryID.arr.length; j++){
                                mysql.query(`SELECT tittle, description FROM categories WHERE categoryID=${fieldsPosts[0].categoryID.arr[j]}`, (err, fieldsCategories)=>{
                                    if(err) {
                                        res.status(404).json({message: err});
                                    }
                                    else if(!fieldsCategories[0]) {
                                        res.status(404).json({message :"No such category with this ID"});
                                        
                                    }
                                    else{
                                        let tempObj = {
                                            tittle: fieldsCategories[0].tittle,
                                            description:fieldsCategories[0].description
                                        }
                                        categories.push(tempObj);
                                        if(j === fieldsPosts[0].categoryID.arr.length - 1){
                                            res.status(200).json({post: fieldsPosts[0].tittle,categoriesToPost: categories});                           
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    }
    getLikesOnPost(res, wantedID, userID=-1){
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else{
                if(result[0] && result[0].role === 'admin') {
                    mysql.query(`SELECT * FROM posts WHERE postID=${wantedID}`, (err, fieldsPosts)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsPosts[0]) {
                            res.status(404).json({message :"No such posts with this 'post_id'"});
                        }
                        else{
                            mysql.query(`SELECT * FROM likes WHERE postID=${wantedID}`, (err, fieldsLikes)=>{ 
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else if(!fieldsLikes[0]) {
                                    res.status(404).json({message :"0 likes on this post"});
                                }
                                else{
                                    let finalRes = [];
                                    for(let i = 0; i < fieldsLikes.length; i++){
                                        //console.log(mysql.query(`SELECT login FROM users WHERE userID=${fieldsLikes[i].authorID}`));
                                        mysql.query(`SELECT login FROM users WHERE userID=${fieldsLikes[i].authorID}`, (err, fieldsUser)=>{
                                            if(err) {
                                                res.status(404).json({message: err});
                                            }
                                            else if(!fieldsLikes[0]) {
                                                res.status(404).json({message :"No such user"});
                                            }
                                            else{
                                                finalRes[i] = {
                                                    whoLiked: fieldsUser[0].login,
                                                    post: fieldsPosts[0].tittle,
                                                    date: fieldsLikes[i].publishDate,
                                                    type: fieldsLikes[i].type
                                                }
                                                if( i === fieldsLikes.length - 1){
                                                    res.status(200).json(finalRes);
                                                }
                                            }
                                        });

                                    }
                                    
                                }
                            })
                            
                        }
                    })
                }
                else{
                    mysql.query(`SELECT * FROM posts WHERE (status='active' OR (status='inactive' AND authorID='${userID}')) AND postID=${wantedID} AND locking='unlocked'`, (err, fieldsPosts)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsPosts[0]) {
                            res.status(404).json({message :"No such active posts with this 'post_id'"});
                        }
                        else{
                            mysql.query(`SELECT * FROM likes WHERE postID=${wantedID}`, (err, fieldsLikes)=>{ 
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else if(!fieldsLikes[0]) {
                                    res.status(404).json({message :"0 likes on this post"});
                                }
                                else{
                                    let finalRes = [];
                                    for(let i = 0; i < fieldsLikes.length; i++){
                                        //console.log(mysql.query(`SELECT login FROM users WHERE userID=${fieldsLikes[i].authorID}`));
                                        mysql.query(`SELECT login FROM users WHERE userID=${fieldsLikes[i].authorID}`, (err, fieldsUser)=>{
                                            if(err) {
                                                res.status(404).json({message: err});
                                            }
                                            else if(!fieldsLikes[0]) {
                                                res.status(404).json({message :"No such user"});
                                            }
                                            else{
                                                finalRes[i] = {
                                                    whoLiked: fieldsUser[0].login,
                                                    post: fieldsPosts[0].tittle,
                                                    date: fieldsLikes[i].publishDate,
                                                    type: fieldsLikes[i].type
                                                }
                                                if( i === fieldsLikes.length - 1){
                                                    res.status(200).json(finalRes);
                                                }
                                            }
                                        });

                                    }
                                    
                                }
                            })
                            
                        }
                    })
                }
            }
        })
    }
    createNewPost(res, userID, tittle, content, categories){
        let isErr = false;
        let arrOfCategories = [];
        for(let i = 0; i < categories.length; i++){
            mysql.query(`SELECT tittle, categoryID FROM categories WHERE tittle='${categories[i]}'`,(err, fields)=>{
                if(err) {
                    if(!isErr){
                        res.status(404).json({message: err});
                    }
                }
                else if(!fields[0]){
                    if(!isErr){
                        isErr = true;
                        res.status(200).json("Non such category - '" + categories[i] + "'");
                    }
                }
                else{
                    if(!isErr){
                        arrOfCategories.push(fields[0].categoryID);
                        if(i === categories.length - 1){
                            let arrToAdd = JSON.stringify({arr: arrOfCategories});
                            mysql.query(`INSERT INTO posts(authorID, categoryID, tittle, content) 
                            VALUES(${userID}, '${arrToAdd}', '${tittle}', '${content}')`,(err, fieldsAding)=>{
                                if(err){
                                    res.status(404).json({message: err});
                                }
                                else{
                                    res.status(200).json("Post succesfully created");
                                }
                            })
                            
                        }
                    }
                }
            })
        }  
    }
    createNewLikeUnderPost(res, userID, wantedID, type){
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user"});
            }
            else{
                if(result[0].role === 'admin') {
                    mysql.query(`SELECT * FROM posts WHERE postID=${wantedID}`, (err, fieldsPosts)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsPosts[0]) {
                            res.status(404).json({message :"No such posts with this 'post_id'"});
                        }
                        else{
                            mysql.query(`SELECT * FROM likes WHERE postID=${wantedID} AND authorID=${userID}`, (err, fieldsLikes)=>{
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else if(fieldsLikes.length !== 0){ 
                                    res.status(401).json({message :"This post has already been liked"});
                                }
                                else {
                                    mysql.query(`INSERT INTO likes(authorID, postID, type) VALUES(${userID}, ${wantedID}, '${type}')`, (err, fieldsLikesAdding)=>{ 
                                        if(err) {
                                            res.status(404).json({message: err});
                                        }
                                        else{
                                            mysql.query(`SELECT * FROM users WHERE userID=${fieldsPosts[0].authorID}`,(err, fieldsUsers)=>{
                                                if(err) {
                                                    res.status(404).json({message: err});
                                                }
                                                else{
                                                    if(type === 'like'){
                                                        mysql.query(`UPDATE users SET rating='${+fieldsUsers[0].rating + 1}' WHERE userID=${fieldsPosts[0].authorID}`,(err, fieldsRating)=>{
                                                            if(err) {
                                                                res.status(404).json({message: err});
                                                            }
                                                            else{
                                                                mysql.query(`UPDATE posts SET rating='${+fieldsPosts[0].rating + 1}' WHERE postID=${fieldsPosts[0].postID}`,(err, fieldsRating)=>{
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
                                                        mysql.query(`UPDATE users SET rating='${+fieldsUsers[0].rating - 1}' WHERE userID=${fieldsPosts[0].authorID}`,(err, fieldsRating)=>{
                                                            if(err) {
                                                                res.status(404).json({message: err});
                                                            }
                                                            else{
                                                                mysql.query(`UPDATE posts SET rating='${+fieldsPosts[0].rating - 1}' WHERE postID=${fieldsPosts[0].postID}`,(err, fieldsRating)=>{
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
                else{
                    mysql.query(`SELECT * FROM posts WHERE (status='active' OR (status='inactive' AND authorID='${userID}')) AND postID=${wantedID} AND locking='unlocked'`, (err, fieldsPosts)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsPosts[0]) {
                            res.status(404).json({message :"No such active posts with this 'post_id'"});
                        }
                        else{
                            mysql.query(`SELECT * FROM likes WHERE postID=${wantedID} AND authorID=${userID}`, (err, fieldsLikes)=>{
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else if(fieldsLikes.length !== 0){ 
                                    res.status(401).json({message :"This post has already been liked"});
                                }
                                else {
                                    mysql.query(`INSERT INTO likes(authorID, postID, type) VALUES(${userID}, ${wantedID}, '${type}')`, (err, fieldsLikesAdding)=>{ 
                                        if(err) {
                                            res.status(404).json({message: err});
                                        }
                                        else{
                                            mysql.query(`SELECT * FROM users WHERE userID=${fieldsPosts[0].authorID}`,(err, fieldsUsers)=>{
                                                if(err) {
                                                    res.status(404).json({message: err});
                                                }
                                                else{
                                                    if(type === 'like'){
                                                        mysql.query(`UPDATE users SET rating='${+fieldsUsers[0].rating + 1}' WHERE userID=${fieldsPosts[0].authorID}`,(err, fieldsRating)=>{
                                                            if(err) {
                                                                res.status(404).json({message: err});
                                                            }
                                                            else{
                                                                mysql.query(`UPDATE posts SET rating='${+fieldsPosts[0].rating + 1}' WHERE postID=${fieldsPosts[0].postID}`,(err, fieldsRating)=>{
                                                                    if(err) {
                                                                        res.status(404).json({message: err});
                                                                    }
                                                                    else{
                                                                        res.status(200).json({message :"Info successfully added!"});     
                                                                    }   
                                                                })   
                                                            }   
                                                        })   
                                                    }
                                                    else{
                                                        mysql.query(`UPDATE users SET rating='${+fieldsUsers[0].rating - 1}' WHERE userID=${fieldsPosts[0].authorID}`,(err, fieldsRating)=>{
                                                            if(err) {
                                                                res.status(404).json({message: err});
                                                            }
                                                            else{
                                                                mysql.query(`UPDATE posts SET rating='${+fieldsPosts[0].rating - 1}' WHERE postID=${fieldsPosts[0].postID}`,(err, fieldsRating)=>{
                                                                    if(err) {
                                                                        res.status(404).json({message: err});
                                                                    }
                                                                    else{
                                                                        res.status(200).json({message :"Info successfully added!"});     
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
        })
    }
    updatePost(res, userID, wantedID, tittle, content, categories){    
        mysql.query(`SELECT * FROM posts WHERE authorID=${userID} AND postID=${wantedID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"You don`t create posts with this ID!"});
            }
            else{
                let isErr = false;
                let arrOfCategories = [];
                if(categories){
                    for(let i = 0; i < categories.length; i++){
                        mysql.query(`SELECT tittle, categoryID FROM categories WHERE tittle='${categories[i]}'`,(err, fields)=>{
                            if(err) {
                                if(!isErr){
                                    res.status(404).json({message: err});
                                }
                            }
                            else if(!fields[0]){
                                if(!isErr){
                                    isErr = true;
                                    res.status(200).json("No such category - '" + categories[i] + "'");
                                }
                            }
                            else{
                                if(!isErr){
                                    arrOfCategories.push(fields[0].categoryID);
                                    if(i === categories.length - 1){
                                        let arrToAdd = JSON.stringify({arr: arrOfCategories});
                                        mysql.query(`UPDATE posts SET 
                                            tittle='${tittle|| result[0].tittle}', 
                                            categoryID='${arrToAdd}', 
                                            content='${content||result[0].content}' 
                                            WHERE postID=${wantedID}`,(err, fieldsAding)=>{
                                            if(err){
                                                res.status(404).json({message: err});
                                            }
                                            else{
                                                res.status(200).json("Post succesfully created");
                                            }
                                        })
                                        
                                    }
                                }
                            }
                        })
                    }  
                }
                else{
                    mysql.query(`UPDATE posts SET 
                        tittle='${tittle|| result[0].tittle}', 
                        categoryID='${JSON.stringify(result[0].categoryID)}', 
                        content='${content||result[0].content}' 
                        WHERE postID=${wantedID}`,(err, fieldsAding)=>{
                        if(err){
                            res.status(404).json({message: err});
                        }
                        else{
                            res.status(200).json("Post succesfully updated");
                        }
                    })
                }
            }
        })
    }
    deleteOnePost(res, wantedID, userID){
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user"});
            }
            else{
                if(result[0].role === 'admin') {
                    mysql.query(`DELETE FROM posts WHERE postID='${wantedID}'`, (err, result)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(result.affectedRows === 0) {
                            res.status(404).json({message :"No such post with this ID!"});
                        }
                        else{
                            res.status(200).json({message: "Post with this ID was succesfully deleted!"});
                        } 
                    })
                }
                else{
                    mysql.query(`DELETE FROM posts WHERE postID=${wantedID} AND authorID=${userID}`, (err, result)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(result.affectedRows === 0) {
                            res.status(404).json({message :"No such your post with this ID!"});
                        }
                        else{
                            res.status(200).json({message: "Post with this ID was succesfully deleted!"});
                        } 
                    })
                }
            }
        })
    }
    deleteOneLikeOnPost(res, wantedID, userID){
        mysql.query(`SELECT * FROM likes WHERE postID=${wantedID} AND authorID=${userID}`, (err, fieldsLikes)=>{
            if(err) {
                res.status(404).json({message: err});
            }
            else{
                mysql.query(`DELETE FROM likes WHERE postID=${wantedID} AND authorID=${userID}`, (err, result)=>{
                    if(err) {
                        res.status(404).json({message: err});
                    }
                    else if(result.affectedRows === 0) {
                        res.status(404).json({message :"No such your like on post with this ID!"});
                    }
                    else{
                        mysql.query(`SELECT * FROM posts WHERE postID=${wantedID}`, (err, fieldsPosts)=>{
                            if(err) {
                                res.status(404).json({message: err});
                            }
                            else{
                                mysql.query(`SELECT * FROM users WHERE userID=${fieldsPosts[0].authorID}`,(err, fieldsUsers)=>{
                                    if(err) {
                                        res.status(404).json({message: err});
                                    }
                                    else{
                                        if(fieldsLikes[0].type === 'like'){
                                            mysql.query(`UPDATE users SET rating='${+fieldsUsers[0].rating - 1}' WHERE userID=${fieldsPosts[0].authorID}`,(err, fieldsRating)=>{
                                                if(err) {
                                                    res.status(404).json({message: err});
                                                }
                                                else{
                                                    mysql.query(`UPDATE posts SET rating='${+fieldsPosts[0].rating - 1}' WHERE postID=${fieldsPosts[0].postID}`,(err, fieldsRating2)=>{
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
                                            mysql.query(`UPDATE users SET rating='${+fieldsUsers[0].rating + 1}' WHERE userID=${fieldsPosts[0].authorID}`,(err, fieldsRating)=>{
                                                if(err) {
                                                    res.status(404).json({message: err});
                                                }
                                                else{
                                                    mysql.query(`UPDATE posts SET rating='${+fieldsPosts[0].rating + 1}' WHERE postID=${fieldsPosts[0].postID}`,(err, fieldsRating)=>{
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
    updatePostStatus(res, wantedID, userID){
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user"});
            }
            else{
                if(result[0].role === 'admin') {
                    mysql.query(`SELECT status FROM posts WHERE postID='${wantedID}'`, (err, result)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!result[0]) {
                            res.status(404).json({message :"No such post with this ID!"});
                        }
                        else{
                            if(result[0].status ==='active'){
                                mysql.query(`UPDATE posts SET status='inactive' WHERE postID=${wantedID}`, (err, fieldsUpdating)=>{
                                    if(err) {
                                        res.status(404).json({message: err});
                                    }
                                    else {
                                        res.status(200).json({message :"Status successfully updated!"});
                                    }
                                })
                            }
                            else if(result[0].status ==='inactive'){
                                mysql.query(`UPDATE posts SET status='active' WHERE postID=${wantedID}`, (err, fieldsUpdating)=>{
                                    if(err) {
                                        res.status(404).json({message: err});
                                    }
                                    else {
                                        res.status(200).json({message :"Status successfully updated!"});
                                    }
                                })
                            }
                        } 
                    })
                }
                else{
                    mysql.query(`SELECT status FROM posts WHERE postID=${wantedID} AND authorID=${userID}`, (err, result)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!result[0]) {
                            res.status(404).json({message :"No such your post with this ID!"});
                        }
                        else{
                            if(result[0].status ==='active'){
                                mysql.query(`UPDATE posts SET status='inactive' WHERE postID=${wantedID}`, (err, fieldsUpdating)=>{
                                    if(err) {
                                        res.status(404).json({message: err});
                                    }
                                    else {
                                        res.status(200).json({message :"Status successfully updated!"});
                                    }
                                })
                            }
                            else if(result[0].status ==='inactive'){
                                mysql.query(`UPDATE posts SET status='active' WHERE postID=${wantedID}`, (err, fieldsUpdating)=>{
                                    if(err) {
                                        res.status(404).json({message: err});
                                    }
                                    else {
                                        res.status(200).json({message :"Status successfully updated!"});
                                    }
                                })
                            }
                        } 
                    })
                }
            }
        })
    }


    updatePostLocking(res, wantedID, userID){
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user"});
            }
            else{
                if(result[0].role === 'admin') {
                    mysql.query(`SELECT locking FROM posts WHERE postID='${wantedID}'`, (err, result)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!result[0]) {
                            res.status(404).json({message :"No such post with this ID!"});
                        }
                        else{
                            if(result[0].locking ==='locked'){
                                mysql.query(`UPDATE posts SET locking='unlocked' WHERE postID=${wantedID}`, (err, fieldsUpdating)=>{
                                    if(err) {
                                        res.status(404).json({message: err});
                                    }
                                    else {
                                        res.status(200).json({message :"This post was unlocked"});
                                    }
                                })
                            }
                            else if(result[0].locking ==='unlocked'){
                                mysql.query(`UPDATE posts SET locking='locked' WHERE postID=${wantedID}`, (err, fieldsUpdating)=>{
                                    if(err) {
                                        res.status(404).json({message: err});
                                    }
                                    else {
                                        res.status(200).json({message :"This post was locked"});
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


    getFavouritesByPostID(res, wantedID, userID) {
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else{
                if(result[0] && result[0].role === 'admin') {
                    mysql.query(`SELECT * FROM posts WHERE postID=${wantedID}`, (err, fieldsPosts)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsPosts[0]) {
                            res.status(404).json({message :"No such posts with this 'post_id'"});
                        }
                        else{
                            
                            mysql.query(`SELECT * FROM favourites WHERE postID=${wantedID}`, (err, fieldsFavourites)=>{ 
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else if(!fieldsFavourites[0]) {
                                    res.status(404).json({message :"0 favourites on this post"});
                                }
                                else{
                                    let finalRes = [];
                                    for(let i = 0; i < fieldsFavourites.length; i++){
                                        //console.log(mysql.query(`SELECT login FROM users WHERE userID=${fieldsLikes[i].authorID}`));
                                        mysql.query(`SELECT login FROM users WHERE userID=${fieldsFavourites[i].authorID}`, (err, fieldsUser)=>{
                                            if(err) {
                                                res.status(404).json({message: err});
                                            }
                                            else if(!fieldsFavourites[0]) {
                                                res.status(404).json({message :"No such user"});
                                            }
                                            else{
                                                finalRes[i] = {
                                                    authorLogin: fieldsUser[0].login,
                                                    post: fieldsPosts[0].tittle,
                                                }
                                                if( i === fieldsFavourites.length - 1){
                                                    res.status(200).json(finalRes);
                                                }
                                            }
                                        });

                                    }
                                    
                                }
                            })
                            
                        }
                    })
                }
                else{
                    mysql.query(`SELECT * FROM posts WHERE (status='active' OR (status='inactive' AND authorID='${userID}')) AND postID=${wantedID} AND locking='unlocked'`, (err, fieldsPosts)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsPosts[0]) {
                            res.status(404).json({message :"No such active posts with this 'post_id'"});
                        }
                        else{
                            mysql.query(`SELECT * FROM favourites WHERE postID=${wantedID}`, (err, fieldsFavourites)=>{ 
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else if(!fieldsFavourites[0]) {
                                    res.status(404).json({message :"0 favourites on this post"});
                                }
                                else{
                                    let finalRes = [];
                                    for(let i = 0; i < fieldsFavourites.length; i++){
                                        mysql.query(`SELECT login FROM users WHERE userID=${fieldsFavourites[i].authorID}`, (err, fieldsUser)=>{
                                            if(err) {
                                                res.status(404).json({message: err});
                                            }
                                            else if(!fieldsFavourites[0]) {
                                                res.status(404).json({message :"No such user"});
                                            }
                                            else{
                                                finalRes[i] = {
                                                    authorLogin: fieldsUser[0].login,
                                                    post: fieldsPosts[0].tittle,
                                                }
                                                if( i === fieldsFavourites.length - 1){
                                                    res.status(200).json(finalRes);
                                                }
                                            }
                                        });

                                    }
                                    
                                }
                            })
                            
                        }
                    })
                }
            }
        })
    }

    createFavouriteOnPost(res, wantedID, userID){
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user"});
            }
            else{
                if(result[0].role === 'admin') {
                    mysql.query(`SELECT * FROM posts WHERE postID=${wantedID}`, (err, fieldsPosts)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsPosts[0]) {
                            res.status(404).json({message :"No such posts with this 'post_id'"});
                        }
                        else{
                            mysql.query(`SELECT * FROM favourites WHERE postID=${wantedID} AND authorID=${userID}`, (err, fieldsFavourites)=>{
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else if(fieldsFavourites.length !== 0){ 
                                    res.status(401).json({message :"This post has already been added to your favourites"});
                                }
                                else {
                                    mysql.query(`INSERT INTO favourites(authorID, postID) VALUES(${userID}, ${wantedID})`, (err, fieldsFavouritesAdding)=>{ 
                                        if(err) {
                                            res.status(404).json({message: err});
                                        }
                                        else {
                                            res.status(200).json({message :"Post successfully added to favourite!"});
                                        }
                                    })
                                }
                            })
                                          
                        }
                    })
                }
                else{
                    mysql.query(`SELECT * FROM posts WHERE (status='active' OR (status='inactive' AND authorID='${userID}')) AND postID=${wantedID} AND locking='unlocked'`, (err, fieldsPosts)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsPosts[0]) {
                            res.status(404).json({message :"No such active posts with this 'post_id'"});
                        }
                        else{
                            mysql.query(`SELECT * FROM favourites WHERE postID=${wantedID} AND authorID=${userID}`, (err, fieldsFavourites)=>{
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else if(fieldsFavourites.length !== 0){ 
                                    res.status(401).json({message :"This post has already been added to your favourites"});
                                }
                                else {
                                    mysql.query(`INSERT INTO favourites(authorID, postID) VALUES(${userID}, ${wantedID})`, (err, fieldsFavouritesAdding)=>{ 
                                        if(err) {
                                            res.status(404).json({message: err});
                                        }
                                        else {
                                            res.status(200).json({message :"Post successfully added to favourite!"});
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


    deleteFavouriteOnPost(res, wantedID, userID){
        mysql.query(`SELECT * FROM favourites WHERE postID=${wantedID} AND authorID=${userID}`, (err, fieldsSubscribes)=>{
            if(err) {
                res.status(404).json({message: err});
            }
            else{
                mysql.query(`DELETE FROM favourites WHERE postID=${wantedID} AND authorID=${userID}`, (err, result)=>{
                    if(err) {
                        res.status(404).json({message: err});
                    }
                    else if(result.affectedRows === 0) {
                        res.status(404).json({message :"No such your favourite on post with this ID!"});
                    }
                    else{
                        res.status(200).json({message :"This post was succesfully deleted from favourite"});
                    } 
                })
            }
        })
    }


    getSubscribesByPostID(res, wantedID, userID) {
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else{
                if(result[0] && result[0].role === 'admin') {
                    mysql.query(`SELECT * FROM posts WHERE postID=${wantedID}`, (err, fieldsPosts)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsPosts[0]) {
                            res.status(404).json({message :"No such posts with this 'post_id'"});
                        }
                        else{
                            mysql.query(`SELECT * FROM subscribes WHERE postID=${wantedID}`, (err, fieldsSubscribes)=>{ 
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else if(!fieldsSubscribes[0]) {
                                    res.status(404).json({message :"0 subcribes to this post"});
                                }
                                else{
                                    let finalRes = [];
                                    for(let i = 0; i < fieldsSubscribes.length; i++){
                                        //console.log(mysql.query(`SELECT login FROM users WHERE userID=${fieldsLikes[i].authorID}`));
                                        mysql.query(`SELECT login FROM users WHERE userID=${fieldsSubscribes[i].authorID}`, (err, fieldsUser)=>{
                                            if(err) {
                                                res.status(404).json({message: err});
                                            }
                                            else if(!fieldsSubscribes[0]) {
                                                res.status(404).json({message :"No such user"});
                                            }
                                            else{
                                                finalRes[i] = {
                                                    authorLogin: fieldsUser[0].login,
                                                    post: fieldsPosts[0].tittle,
                                                }
                                                if( i === fieldsSubscribes.length - 1){
                                                    res.status(200).json(finalRes);
                                                }
                                            }
                                        });

                                    }
                                    
                                }
                            })
                            
                        }
                    })
                }
                else{
                    mysql.query(`SELECT * FROM posts WHERE (status='active' OR (status='inactive' AND authorID='${userID}')) AND postID=${wantedID} AND locking='unlocked'`, (err, fieldsPosts)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsPosts[0]) {
                            console.log(fieldsPosts)
                            res.status(404).json({message :"No such active posts with this 'post_id'"});
                        }
                        else{
                            mysql.query(`SELECT * FROM subscribes WHERE postID=${wantedID}`, (err, fieldsSubscribes)=>{ 
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else if(!fieldsSubscribes[0]) {
                                    res.status(404).json({message :"0 subcribes to this post"});
                                }
                                else{
                                    let finalRes = [];
                                    for(let i = 0; i < fieldsSubscribes.length; i++){
                                        //console.log(mysql.query(`SELECT login FROM users WHERE userID=${fieldsLikes[i].authorID}`));
                                        mysql.query(`SELECT login FROM users WHERE userID=${fieldsSubscribes[i].authorID}`, (err, fieldsUser)=>{
                                            if(err) {
                                                res.status(404).json({message: err});
                                            }
                                            else if(!fieldsSubscribes[0]) {
                                                res.status(404).json({message :"No such user"});
                                            }
                                            else{
                                                finalRes[i] = {
                                                    authorLogin: fieldsUser[0].login,
                                                    post: fieldsPosts[0].tittle,
                                                }
                                                if( i === fieldsSubscribes.length - 1){
                                                    res.status(200).json(finalRes);
                                                }
                                            }
                                        });

                                    }
                                    
                                }
                            })
                            
                        }
                    })
                }
            }
        })
    }

    createSubscribeOnPost(res, wantedID, userID){
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!result[0]) {
                res.status(404).json({message :"No such user"});
            }
            else{
                if(result[0].role === 'admin') {
                    mysql.query(`SELECT * FROM posts WHERE postID=${wantedID}`, (err, fieldsPosts)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsPosts[0]) {
                            res.status(404).json({message :"No such posts with this 'post_id'"});
                        }
                        else{
                            mysql.query(`SELECT * FROM subscribes WHERE postID=${wantedID} AND authorID=${userID}`, (err, fieldsSubscribes)=>{
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else if(fieldsSubscribes.length !== 0){ 
                                    res.status(401).json({message :"This post has already been added to your favourites"});
                                }
                                else {
                                    mysql.query(`INSERT INTO subscribes(authorID, postID) VALUES(${userID}, ${wantedID})`, (err, fieldsSubscribesAdding)=>{ 
                                        if(err) {
                                            res.status(404).json({message: err});
                                        }
                                        else {
                                            res.status(200).json({message :"Post successfully added to favourite!"});
                                        }
                                    })
                                }
                            })         
                        }
                    })
                }
                else{
                    mysql.query(`SELECT * FROM posts WHERE (status='active' OR (status='inactive' AND authorID='${userID}')) AND postID=${wantedID} AND locking='unlocked'`, (err, fieldsPosts)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsPosts[0]) {
                            res.status(404).json({message :"No such active posts with this 'post_id'"});
                        }
                        else{
                            mysql.query(`SELECT * FROM subscribes WHERE postID=${wantedID} AND authorID=${userID}`, (err, fieldsSubscribes)=>{
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else if(fieldsSubscribes.length !== 0){ 
                                    res.status(401).json({message :"This post has already been added to your favourites"});
                                }
                                else {
                                    mysql.query(`INSERT INTO subscribes(authorID, postID) VALUES(${userID}, ${wantedID})`, (err, fieldsSubscribesAdding)=>{ 
                                        if(err) {
                                            res.status(404).json({message: err});
                                        }
                                        else {
                                            res.status(200).json({message :"Post successfully added to favourite!"});
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


    deleteSubscribeOnPost(res, wantedID, userID){
        mysql.query(`SELECT * FROM subscribes WHERE postID=${wantedID} AND authorID=${userID}`, (err, fieldsSubscribes)=>{
            if(err) {
                res.status(404).json({message: err});
            }
            else{
                mysql.query(`DELETE FROM subscribes WHERE postID=${wantedID} AND authorID=${userID}`, (err, result)=>{
                    if(err) {
                        res.status(404).json({message: err});
                    }
                    else if(result.affectedRows === 0) {
                        res.status(404).json({message :"No such your favourite on post with this ID!"});
                    }
                    else{
                        res.status(200).json({message :"This post was succesfully deleted from favourite"});
                    } 
                })
            }
        })
    }

    
    
}

module.exports = Posts;



