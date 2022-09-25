const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../db.js');
const fs = require('fs');

const configPath = 'config.json';
const parsedConfig = JSON.parse(fs.readFileSync(__dirname + '/../' + configPath, 'utf-8'));

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: parsedConfig.jwt 
}

module.exports = passport => {
    passport.use(
        new JwtStrategy(options, (payload, done) => {
            try {
                db.query("SELECT * FROM users WHERE userID = '" + payload.userID + "'", (error, result) => {
                    if(error) {
                        console.log(error);
                    } else {
                        if(payload.type == 'access' && result[0].userID){    
                            done(null, result[0].userID)
                        }
                        else {
                            done(null, false)
                        }
                    }
                })
            } catch(e) {
                console.log(e);
            }
        })
    )
}