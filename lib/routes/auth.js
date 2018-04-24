const router = require('express').Router();
const { respond } = require('./route-helpers');
const User = require('../models/User');

module.exports = router
    .post('/signup', respond(
        ({ body }) => {
            const { email, password } = body;
            delete body.password;

            return User.exists({ email })
                .then(exists => {
                    // TODO: 
                    // if(exists)...

                    const user = new User(body);
                    user.generateHash(password);
                    return user.save();
                })
                .then(user => {
                    return { token: user._id };
                });
        }
    ));