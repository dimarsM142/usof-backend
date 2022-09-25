const Categories = require('../models/categories-operations.js');
const Token = require('../models/token.js');

const getCategories = (req, res) => {
    const accessToken = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : ' ';
    let token = new Token();
    const decodedToken = token.decodeToken(accessToken);
    let categories = new Categories();
    if(decodedToken.isErr){
        categories.findCategories(res);
    }
    else{
        categories.findCategories(res, decodedToken.result.userID);
    }
}


const getCategoryByID = (req, res) => {
    if(!Number.isInteger(+req.params.category_id) || +req.params.category_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        const accessToken = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : ' ';        
        let token = new Token();
        let categories = new Categories();
        const decodedToken = token.decodeToken(accessToken);
        if(decodedToken.isErr){
            categories.findCategoryByID(res, +req.params.category_id);
        }
        else{
            categories.findCategoryByID(res, +req.params.category_id, decodedToken.result.userID);
        }
    }
}

const getPostsByCategoryID = (req, res) => {
    if(!Number.isInteger(+req.params.category_id) || +req.params.category_id <= 0){
        res.status(404).json({message: "This id is not natural number"});
    }
    else{
        const accessToken = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : ' ';
        let token = new Token();
        let categories = new Categories();
        const decodedToken = token.decodeToken(accessToken);
        if(decodedToken.isErr){
            categories.findPostsByCategoryID(res, +req.params.category_id);
        }
        else{
            categories.findPostsByCategoryID(res, +req.params.category_id, decodedToken.result.userID);
        }
    }
}

const postCategory = (req, res) => {
    const {tittle, description} = req.body;
    if(!tittle || !description){
        res.status(404).json({message: "Input required fields 'tittle', 'description'."});
    }
    else{
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        let token = new Token();
        const decodedToken = token.decodeToken(accessToken);

        if(decodedToken.isErr){
            res.status(400).json({message: decodedToken.result});
        }
        else{
            let categories = new Categories();
            categories.createNewCategory(res, decodedToken.result.userID, tittle, description);
        }
    }
}


const patchCategory = (req, res) => {
    const {tittle, description} = req.body;
    if(!tittle && !description){
        res.status(404).json({message: "Input one of required fields 'tittle', 'description'."});
    }
    else if(!Number.isInteger(+req.params.category_id) || +req.params.category_id <= 0){
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
            let categories = new Categories();
            categories.updateCategory(res, decodedToken.result.userID, +req.params.category_id, tittle, description);
        }
    }
}


const deleteCategory = (req, res) => {
    if(!Number.isInteger(+req.params.category_id) || +req.params.category_id <= 0){
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
            let categories = new Categories();
            categories.deleteOneCategory(res, decodedToken.result.userID, +req.params.category_id);
        }
    }
}

module.exports = {
    getCategories,
    getCategoryByID,
    getPostsByCategoryID,
    postCategory,
    patchCategory,
    deleteCategory
}