var express             = require('express'),
    router              = express.Router(),
    User                = require('../models/user'),
    passport            = require('passport'),
    post                = require('../models/post');

//===============================================================================================//
//
//                                      Routes
//
//===============================================================================================//   

// route for login
router.get('/login', function(req, res){
    res.render('authentication/login');
});

router.post('/login', passport.authenticate("local", 
    {
        successRedirect: "/profile",
        failureRedirect: "/login"
    }) , function(req, res){
    
});

//route for registering a new user
router.get('/register', function(req,res){
    res.render('authentication/register');
});

router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render('authentication/register');
        }
        else{
            passport.authenticate("local")(req, res, function(){
                req.flash("success","Registration successful! Hello " + newUser.username + "!");
                console.log(user);
                res.redirect('/index');
            });
        }
    });
});

//route for logout
router.get('/logout', function(req,res){
    req.logout();
    req.flash('success', "Logged out Successful!");
    res.redirect("/index");
});



// route to profile once logged in

router.get('/profile', function(req, res) {
    
    post.find({name: req.user.username} , function(err, posts){
        if(err){
            console.log(err);
        }
        else{
            // doesnt pass the post * needs fixing
            console.log(posts);
            res.render('profile', {userpost: posts});
        }
    });
});

//===============================================================================================//
//
//                           Functions
//
//===============================================================================================//   

// Authentication function
function AuthenticateUser(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/index');
};

module.exports = router;