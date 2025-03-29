const passport = require('passport');
const bcrypt = require('bcrypt');

module.exports = function (app, myDataBase) {
    //render html using variables
    app.route('/').get((req, res) => {
        res.render('index', {
        title: 'Connected to Database',
        message: 'Please log in',
        //show login and registration pages
        showLogin: true,
        showRegistration: true,
        showSocialAuth: true
        });
    });

    //redirect at login
    app.route('/login').post(passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
        res.redirect('/profile');
    });

    app.route('/profile').get(ensureAuthenticated, (req,res) => {
        res.render('profile', { username: req.user.username });
    });

    //handle a logout
    app.route("/logout").get((req,res)=>{
        req.logout();
        res.redirect("/");
    });

    //register user
    app.route('/register')
    .post((req, res, next) => {
        const hash = bcrypt.hashSync(req.body.password, 12);
        myDataBase.findOne({ username: req.body.username }, (err, user) => {
            if (err) {
            next(err);
        } else if (user) {
            res.redirect('/');
        } else {
            //add new username and password
            myDataBase.insertOne({
                username: req.body.username,
                password: hash
            },
            (err, doc) => {
                if (err) {
                    res.redirect('/');
                } else {
                    //the inserted document is held within the ops property of the doc
                    next(null, doc.ops[0]);
                    }
                }
            )
        }
    })
},
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res, next) => {
        res.redirect('/profile');
    }
);

    app.route('/auth/github').get(passport.authenticate('github'));
    app.route('/auth/github/callback').get(passport.authenticate('github', { failureRedirect: '/'}), (req, res) => {
        res.session.user_id = req.user.id;
        res.redirect('/chat');
    })

    //handle missing page 404 errors
    app.use((req, res, next) => {
        res.status(404)
        .type('text')
        .send('Not Found');
    });
}

//check if a user is authenticated before sending to /profile
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};
