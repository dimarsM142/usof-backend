const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');

const apiAuthRoutes = require('./Routes/api-authorization.js');
const apiUsersRoutes = require('./Routes/api-users.js');
const apiPostsRoutes = require('./Routes/api-posts.js');
const apiCategoriesRoutes = require('./Routes/api-categories');
const apiCommentsRoutes = require('./Routes/api-comments');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const mysqlAdmin = require('node-mysql-admin');
app.use(mysqlAdmin(app));

const corsOptions ={
    origin:['http://localhost:3000', 'https://us0f.herokuapp.com'], 
    credentials:true,
    methods:["GET" , "POST" , "PATCH", "DELETE"],
    optionSuccessStatus:200
}

app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(fileUpload());
require('./middleware/passport')(passport);


app.use(apiAuthRoutes);
app.use(apiUsersRoutes);
app.use(apiPostsRoutes);
app.use(apiCategoriesRoutes);
app.use(apiCommentsRoutes);

const PORT = process.env.PORT || 3001;


app.listen(PORT, ()=>{
    console.log(`App listen on port ${PORT}`);
});
