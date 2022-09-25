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
You can send API requests directly from your JS file using the fetch function, or if you wanna just test some things you can use Insomnia or Postman to test! If so, you probably should use Insomnia because I have prepared <a href="https://github.com/PAXANDDOS/orbimind-api/releases/download/1.2/Insomnia_Orbimind-public.json">a collection file just for you!</a><br>
If you are using JavaScript, you should set request header properties <code>Content-Type</code> and <code>Accept</code> to <code>application/json</code> and you are all set.
</p>
<p>
    <b>Here's list of possible user API requests:</b>
    <br>
    <p><b>Authorization module</b>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>Action</b></td>
                    <td><b>Request</b></td>
                    <td><b>Requirements</b></td>
                </tr>
            </thead>
            <tr>
                <td>Register</td>
                <td><code>POST - /api/auth/register</code></td>
                <td>json data</td>
            </tr>
            <tr>
                <td>Login</td>
                <td><code>POST - /api/auth/login</code></td>
                <td>json data</td>
            </tr>
            <tr>
                <td>Refresh token</td>
                <td><code>GET - /api/auth/refresh</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Log out</td>
                <td><code>POST - /api/auth/logout</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Forgot password</td>
                <td><code>POST - /api/auth/password-reset</code></td>
                <td>json data (email)</td>
            </tr>
            <tr>
                <td>Reset password</td>
                <td><code>POST - /api/auth/password-reset/token</code></td>
                <td>json data (password)</td>
            </tr>
        </table>
    </p>
    <br>
    <p><b>User module</b>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>Action</b></td>
                    <td><b>Request</b></td>
                    <td><b>Requirements</b></td>
                </tr>
            </thead>
            <tr>
                <td>Show current user</td>
                <td><code>GET - /api/users/me</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Show current user favorites</td>
                <td><code>GET - /api/users/me/favorites</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Update current user</td>
                <td><code>POST - /api/users/me/update</code></td>
                <td>token, json data</td>
            </tr>
            <tr>
                <td>Update current user avatar</td>
                <td><code>POST - /api/users/avatar</code></td>
                <td>token, json data (image => binary)</td>
            </tr>
            <tr>
                <td>Show specific user</td>
                <td><code>GET - /api/users/{user_id}</code></td>
                <td>token, user_id</td>
            </tr>
            <tr>
                <td>Show specific user favorites</td>
                <td><code>GET - /api/users/{user_id}/favorites</code></td>
                <td>token, user_id</td>
            </tr>
        </table>
    </p>
    <br>
    <p><b>Posts module</b>
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
    <p><b>Categories module</b>
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
     <p><b>Categories module</b>
        <br>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>Applied filters</b></td>
                    <td><b>Description</b></td>
                </tr>
                <tr>
                    <td>?search={string}</td>
                    <td>Search for categories that contains {string} in their title. {string} can be a word or even a letter.</td>
                </tr>
                <tr>
                    <td>?limit={int}</td>
                    <td>Get {int} quantity of categories.</td>
                </tr>
                <tr>
                    <td>?random={int}</td>
                    <td>Get random {int} quantity of categories.</td>
                </tr>
            </thead>
        </table>
     </p>
</p>

