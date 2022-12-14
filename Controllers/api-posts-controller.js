const Posts = require('../models/post-operations.js');
const Token = require('../models/token.js');

const getPosts = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    let sort;
    let isErr = false;
    let regexp = /^([1-2][0-9]|0?[1-9]|3[01])-(1[0-2]|0?[1-9])-(\d{1,3}|[0-1]\d\d\d|20[0-1]\d|202[0-2])$/;
    if(!req.query.sort || req.query.sort === 'rating'){
        sort = 'rating';
    }
    else if(req.query.sort === 'date'){
        sort = 'date';
    }
    else{
        isErr = true;
        res.status(404).json({message: "No such type of sorting!"})
    }     
    
    if(!isErr && req.query.status && req.query.status !== 'active' && req.query.status !=='inactive'){
        isErr = true;
        res.status(404).json({message: `Input status rightful to filter: 'active' or 'inactive'`})
    }
    
    if(!isErr && req.query.startDate && !req.query.startDate.match(regexp)){
        isErr = true;
        res.status(404).json({message: "Input startDate in style: DD-MM-YYYY"})
    }
    if(!isErr && req.query.endDate && !req.query.endDate.match(regexp)){
        isErr = true;
        res.status(404).json({message: "Input endDate in style: DD-MM-YYYY"})
    }
    if(!isErr && req.query.startDate && req.query.endDate){
        const arrStart = req.query.startDate.split('-');
        const start = new Date(`${arrStart[2]}-${arrStart[1]}-${arrStart[0]}`);
        const arrFinish = req.query.endDate.split('-');
        const finish = new Date(`${arrFinish[2]}-${arrFinish[1]}-${arrFinish[0]}`);
        if(finish.getTime() <= start.getTime()){
            isErr = true;
            res.status(404).json({message: "Input 'endDate' which bigger than 'startDate'"})
        }
    }
    if(!isErr && req.query.page &&(!Number.isInteger(+req.query.page) ||+req.query.page <= 0)){
        res.status(404).json({message: "This page is not natural number"});
        
        isErr = true;
        
    }
    if(!isErr){
        const accessToken = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : ' ';
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
        let posts = new Posts();
        if(decodedToken.isErr){
            posts.findAllPosts(res, sort, req.query, +req.query.page || 1);
        }
        else{
            posts.findAllPosts(res, sort, req.query, +req.query.page || 1, decodedToken.result.userID);
        }
    }
}

const getPostByID = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!Number.isInteger(+req.params.post_id) || +req.params.post_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        const accessToken = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : ' ';
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
        let posts = new Posts();

        if(decodedToken.isErr){
            posts.findOneByID(res, +req.params.post_id);
        }
        else{
            posts.findOneByID(res, +req.params.post_id, decodedToken.result.userID);
        }
    }
}

const getPostByIDComments = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!Number.isInteger(+req.params.post_id) || +req.params.post_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        let sort;
        let isErr = false;
        if(!req.query.sort || req.query.sort === 'rating'){
            sort = 'rating';
        }
        else if(req.query.sort === 'date'){
            sort = 'date';
        }
        else{
            isErr = true;
            res.status(404).json({message: "No such type of sorting!"})
        }
        if(!isErr){
            const accessToken = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : ' ';
            let token = new Token();
            const decodedToken = token.decodeToken(accessToken);
            let posts = new Posts();
            if(decodedToken.isErr){
                posts.findCommentByPostID(res, +req.params.post_id, sort);
                //posts.findCommentByPostID(res, +req.params.post_id);
            }
            else{
                posts.findCommentByPostID(res, +req.params.post_id, sort, decodedToken.result.userID);
                //posts.findCommentByPostID(res, +req.params.post_id);
            }
        }
    }
}

