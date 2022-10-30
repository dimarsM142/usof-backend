const mysql = require('../db.js');
const Model = require('../model.js');

class Posts extends Model {
    constructor(){
        super();   
    }
    filterResArr(arrOfFilters, finalRes, page){
        if(!arrOfFilters || (!arrOfFilters.category && !arrOfFilters.status && !arrOfFilters.startDate && !arrOfFilters.endDate && !arrOfFilters.author && !arrOfFilters.name)){
            if(((page - 1) * 10) > finalRes.length){
                return {message: "There are no posts on this page"};
            } 
            let resArr = [];
            for(let i = (page - 1) * 10; i < (page - 1) * 10 + 10; i++){
                if(i === finalRes.length){
                    break;
                }
                resArr.push(finalRes[i]);
            }
            return resArr;
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
                                if(finalRes[i].categories[j] === arrOfCategories[k]){
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
            if(arrOfFilters.author){
                let tempArr = [];
                for(let i = 0; i < finalRes.length; i++){
                    if(finalRes[i].author === arrOfFilters.author){
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
            if(arrOfFilters.name){
                let tempArr = [];
                for(let i = 0; i < finalRes.length; i++){
                    if(finalRes[i].content.toLowerCase().includes(arrOfFilters.name.toLowerCase()) || finalRes[i].tittle.toLowerCase().includes(arrOfFilters.name.toLowerCase())){
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
                if(((page - 1) * 10) > finalRes.length){
                    return {message: "There are no posts on this page"};
                }
                let resArr = [];
                for(let i = (page - 1) * 10; i < (page - 1) * 10 + 10; i++){
                    if(i === finalRes.length){
                        break;
                    }
                    resArr.push(finalRes[i]);
                }
                return resArr;
            }
            
        }
        

    }
    printAllPosts(res, arrOfData, arrOfFilters, page){
        mysql.query(`SELECT login, userID FROM users`, (err, fieldsUsers)=>{
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!fieldsUsers[0]) {
                res.status(404).json({message :"No users in database"});                         
            }
            else{
                mysql.query(`SELECT tittle, categoryID FROM categories`,  (err, fieldsCategories)=>{
                    if(err) {
                        res.status(404).json({message: err});
                    }
                    else if(!fieldsCategories[0]) {
                        res.status(404).json({message :"No categories in database"});                         
                    }
                    else{
                        let finalRes = [];
                        for(let i = 0; i < arrOfData.length; i++){
                            let curAuthor = '';
                            let categories = [];
                            for(let j = 0; j < fieldsUsers.length; j++){
                                if(arrOfData[i].authorID == fieldsUsers[j].userID){
                                    curAuthor = fieldsUsers[j].login;
                                    break;
                                }
                            }
                            for(let k = 0; k < arrOfData[i].categoryID.arr.length; k++){
                                for(let j = 0; j < fieldsCategories.length; j++){
                                    if(arrOfData[i].categoryID.arr[k] === fieldsCategories[j].categoryID){
                                        categories.push(fieldsCategories[j].tittle);
                                        break;
                                    }
                                }
                            }
                            let currentObj = {
                                id: arrOfData[i].postID,
                                author: curAuthor,
                                tittle: arrOfData[i].tittle,
                                content: arrOfData[i].content,
                                date: arrOfData[i].publishDate,
                                status: arrOfData[i].status,
                                rating: arrOfData[i].rating,
                                locking: arrOfData[i].locking,
                                categories: categories
                            }
                            finalRes.push(currentObj);
                        }
                        
                        res.status(200).json(this.filterResArr(arrOfFilters, finalRes, page));  
                    }
                })
            }
        })
    }
    printOnePost(res, arrOfData){
        mysql.query(`SELECT login, userID FROM users`, (err, fieldsUsers)=>{
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!fieldsUsers[0]) {
                res.status(404).json({message :"No users in database"});                         
            }
            else{
                mysql.query(`SELECT tittle, categoryID FROM categories`,  (err, fieldsCategories)=>{
                    if(err) {
                        res.status(404).json({message: err});
                    }
                    else if(!fieldsCategories[0]) {
                        res.status(404).json({message :"No categories in database"});                         
                    }
                    else{
                        let finalRes = [];
                        let curAuthor = '';
                        let categories = [];
                        for(let j = 0; j < fieldsUsers.length; j++){
                            if(arrOfData[0].authorID == fieldsUsers[j].userID){
                                curAuthor = fieldsUsers[j].login;
                                break;
                            }
                        }
                        for(let k = 0; k < arrOfData[0].categoryID.arr.length; k++){
                            for(let j = 0; j < fieldsCategories.length; j++){
                                if(arrOfData[0].categoryID.arr[k] === fieldsCategories[j].categoryID){
                                    categories.push(fieldsCategories[j].tittle);
                                    break;
                                }
                            }
                        }
                        let currentObj = {
                            id: arrOfData[0].postID,
                            author: curAuthor,
                            tittle: arrOfData[0].tittle,
                            content: arrOfData[0].content,
                            date: arrOfData[0].publishDate,
                            status: arrOfData[0].status,
                            rating: arrOfData[0].rating,
                            locking: arrOfData[0].locking,
                            categories: categories
                        }
                        finalRes.push(currentObj);   
                        res.status(200).json(finalRes);  
                    }
                })
            }
        })
    }
    findAllPosts(res, sort,  arrOfFilters, page, userID = -1){
        sort = (sort === 'date' ? 'publishDate' : 'rating');
        if(userID === -1){
            mysql.query(`SELECT * FROM posts WHERE status='active' AND locking='unlocked' ORDER BY ${sort} DESC`, (err, fields) => {
                if(err) {
                    res.status(404).json({message: err});
                }
                else if(!fields[0]) {
                    res.status(200).json({message :"No posts in DB!"});
                }
                else{
                    this.printAllPosts(res, fields, arrOfFilters, page);
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
                                res.status(200).json({message :"No posts in DB!"});
                            }
                            else{
                                this.printAllPosts(res, fields, arrOfFilters, page);
                            }
                        })
                    }
                    else {
                        mysql.query(`SELECT * FROM posts WHERE (status='active' OR (status='inactive' AND authorID='${userID}')) AND locking='unlocked' ORDER BY ${sort} DESC`, (err, fields) => {
                            if(err) {
                                res.status(404).json({message: err});
                            }
                            else if(!fields[0]) {
                                res.status(200).json({message :"No posts in DB!"});
                            }
                            else{
                                this.printAllPosts(res, fields, arrOfFilters, page);
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
                    res.status(200).json({message :"No posts in DB with this ID!"});
                }
                else{
                    this.printOnePost(res, fields);
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
                                res.status(200).json({message :"No posts in DB with this ID!"});
                            }
                            else{
                                this.printOnePost(res, fields);
                            }
                        })
                    }
                    else {
                       
                        mysql.query(`SELECT * FROM posts WHERE  (status='active' OR (status='inactive' AND authorID='${userID}')) AND postID=${wantedID} AND locking='unlocked'`, (err, fields) => {
                            if(err) {
                                res.status(404).json({message: err});
                            }
                            else if(!fields[0]) {
                                res.status(200).json({message :"No posts in DB with this ID!"});
                            }
                            else{

                                this.printOnePost(res, fields);
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
                            res.status(200).json({message :"No comment to this Post"});
                        }
                        else{
                            mysql.query(`SELECT login, userID FROM users`, (err, fieldsUsers)=>{
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else{
                                    
                                    let finalRes = [];
                                    for(let i = 0; i < fieldsComments.length; i++){
                                        let curAuthor = '';
                                        let replyComment = '';
                                        let replyAuthor = '';
                                        for(let j = 0; j < fieldsUsers.length; j++){
                                            if(fieldsComments[i].authorID == fieldsUsers[j].userID){
                                                curAuthor = fieldsUsers[j].login;
                                                break;
                                            }
                                        }
                                        
                                        if(fieldsComments[i].replyID){
                                            for(let j = 0; j < fieldsComments.length; j++){
                                                if(fieldsComments[i].replyID == fieldsComments[j].commentID){
                                                    replyComment = fieldsComments[j].content;
                                                    for(let k = 0; k < fieldsUsers.length; k++){
                                                        if(fieldsComments[j].authorID == fieldsUsers[k].userID){
                                                            replyAuthor = fieldsUsers[k].login;
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                    
                                                }
                                                
                                            }
                                        }
                                        
                                        let currentObj = {
                                            id: fieldsComments[i].commentID,
                                            comment: fieldsComments[i].content,
                                            postID: fieldsComments[i].postID,
                                            post: fieldsPosts[0].tittle,
                                            authorOfComment: curAuthor,
                                            commentDate:fieldsComments[i].publishDate,
                                            rating: fieldsComments[i].rating,
                                            replyID: fieldsComments[i].replyID,
                                            replyComment: replyComment,
                                            replyAuthor: replyAuthor
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
                                        res.status(200).json({message :"No comment to this Post"});
                                    }
                                    else{
                                        mysql.query(`SELECT login, userID FROM users`, (err, fieldsUsers)=>{
                                            if(err) {
                                                res.status(404).json({message: err});
                                            }
                                            else{
                                                let finalRes = [];
                                                for(let i = 0; i < fieldsComments.length; i++){
                                                    let curAuthor = '';
                                                    for(let j = 0; j < fieldsUsers.length; j++){
                                                        if(fieldsComments[i].authorID == fieldsUsers[j].userID){
                                                            curAuthor = fieldsUsers[j].login;
                                                            break;
                                                        }
                                                    }
                                                    let currentObj = {
                                                        id: fieldsComments[i].commentID,
                                                        comment: fieldsComments[i].content,
                                                        postID: fieldsComments[i].postID,
                                                        post: fieldsPosts[0].tittle,
                                                        authorOfComment: curAuthor,
                                                        commentDate:fieldsComments[i].publishDate,
                                                        locking: fieldsComments[i].locking,
                                                        rating: fieldsComments[i].rating,
                                                        replyID: fieldsComments[i].replyID
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
                                        res.status(200).json({message :"No comment to this Post"});
                                    }
                                    else{
                                        mysql.query(`SELECT login, userID FROM users`, (err, fieldsUsers)=>{
                                            if(err) {
                                                res.status(404).json({message: err});
                                            }
                                            else{
                                                let finalRes = [];
                                                for(let i = 0; i < fieldsComments.length; i++){
                                                    let curAuthor = '';
                                                    for(let j = 0; j < fieldsUsers.length; j++){
                                                        if(fieldsComments[i].authorID == fieldsUsers[j].userID){
                                                            curAuthor = fieldsUsers[j].login;
                                                            break;
                                                        }
                                                    }
                                                    let currentObj = {
                                                        id: fieldsComments[i].commentID,
                                                        comment: fieldsComments[i].content,
                                                        postID: fieldsComments[i].postID,
                                                        post: fieldsPosts[0].tittle,
                                                        authorOfComment: curAuthor,
                                                        commentDate:fieldsComments[i].publishDate,
                                                        rating: fieldsComments[i].rating,
                                                        replyID: fieldsComments[i].replyID
                                                    }
                                                    finalRes.push(currentObj);
                                                }
                                                res.status(200).json(finalRes);
                                            }
                                        })
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
    CreateCommentToPostID(res, wantedID, userID, content, replyID = null){
        mysql.query(`SELECT * FROM posts WHERE postID=${wantedID} AND locking='unlocked' AND status='active'`, (err, fieldsPosts)=>{
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!fieldsPosts[0]) {
                res.status(404).json({message :"No such active posts with this 'post_id'"});
            }
            else{
                if(replyID){
                    mysql.query(`SELECT * FROM comment WHERE commentID=${replyID}`, (err, fieldsComments)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsComments[0]) {
                            res.status(404).json({message :"No such active comments"});
                        }
                        else if(fieldsComments[0].postID != wantedID){
                            res.status(404).json({message :"No such comments you want to reply"});
                        }
                        else{
                            mysql.query(`INSERT INTO comment(authorID, postID, content, replyID) 
                            VALUES('${userID}','${wantedID}', '${content}', '${replyID}')`, (err, fields)=>{
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
                
            }
        })   
    }

    findCategoriesToPost(res, wantedID, userID=-1){
        mysql.query(`SELECT role FROM users WHERE userID=${userID}`, (err, result) => {
            if(err) {
                res.status(404).json({message: err});
            }
            else{
                if(result[0] && result[0].role === 'admin') {
                    mysql.query(`SELECT categoryID, tittle FROM posts WHERE postID=${wantedID}`, (err, fieldsPosts)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsPosts[0]) {
                            res.status(404).json({message :"No such posts with this 'post_id'"});
                        }
                        else {
                            mysql.query(`SELECT tittle, description, categoryID FROM categories`, (err, fieldsCategories)=>{
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else{
                                    let categories = [];
                                    for(let i = 0; i < fieldsPosts[0].categoryID.arr.length; i++){
                                        for(let j = 0; j < fieldsCategories.length; j++){
                                            if(fieldsPosts[0].categoryID.arr[i] === fieldsCategories[j].categoryID){
                                                let tempObj = {
                                                    id: fieldsCategories[j].categoryID,
                                                    tittle: fieldsCategories[j].tittle,
                                                    description:fieldsCategories[j].description
                                                }
                                                categories.push(tempObj);
                                                break;
                                            }
                                        }
                                    }
                                    res.status(200).json({post: fieldsPosts[0].tittle,categoriesToPost: categories}); 
                                }
                            })
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
                            mysql.query(`SELECT tittle, description, categoryID FROM categories`, (err, fieldsCategories)=>{
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else{
                                    let categories = [];
                                    for(let i = 0; i < fieldsPosts[0].categoryID.arr.length; i++){
                                        for(let j = 0; j < fieldsCategories.length; j++){
                                            if(fieldsPosts[0].categoryID.arr[i] === fieldsCategories[j].categoryID){
                                                let tempObj = {
                                                    id: fieldsCategories[j].categoryID,
                                                    tittle: fieldsCategories[j].tittle,
                                                    description:fieldsCategories[j].description
                                                }
                                                categories.push(tempObj);
                                                break;
                                            }
                                        }
                                    }
                                    res.status(200).json({post: fieldsPosts[0].tittle,categoriesToPost: categories}); 
                                }
                            })
                        }
                    })
                }
            }
        })
    }
    getLikesOnPost(res, wantedID, userID = -1){
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
                                    res.status(200).json({message :"0 likes on this post"});
                                }
                                else {
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
                                                    id: fieldsLikes[i].likeID,
                                                    whoLiked: curAuthor,
                                                    postID: fieldsPosts[0].postID,
                                                    post: fieldsPosts[0].tittle,
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
                                    res.status(200).json({message :"0 likes on this post"});
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
                                                    id: fieldsLikes[i].likeID,
                                                    whoLiked: curAuthor,
                                                    postID: fieldsPosts[0].postID,
                                                    post: fieldsPosts[0].tittle,
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
            }
        })
    }

    //ТИМЧАСОВА ЗУПИНКА
    createNewPost(res, userID, tittle, content, categories){
        mysql.query(`SELECT tittle, categoryID FROM categories ORDER BY categoryID`,(err, fields)=>{
            if(err) {
                res.status(404).json({message: err});
            }
            else if(!fields[0]){
                res.status(404).json("No categories in database");
            }
            else{
                let arrCategories = [];
                let isErr = true;
                for(let j = 0; j < categories.length; j++){
                    isErr = true;
                    for(let i = 0; i < fields.length; i++){
                        if(fields[i].tittle === categories[j]) {
                            arrCategories.push(fields[i].categoryID);
                            isErr = false;
                            break;
                        }
                    }
                    if(isErr){
                        break;
                    }
                }
                if(!isErr){
                    arrCategories.sort((a, b)=>{
                        if(a > b){
                            return 1;
                        } 
                        else{
                            return -1;
                        }
                    });
                    mysql.query(`INSERT INTO posts(authorID, categoryID, tittle, content) 
                    VALUES(${userID}, '${JSON.stringify({arr: arrCategories})}', '${tittle}', '${content}')`,(err, fieldsAding)=>{
                        if(err){
                            res.status(404).json({message: err});
                        }
                        else{
                            res.status(200).json("Post succesfully created");
                        }
                    })
                }
                else{
                    res.status(200).json("No such categories. Input categories in style: JavaScript, HTML, Python");
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
                if(categories){
                    mysql.query(`SELECT tittle, categoryID FROM categories ORDER BY categoryID`,(err, fields)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fields[0]){
                            res.status(404).json("No categories in database");
                        }
                        else{
                            let arrCategories = [];
                            let isErr = true;
                            for(let j = 0; j < categories.length; j++){
                                isErr = true;
                                for(let i = 0; i < fields.length; i++){
                                    if(fields[i].tittle === categories[j]) {
                                        arrCategories.push(fields[i].categoryID);
                                        isErr = false;
                                        break;
                                    }
                                }
                                if(isErr){
                                    break;
                                }
                            }
                            if(!isErr){
                                arrCategories.sort((a, b)=>{
                                    if(a > b){
                                        return 1;
                                    } 
                                    else{
                                        return -1;
                                    }
                                });
                                mysql.query(`UPDATE posts SET 
                                    tittle='${tittle || result[0].tittle}', 
                                    categoryID='${JSON.stringify({arr: arrCategories})}', 
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
                            else{
                                res.status(200).json("No such categories. Input categories in style: JavaScript, HTML, Python");
                            }
                        }
                    })
                }
                else{
                    mysql.query(`UPDATE posts SET 
                    tittle='${tittle || result[0].tittle}', 
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


    getFavouritesByPostID(res, wantedID, userID = -1) {
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
                                    res.status(200).json({message :"0 favourites on this post"});
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
                                            for(let i = 0; i < fieldsFavourites.length; i++){ 
                                                let curAuthor = '';     
                                                for(let j = 0; j < fieldsUser.length; j++){
                                                    if(fieldsFavourites[i].authorID == fieldsUser[j].userID){
                                                        curAuthor = fieldsUser[j].login;
                                                        break;
                                                    }
                                                }
                                                let currentObj = {
                                                    id: fieldsFavourites[i].favouriteID,
                                                    whoAddToFavorite: curAuthor,
                                                    postID: fieldsPosts[0].postID,
                                                    post: fieldsPosts[0].tittle
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
                                    res.status(200).json({message :"0 favourites on this post"});
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
                                            for(let i = 0; i < fieldsFavourites.length; i++){ 
                                                let curAuthor = '';     
                                                for(let j = 0; j < fieldsUser.length; j++){
                                                    if(fieldsFavourites[i].authorID == fieldsUser[j].userID){
                                                        curAuthor = fieldsUser[j].login;
                                                        break;
                                                    }
                                                }
                                                let currentObj = {
                                                    id: fieldsFavourites[i].favouriteID,
                                                    whoAddToFavorite: curAuthor,
                                                    postID: fieldsPosts[0].postID,
                                                    post: fieldsPosts[0].tittle
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


    getSubscribesByPostID(res, wantedID, userID = -1) {
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
                                    res.status(200).json({message :"0 subcribes to this post"});
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
                                            for(let i = 0; i < fieldsSubscribes.length; i++){ 
                                                let curAuthor = '';     
                                                for(let j = 0; j < fieldsUser.length; j++){
                                                    if(fieldsSubscribes[i].authorID == fieldsUser[j].userID){
                                                        curAuthor = fieldsUser[j].login;
                                                        break;
                                                    }
                                                }
                                                let currentObj = {
                                                    id: fieldsSubscribes[0].subscribeID,
                                                    whoSubscribed: curAuthor,
                                                    postID: fieldsPosts[0].postID,
                                                    post: fieldsPosts[0].tittle
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
                    mysql.query(`SELECT * FROM posts WHERE (status='active' OR (status='inactive' AND authorID='${userID}')) AND postID=${wantedID} AND locking='unlocked'`, (err, fieldsPosts)=>{
                        if(err) {
                            res.status(404).json({message: err});
                        }
                        else if(!fieldsPosts[0]) {
                            res.status(404).json({message :"No such active posts with this 'post_id'"});
                        }
                        else{
                            mysql.query(`SELECT * FROM subscribes WHERE postID=${wantedID}`, (err, fieldsSubscribes)=>{ 
                                if(err) {
                                    res.status(404).json({message: err});
                                }
                                else if(!fieldsSubscribes[0]) {
                                    res.status(200).json({message :"0 subcribes to this post"});
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
                                            for(let i = 0; i < fieldsSubscribes.length; i++){ 
                                                let curAuthor = '';     
                                                for(let j = 0; j < fieldsUser.length; j++){
                                                    if(fieldsSubscribes[i].authorID == fieldsUser[j].userID){
                                                        curAuthor = fieldsUser[j].login;
                                                        break;
                                                    }
                                                }
                                                let currentObj = {
                                                    id: fieldsSubscribes[0].subscribeID,
                                                    whoSubscribed: curAuthor,
                                                    postID: fieldsPosts[0].postID,
                                                    post: fieldsPosts[0].tittle
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



