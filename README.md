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
                <td>token</td>
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
                <td>Info about all users</td>
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
                <td>Update your post</td>
                <td><code>PATCH - /api/me/users</code></td>
                <td>access token,  json data -> {login, email, fullName}</td>
                <td>Your avatar updated</td>
            </tr>
              <tr>
                <td>Update post</td>
                <td><code>PATCH - /api/users/:id</code></td>
                <td>access token(admin only),  json data -> {login, email, fullName, role}</td>
                <td>Post updated</td>
            </tr>
            <tr>
                <td>Delete your post</td>
                <td><code>DELETE - /api/me/users</code></td>
                <td>access token</td>
                <td>Your avatar deleted</td>
            </tr>
              <tr>
                <td>Delete post</td>
                <td><code>DELETE - /api/users/:id</code></td>
                <td>access token(admin only)</td>
                <td>Post deleteed</td>
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
                </tr>
            </thead>
            <tr>
                <td>Show all posts</td>
                <td><code>GET - /api/posts</code></td>
                <td></td>
            </tr>
            <tr>
                <td>Show specific post</td>
                <td><code>GET - /api/posts/{post_id}</code></td>
                <td>post_id</td>
            </tr>
            <tr>
                <td>Create post</td>
                <td><code>POST - /api/posts</code></td>
                <td>json data</td>
            </tr>
            <tr>
                <td>Update post</td>
                <td><code>PATCH - /api/posts/{post_id}</code></td>
                <td>token, json data</td>
            </tr>
            <tr>
                <td>Delete post</td>
                <td><code>DELETE - /api/posts/{post_id}</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Show Categories on Post</td>
                <td><code>GET - /api/posts/{post_id}/categories</code></td>
                <td>post_id</td>
            </tr>
            <tr>
                <td>Show Comments on Post</td>
                <td><code>GET - /api/posts/{post_id}/comments</code></td>
                <td>post_id</td>
            </tr>
            <tr>
                <td>Create comment on post</td>
                <td><code>POST - /api/posts/{post_id}/comments</code></td>
                <td>token, post_id, json data</td>
            </tr>
            <tr>
                <td>Show likes/dislikes on post</td>
                <td><code>GET - /api/posts/{post_id}/like</code></td>
                <td>post_id</td>
            </tr>
            <tr>
                <td>Create or delete like/dislike on Post</td>
                <td><code>POST - /api/posts/{post_id}/like</code></td>
                <td>token, post_id, json data</td>
            </tr>
            <tr>
                <td>Delete like on post</td>
                <td><code>DELETE - /api/posts/{post_id}/like</code></td>
                <td>token, post_id, json data</td>
            </tr>
            <tr>
                <td>Add or delete post from favorites</td>
                <td><code>POST - /api/posts/{post_id}/favorite</code></td>
                <td>token, post_id</td>
            </tr>
            <tr>
                <td>Delete post from favorites</td>
                <td><code>DELETE - /api/posts/{post_id}/favorite</code></td>
                <td>token, post_id</td>
            </tr>
            <tr>
                <td>Subscribe or unsubscribe to post updates</td>
                <td><code>POST - /api/posts/{post_id}/subscribe</code></td>
                <td>token, post_id</td>
            </tr>
            <tr>
                <td>Unsubscribe from post updates</td>
                <td><code>DELETE - /api/posts/{post_id}/subscribe</code></td>
                <td>token, post_id</td>
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
                </tr>
            </thead>
            <tr>
                <td>Show all categories (tags)</td>
                <td><code>GET - /api/categories</code></td>
                <td></td>
            </tr>
            <tr>
                <td>Show specific category (tag)</td>
                <td><code>GET - /api/categories/{category_id}</code></td>
                <td>category_id</td>
            </tr>
            <tr>
                <td>Show all posts associated with category</td>
                <td><code>GET - /api/categories/{category_id}/posts</code></td>
                <td>category_id</td>
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
                </tr>
            </thead>
            <tr>
                <td>Update comment</td>
                <td><code>PATCH - /api/comments/{comment_id}</code></td>
                <td>token, comment_id</td>
            </tr>
            <tr>
                <td>Delete comment</td>
                <td><code>DELETE - /api/comments/{comment_id}</code></td>
                <td>token, comment_id</td>
            </tr>
            <tr>
                <td>Show all likes on comment</td>
                <td><code>GET - /api/comments/{comment_id}/like</code></td>
                <td>comment_id</td>
            </tr>
            <tr>
                <td>Create or delete like on comment</td>
                <td><code>POST - /api/comments/{comment_id}/like</code></td>
                <td>token, comment_id, json data</td>
            </tr>
            <tr>
                <td>Delete like on comment</td>
                <td><code>DELETE - /api/comments/{comment_id}/like</code></td>
                <td>token, comment_id, json data</td>
            </tr>
            <tr>
                <td>Mark or unmark comment as best on post</td>
                <td><code>GET - /api/comments/{comment_id}/best</code></td>
                <td>token, comment_id</td>
            </tr>
        </table>
    </p>
    <h3>Also it's possible to sort and filter different requests:</h3>
    <p><b>Posts module</b>
        <br>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>Applied filters</b></td>
                    <td><b>Description</b></td>
                </tr>
                <tr>
                    <td>?search={string}</td>
                    <td>Search for posts that contains {string} in their title or content. {string} can be a word or even a letter.</td>
                </tr>
                <tr>
                    <td>?user={username}</td>
                    <td>Search for posts that was created by {username}.</td>
                </tr>
                <tr>
                    <td>?category={string}</td>
                    <td>Search for posts that was contains {string} categories. {string} can look like `HTML,JavaScript,React`</td>
                </tr>
                <tr>
                    <td>?status={integer}</td>
                    <td>Search for posts that was has status true or false. {integer} can be 0 or 1</td>
                </tr>
                <tr>
                    <td>?startDate={date}</td>
                    <td>Search for posts that was was created after {date}. Can be combined with endDate to create a date interval.</td>
                </tr>
                <tr>
                    <td>?endDate={int}</td>
                    <td>Search for posts that was was created before {date}. Can be combined with startDate to create a date interval.</td>
                </tr>
                <tr>
                    <td>?order={string}</td>
                    <td>Get posts ordered by {string}. {string} should look like: date$desc, date$asc, rating$asc, rating$desc</td>
                </tr>
                <tr>
                    <td>?page={integer}</td>
                    <td>Search for posts that are displayed on {integer} page. Each page contains 10 posts.</td>
                </tr>
            </thead>
        </table>
     </p>
</p>

