<h2 id="req"> Requirements</h2>
<p>You can easily install those software:<br>
    <code>sudo apt install nodejs</code><br>
    <code>sudo apt install npm</code>
    <code>sudo apt install mysql-server</code><br>
</p>

<h2> Hosting the API</h2>

<p><b>To host the API follow these steps:</b></p>
<ol>
    <li>Check all requirements above</li>
    <li>Open folder in your terminal and run <code>npm install</code></li>
    <li>Create your database. if mysql installed run <code>mysql -u root -p < test.sql</code> and then input password to your root. This is needed to create important tables</li>
    <li>Start the API server with <code>npm start</code></li>
</ol>

<h2>Using the API</h2>
<p>
To check this API, use the Insomnia or Postman sites. They can be used to easily send requests to the urlsdescribed below. The url type is: <code>http:localhost:3000/api/auth/login</code> .In order to check requests in which you need to use an authorization token, you should use the headers, and additionally add a new "Authorization" and write "Bearer 'your access token'" in its value. To test a url where json data is required, select the json data type and write the ones described below.
</p>
<p>
    <b>Here's list of possible user API requests:</b>
    <br>
    <p><b>Authorization</b>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>Action</b></td>
                    <td><b>Request</b></td>
                    <td><b>Requirements</b></td>
                    <td><b>Expected result</b></td>
                </tr>
            </thead>
            <tr>
                <td>Register</td>
                <td><code>POST - /api/auth/register</code></td>
                <td>json data -> {login, password, passwordConfirmation, email, fullName}</td>
                <td>New user created</td>
            </tr>
            <tr>
                <td>Login</td>
                <td><code>POST - /api/auth/login</code></td>
                <td>json data -> {login}</td>
                <td>json data -> {accessToken, refreshToken}</td>
            </tr>
            <tr>
                <td>Refresh token</td>
                <td><code>GET - /api/auth/refresh</code></td>
                <td>refresh token</td>
                <td>json data -> {accessToken, refreshToken}</td>
            </tr>
            <tr>
                <td>Log out</td>
                <td><code>POST - /api/auth/logout</code></td>
                <td>access token</td>
                <td>json data -> {accessToken:"", refreshToken:""}</td>
            </tr>
            <tr>
                <td>Send password-reset</td>
                <td><code>POST - /api/auth/password-reset</code></td>
                <td>json data ->{email}</td>
                <td>Link in the email</td>
            </tr>
            <tr>
                <td>Reset password</td>
                <td><code>POST - /api/auth/password-reset/token</code></td>
                <td>json data ->{password}</td>
                <td>Password reset</td>
            </tr>
        </table>
    </p>
    <br>
    <p><b>User</b>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>Action</b></td>
                    <td><b>Request</b></td>
                    <td><b>Requirements</b></td>
                    <td><b>Expected result</b></td>
                </tr>
            </thead>
            <tr>
                <td>Show all users</td>
                <td><code>GET - /api/users</code></td>
                <td>access token(admin only)</td>
                <td>Info about all users(json)</td>
            </tr>
            <tr>
                <td>Show specified user</td>
                <td><code>GET - /api/users/:id</code></td>
                <td>access token(admin only)</td>
                <td>Info about specified users(json)</td>
            </tr>
             <tr>
                <td>Show your info</td>
                <td><code>GET - /api/me/users</code></td>
                <td>access token</td>
                <td>Info about you(json)</td>
            </tr>
            <tr>
                <td>Create new user</td>
                <td><code>POST - /api/users</code></td>
                <td>access token(admin only), json data -> {login, password, passwordConfirmation, email, fullName, role}</td>
                <td>New user created</td>
            </tr>
            <tr>
                <td>Update your avatar</td>
                <td><code>PATCH - /api/users/me/avatar</code></td>
                <td>access token, image(select some image)</td>
                <td>Your avatar updated</td>
            </tr>
              <tr>
                <td>Update avatar</td>
                <td><code>PATCH - /api/users/avatar/:id</code></td>
                <td>access token(admin only), image(select some image)</td>
                <td>Avatar updated</td>
            </tr>
            <tr>
                <td>Update your account</td>
                <td><code>PATCH - /api/me/users</code></td>
                <td>access token,  json data -> {login, email, fullName}</td>
                <td>Your account updated</td>
            </tr>
              <tr>
                <td>Update account</td>
                <td><code>PATCH - /api/users/:id</code></td>
                <td>access token(admin only),  json data -> {login, email, fullName, role}</td>
                <td>Account updated</td>
            </tr>
            <tr>
                <td>Delete your account</td>
                <td><code>DELETE - /api/me/users</code></td>
                <td>access token</td>
                <td>Your account deleted</td>
            </tr>
              <tr>
                <td>Delete account</td>
                <td><code>DELETE - /api/users/:id</code></td>
                <td>access token(admin only)</td>
                <td>Account deleted</td>
            </tr>
        </table>
    </p>
    <br>
    <p><b>Posts</b>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>Action</b></td>
                    <td><b>Request</b></td>
                    <td><b>Requirements</b></td>
                    <td><b>Expected result</b></td>
                </tr>
            </thead>
            <tr>
                <td>Show all posts</td>
                <td><code>GET - /api/posts</code></td>
                <td></td>
                <td>All posts(json)</td>
            </tr>
            <tr>
                <td>Show specific post</td>
                <td><code>GET - /api/posts/:post_id</code></td>
                <td>post_id</td>
                <td>Specific post(json)</td>
            </tr>
            <tr>
                <td>Create post</td>
                <td><code>POST - /api/posts</code></td>
                <td>access token, json data -> {tittle, content, categories}</td>
                <td>New post created</td>
            </tr>
            <tr>
                <td>Update post</td>
                <td><code>PATCH - /api/posts/:post_id</code></td>
                  <td>access token, json data -> {tittle, content, categories}</td>
                  <td>Post updated</td>
            </tr>
            <tr>
                <td>Update status</td>
                <td><code>PATCH - /api/posts/:post_id/status</code></td>
                  <td>access token</td>
                  <td>Status changed</td>
            </tr>
            <tr>
                <td>Update locking</td>
                <td><code>PATCH - /api/posts/:post_id/locking</code></td>
                  <td>access token(admin only)</td>
                  <td>Locking changed</td>
            </tr>
            <tr>
                <td>Delete post</td>
                <td><code>DELETE - /api/posts/:post_id</code></td>
                <td>access token</td>
                <td>Post deleted</td>
            </tr>
            <tr>
                <td>Show categories on post</td>
                <td><code>GET - /api/posts/:post_id/categories</code></td>
                <td>access token</td>
                <td>All categories of this post(json)</td>
            </tr>
            <tr>
                <td>Show comments on post</td>
                <td><code>GET - /api/posts/:post_id/comments</code></td>
                <td></td>
                 <td>All comments of this post(json)</td>
            </tr>
            <tr>
                <td>Create comment on post</td>
                <td><code>POST - /api/posts/:post_id/comments</code></td>
                <td>access token, json data ->{content}</td>
                <td>New comment created</td>
            </tr>
            <tr>
                <td>Show likes/dislikes on post</td>
                <td><code>GET - /api/posts/:post_id/like</code></td>
                <td></td>
                <td>All likes of this post(json)</td>
            </tr>
            <tr>
                <td>Create like/dislike on post</td>
                <td><code>POST - /api/posts/:post_id/like</code></td>
                <td>access token, json data -> {type}</td>
                <td>New like/dislike created</td>
            </tr>
            <tr>
                <td>Delete like on post</td>
                <td><code>DELETE - /api/posts/:post_id/like</code></td>
                <td>access token</td>
                <td>Like/dislike deleted</td>
            </tr>
             <tr>
                <td>Show favourites of post</td>
                <td><code>GET - /api/posts/:post_id/favourite</code></td>
                <td>access token</td>
                <td>All favourites of this post(json)</td>
            </tr>
            <tr>
                <td>Add post to favourites</td>
                <td><code>POST - /api/posts/:post_id:/favourite</code></td>
                <td>access token</td>
                <td>New post added to favourite</td>
            </tr>
            <tr>
                <td>Delete post from favourites</td>
                <td><code>DELETE - /api/posts/:post_id/favourite</code></td>
                <td>access token</td>
                <td>Post added deleted from favourites</td>
            </tr>
             <tr>
                <td>Show subscribes of post</td>
                <td><code>GET - /api/posts/:post_id/subscribe</code></td>
                <td>access token</td>
                <td>All subscribes of this post(json)</td>
            </tr>
            <tr>
                <td>Add post to subscribes</td>
                <td><code>POST - /api/posts/:post_id:/subscribe</code></td>
                <td>access token</td>
                <td>Subscribed to new post</td>
            </tr>
            <tr>
                <td>Delete post from subscribes</td>
                <td><code>DELETE - /api/posts/:post_id/subscribe</code></td>
                <td>access token</td>
                <td>Post unsubscribed</td>
            </tr>
        </table>
    </p>
    <br>
    <p><b>Categories</b>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>Action</b></td>
                    <td><b>Request</b></td>
                    <td><b>Requirements</b></td>
                    <td><b>Expected result</b></td>
                </tr>
            </thead>
            <tr>
                <td>Show all categories</td>
                <td><code>GET - /api/categories</code></td>
                <td></td>
                <td>All categories(json)</td>
            </tr>
            <tr>
                <td>Show specific category</td>
                <td><code>GET - /api/categories/:category_id</code></td>
                <td></td>
                <td>Specififc category(json)</td>
            </tr>
            <tr>
                <td>Show all posts associated with category</td>
                <td><code>GET - /api/categories/:category_id/posts</code></td>
                <td></td>
                <td>All posts of some category(json)</td>
            </tr>
            <tr>
                <td>Create new category</td>
                <td><code>POST - /api/categories</code></td>
                <td>access token(admin only), json data ->{tittle, description}</td>
                <td>New category created</td>
            </tr>
            <tr>
                <td>Update specific category</td>
                <td><code>PATCH - /api/categories/:category_id</code></td>
                <td>access token(admin only), json data ->{tittle, description}</td>
                <td>Specific category created</td>
            </tr>
             <tr>
                <td>Delete specific category</td>
                <td><code>DELETE - /api/categories/:category_id</code></td>
                <td>access token(admin only)</td>
                <td>Specific category deleted</td>
            </tr>
        </table>
    </p>
    <br>
    <p><b>Comments module</b>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>Action</b></td>
                    <td><b>Request</b></td>
                    <td><b>Requirements</b></td>
                     <td><b>Expected result</b></td>
                </tr>
            </thead>
            <tr>
                <td>Show specific comment</td>
                <td><code>GET - /api/comments/:comment_id</code></td>
                <td></td>
                <td>All comments(json)</td>
            </tr>
            <tr>
                <td>Update comment</td>
                <td><code>PATCH - /api/comments/:comment_id</code></td>
                <td>access token, json data ->{content}</td>
                <td>Comment updated</td>
            </tr>
             <tr>
                <td>Update locking comment</td>
                <td><code>PATCH - /api/comments/:comment_id/locking</code></td>
                <td>access token</td>
                <td>Locking comment updated</td>
            </tr>
            <tr>
                <td>Delete comment</td>
                <td><code>DELETE - /api/comments/{comment_id}</code></td>
                <td>access token</td>
                <td>Comment deleted</td>
            </tr>
            <tr>
                <td>Show all likes/dislikes on comment</td>
                <td><code>GET - /api/comments/:comment_id/like</code></td>
                <td></td>
                <td>All likes/dislikes of this post(json)</td>
            </tr>
            <tr>
                <td>Create like/dislike on comment</td>
                <td><code>POST - /api/comments/:comment_id/like</code></td>
                <td>access token, json data->{type}</td>
                <td>One like/dislike created</td>
            </tr>
            <tr>
                <td>Delete like/dislike on comment</td>
                <td><code>DELETE - /api/comments/:comment_id/like</code></td>
                <td>access token</td>
                 <td>One like/dislike deleted</td>
            </tr>
        </table>
    </p>
    <h3>Sorting and filtering. When your request is <code>api/posts</code> you can use these parametrs:</h3>
    <p>
        <br>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>filters or sort type</b></td>
                    <td><b>Description</b></td>
                </tr>
                <tr>
                    <td>?category=category_name</td>
                    <td>Search for posts that was contains categories. Example: `Python,NodeJS,ReactJS`</td>
                </tr>
                <tr>
                    <td>?status=status_type</td>
                    <td>Search for posts that was has status 'active' or 'inactive'</td>
                </tr>
                <tr>
                    <td>?startDate=DD-MM-YYYY</td>
                    <td>Search for posts that was was created after date</td>
                </tr>
                <tr>
                    <td>?endDate=DD-MM-YYYY</td>
                    <td>Search for posts that was was created before date.</td>
                </tr>
                <tr>
                    <td>?sort={sort_type}</td>
                    <td>Get posts ordered by 'date' or 'rating'.</td>
                </tr>
            </thead>
        </table>
     </p>
</p>