const postCommentToPost = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    const {content, replyID} = req.body;
    if(!content){
        res.status(404).json({message: "Input required field 'content' - it is text of Comment."});
    }
    else if(!Number.isInteger(+req.params.post_id) || +req.params.post_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else if(replyID && (!Number.isInteger(+replyID) || +replyID <= 0)){
        res.status(404).json({message: "This replyID is not natural number"});
    }
    else{
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
        let posts = new Posts();
        if(decodedToken.isErr){
            res.status(400).json({message: decodedToken.result});
        }
        else{
            if(replyID){
                posts.CreateCommentToPostID(res, +req.params.post_id, decodedToken.result.userID, content, +replyID);
            }
            else{
                posts.CreateCommentToPostID(res, +req.params.post_id, decodedToken.result.userID, content);
            }
            
        }
    }
}

const getCategoriesToPost =  (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    //res.status(200).json(2000);
    if(!Number.isInteger(+req.params.post_id) || +req.params.post_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
        let posts = new Posts();
        if(decodedToken.isErr){
            posts.findCategoriesToPost(res, +req.params.post_id);
        }
        else{
            posts.findCategoriesToPost(res, +req.params.post_id, decodedToken.result.userID);
        }
    }
}

const getLikesOnPost = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!Number.isInteger(+req.params.post_id) || +req.params.post_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        const accessToken = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : ' ';
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
        let posts = new Posts();
        if(decodedToken.isErr){
            posts.getLikesOnPost(res, +req.params.post_id);
        }
        else{
            posts.getLikesOnPost(res, +req.params.post_id, decodedToken.result.userID)
        }
    }
}

const postNewPost = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    const {tittle, content, categories} = req.body;
    if(!tittle || !content || !categories){
        let example = {
            tittle: "tittle_data",
            content: "content_data",
            categories:"JavaScript, HTML, ..., Python"
        }
        res.status(404).json({
            message:"Input data in this style:",
            example: example
        });
    }
    else{        
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
        let posts = new Posts();
        if(decodedToken.isErr){
            res.status(400).json({message: decodedToken.result});
        }
        else{
            posts.createNewPost(res, decodedToken.result.userID, tittle, content, categories.split(', '))
            //posts.getLikesOnPost(res, decodedToken.result.userID, )
        }
        //res.status(200).json("?? ???????????? ???????? ?????? ???? ??????????");
    }
    
    
}

const postLikeToPost = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    const {type} = req.body;
    if(type !=='like' && type !=='dislike'){
        res.status(404).json({message:"Input 'type' of like - 'like' or 'dislike':"});
    }
    else if(!Number.isInteger(+req.params.post_id) || +req.params.post_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{    
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
        let posts = new Posts();
        if(decodedToken.isErr){
            res.status(400).json({message: decodedToken.result});
        }
        else{
            posts.createNewLikeUnderPost(res, decodedToken.result.userID, +req.params.post_id, type);
        }
        //res.status(200).json("?? ???????????? ???????? ?????? ???? ??????????");
    }
}

const patchPost = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    let arrCategories;
    if(!Number.isInteger(+req.params.post_id) || +req.params.post_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{    
        const {tittle, content, categories} = req.body;
        if(!tittle && !content && !categories){
            let example = {
                tittle: "tittle_data",
                content: "content_data",
                categories:"JavaScript, HTML, ..., Python"
            }
            res.status(404).json({
                message:"Input one more field(s) in this style:",
                example: example
            });
        }
        else{   
            if(categories){
                arrCategories = categories.split(', ');
            }     
            else{
                arrCategories = undefined;
            }
            const accessToken = req.headers.authorization.replace('Bearer ', '');
            let token = new Token();
            const decodedToken = token.decodeToken(accessToken);
            let posts = new Posts();
            if(decodedToken.isErr){
                res.status(400).json({message: decodedToken.result});
            }
            else{
                posts.updatePost(res, decodedToken.result.userID, +req.params.post_id, tittle, content, arrCategories);
                
                //posts.getLikesOnPost(res, decodedToken.result.userID, )
            }
            //res.status(200).json("?? ???????????? ???????? ?????? ???? ??????????");
        }
    }
    
    
}

