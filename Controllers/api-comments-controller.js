const Comments = require('../models/comments-operations.js');
const Token = require('../models/token.js');

const getCommentByID = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!Number.isInteger(+req.params.comment_id) || +req.params.comment_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        const accessToken = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : ' ';
        let token = new Token();
        let comments = new Comments();
        const decodedToken = token.decodeToken(accessToken);
        if(decodedToken.isErr){
            
            comments.findCommentByID(res, +req.params.comment_id);
        }
        else{
            comments.findCommentByID(res, +req.params.comment_id, decodedToken.result.userID);
        }
    }
}

const getLikeByCommentID = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!Number.isInteger(+req.params.comment_id) || +req.params.comment_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        const accessToken = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : ' ';
        let token = new Token();
        let comments = new Comments();
        const decodedToken = token.decodeToken(accessToken);
        if(decodedToken.isErr){       
            comments.findLikesOnComment(res, +req.params.comment_id);
        }
        else{
            comments.findLikesOnComment(res, +req.params.comment_id, decodedToken.result.userID);
        }
    }
    //res.status(200).json("MESSAGE");
}

const postLikeByCommentID = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    const {type} = req.body;
    if(type !=='like' && type !=='dislike'){
        res.status(404).json({message:"Input 'type' of like - 'like' or 'dislike':"});
    }
    else if(!Number.isInteger(+req.params.comment_id) || +req.params.comment_id <= 0){
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
            const comments = new Comments();
            comments.createNewLikeUnderComment(res, decodedToken.result.userID, +req.params.comment_id, type);
        }
        //res.status(200).json("А ТРЕТІЙ ПОСТ БУВ ЗА ЛЮБОВ");
    }

}

const patchCommentByID = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    const {content} = req.body;

    if(!Number.isInteger(+req.params.comment_id) || +req.params.commment_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else if(!content){  
        res.status(404).json({message:"Input content of coment"});
    }
    else{    
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);
        if(decodedToken.isErr){
            res.status(400).json({message: decodedToken.result});
        }
        else{
            let comments = new Comments();    
            comments.updateComment(res, +req.params.comment_id, decodedToken.result.userID, content);
        }        
    }
}

const patchLocking = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!Number.isInteger(+req.params.comment_id) || +req.params.commment_id <= 0){
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
            let comments = new Comments();
            comments.updateCommentLocking(res, +req.params.comment_id, decodedToken.result.userID);
        }
    }
}



const deleteCommentByID = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!Number.isInteger(+req.params.comment_id) || +req.params.comment_id <= 0){
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
            let comments = new Comments();
            comments.deleteOneComment(res, +req.params.comment_id, decodedToken.result.userID);
        }
    }
}

const deleteLikeByCommentID = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Origin, Authorization');
    if(!Number.isInteger(+req.params.comment_id) || +req.params.comment_id <= 0){
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
            let comments = new Comments();
            comments.deleteOneLikeUnderComment(res, +req.params.comment_id, decodedToken.result.userID);
        }
    }
}

module.exports = {
    getCommentByID,
    getLikeByCommentID,
    postLikeByCommentID,
    patchCommentByID,
    patchLocking,
    deleteCommentByID,
    deleteLikeByCommentID
}