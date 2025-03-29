const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const { ObjectID } = require('mongodb');
const GitHubStrategy = require('passport-github').Strategy;

module.exports = function (app, myDataBase) {
    //serialize user data so it does not need fetched from DB every time
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    //deserialize user data for use
    passport.deserializeUser((id, done) => {
        myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
        done(null, doc);
        });
    });
    //strategy for passport authentication, password/google/github/etc
    passport.use(new LocalStrategy((username, password, done) => {
        myDataBase.findOne({ username: username }, (err, user) => {
            console.log(`User ${username} attempted to log in.`);
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!bcrypt.compareSync(password, user.password)) { return done(null, false); }
            return done(null, user);
        });
    }));

    //github authorization strategy
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'https://github.com/Vukodlok/auth/github/callback'
    },
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        //update information
        myDataBase.findAndModify(
            { id: profile.id },
            {},
            {
                $setOnInsert: {
                    id: profile.id,
                    name: profile.displayName || 'John Doe',
                    photo: profile.photos[0].value || '',
                    email: Array.isArray(profile.emails) ? profile.emails[0].value : 'No public email',
                    created_on: new Date(),
                    provider: profile.provider || ''
                }, $set: {
                    last_login: new Date()
                }, $inc: {
                    login_count: 1
                }
            },
            { upsert: true, new: true },
            (err, doc) => {
                return cb(null, doc.value);
                }
            );
        }
    ));
}