const deletePost = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!Number.isInteger(+req.params.post_id) || +req.params.post_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
       
        if(decodedToken.isErr){
            res.status(400).json({message: decodedToken.result});
        }
        else{
            let posts = new Posts();
            posts.deleteOnePost(res, +req.params.post_id, decodedToken.result.userID);
        }
    }
}    


const deleteLikeOnPost = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!Number.isInteger(+req.params.post_id) || +req.params.post_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
       
        if(decodedToken.isErr){
            res.status(400).json({message: decodedToken.result});
        }
        else{
            let posts = new Posts();
            posts.deleteOneLikeOnPost(res, +req.params.post_id, decodedToken.result.userID);
        }
    }
}

const patchStatus = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!Number.isInteger(+req.params.post_id) || +req.params.post_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
       
        if(decodedToken.isErr){
            res.status(400).json({message: decodedToken.result});
        }
        else{
            let posts = new Posts();
            posts.updatePostStatus(res, +req.params.post_id, decodedToken.result.userID);
        }
    }
}


const patchLocking = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!Number.isInteger(+req.params.post_id) || +req.params.post_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
       
        if(decodedToken.isErr){
            res.status(400).json({message: decodedToken.result});
        }
        else{
            let posts = new Posts();
            posts.updatePostLocking(res, +req.params.post_id, decodedToken.result.userID);
        }
    }
}

const getFavourite = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!Number.isInteger(+req.params.post_id) || +req.params.post_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
        let posts = new Posts();
        if(decodedToken.isErr){
            posts.getFavouritesByPostID(res, +req.params.post_id);
        }
        else{
            posts.getFavouritesByPostID(res, +req.params.post_id, decodedToken.result.userID)
        }
    }
}

const postFavourite = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!Number.isInteger(+req.params.post_id) || +req.params.post_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
        let posts = new Posts();
        if(decodedToken.isErr){
            res.status(400).json({message: decodedToken.result});
        }
        else{
            posts.createFavouriteOnPost(res, +req.params.post_id, decodedToken.result.userID)
        }
    }
}

const deleteFavourite = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!Number.isInteger(+req.params.post_id) || +req.params.post_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
        let posts = new Posts();
        if(decodedToken.isErr){
            res.status(400).json({message: decodedToken.result});
        }
        else{
            posts.deleteFavouriteOnPost(res, +req.params.post_id, decodedToken.result.userID)
        }
    }
}

const getSubscribe = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!Number.isInteger(+req.params.post_id) || +req.params.post_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
        let posts = new Posts();
        if(decodedToken.isErr){
            posts.getSubscribesByPostID(res, +req.params.post_id);
        }
        else{
            posts.getSubscribesByPostID(res, +req.params.post_id, decodedToken.result.userID)
        }
    }
}

const postSubscribe = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!Number.isInteger(+req.params.post_id) || +req.params.post_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
        let posts = new Posts();
        if(decodedToken.isErr){
            res.status(400).json({message: decodedToken.result});
        }
        else{
            posts.createSubscribeOnPost(res, +req.params.post_id, decodedToken.result.userID)
        }
    }
}

const deleteSubscribe = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!Number.isInteger(+req.params.post_id) || +req.params.post_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
        let posts = new Posts();
        if(decodedToken.isErr){
            res.status(400).json({message: decodedToken.result});
        }
        else{
            posts.deleteSubscribeOnPost(res, +req.params.post_id, decodedToken.result.userID)
        }
    }
}


module.exports = {
    getPosts, 
    getPostByID, 
    getPostByIDComments, 
    postCommentToPost, 
    getCategoriesToPost, 
    getLikesOnPost, 
    postNewPost, 
    postLikeToPost, 
    patchPost, 
    deletePost, 
    deleteLikeOnPost,
    patchStatus,
    patchLocking,
    getFavourite,
    postFavourite,
    deleteFavourite,
    getSubscribe,
    postSubscribe,
    deleteSubscribe
}