const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');

const apiAuthRoutes = require('./Routes/api-authorization.js');
const apiUsersRoutes = require('./Routes/api-users.js');
const apiPostsRoutes = require('./Routes/api-posts.js');
const apiCategoriesRoutes = require('./Routes/api-categories');
const apiCommentsRoutes = require('./Routes/api-comments');


app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./middleware/passport')(passport);


app.use(apiAuthRoutes);
app.use(apiUsersRoutes);
app.use(apiPostsRoutes);
app.use(apiCategoriesRoutes);
app.use(apiCommentsRoutes);

const PORT = process.env.PORT || 3000;


app.listen(PORT, ()=>{
    console.log(`App listen on port ${PORT}`);
});
