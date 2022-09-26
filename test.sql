/*USE test_bd;*/
USE pz58d8x5ngkmjhbu;

CREATE TABLE IF NOT EXISTS users(
    userID INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (userID),
    login VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    picture LONGTEXT DEFAULT NULL,
    rating INT NOT NULL DEFAULT 0,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS emailToReset(
    tokenID VARCHAR(255) NOT NULL,
    email  VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS tokens(
    tokenID VARCHAR(255),
    userID int 
);


CREATE TABLE IF NOT EXISTS posts(
    postID INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (postID),
    authorID INT,
    FOREIGN KEY (authorID) REFERENCES users(userID) ON DELETE CASCADE ON UPDATE CASCADE,
    tittle VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    content TEXT NOT NULL,
    rating INT NOT NULL DEFAULT 0,
    publishDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    locking ENUM('locked', 'unlocked') NOT NULL DEFAULT 'unlocked'
);

CREATE TABLE IF NOT EXISTS categories(
    categoryID INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (categoryID),
    tittle VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS comment(
    commentID INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (commentID),
    authorID INT,
    FOREIGN KEY (authorID) REFERENCES users(userID) ON DELETE CASCADE ON UPDATE CASCADE,
    postID INT,
    FOREIGN KEY (postID) REFERENCES posts(postID) ON DELETE CASCADE ON UPDATE CASCADE,
    content TEXT NOT NULL,
    rating INT NOT NULL DEFAULT 0,
    publishDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    locking ENUM('locked', 'unlocked') NOT NULL DEFAULT 'unlocked'
);


CREATE TABLE IF NOT EXISTS likes(
    likeID INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (likeID),
    authorID INT,
    FOREIGN KEY (authorID) REFERENCES users(userID) ON DELETE CASCADE ON UPDATE CASCADE,
    postID INT,
    FOREIGN KEY (postID) REFERENCES posts(postID) ON DELETE CASCADE ON UPDATE CASCADE,
    commentID INT,
    FOREIGN KEY (commentID) REFERENCES comment(commentID) ON DELETE CASCADE ON UPDATE CASCADE,
    type ENUM('like', 'dislike') DEFAULT 'like',
    publishDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS favourites(
    favouriteID INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (favouriteID),
    authorID INT,
    FOREIGN KEY (authorID) REFERENCES users(userID) ON DELETE CASCADE ON UPDATE CASCADE,
    postID INT,
    FOREIGN KEY (postID) REFERENCES posts(postID) ON DELETE CASCADE ON UPDATE CASCADE
);



CREATE TABLE IF NOT EXISTS subscribes(
    subscribeID INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (subscribeID),
    authorID INT,
    FOREIGN KEY (authorID) REFERENCES users(userID) ON DELETE CASCADE ON UPDATE CASCADE,
    postID INT,
    FOREIGN KEY (postID) REFERENCES posts(postID) ON DELETE CASCADE ON UPDATE CASCADE
);
