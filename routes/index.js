global.func = require('../functions/globals.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	
var userLoggedIn = false;
var cognitoidentity = new AWS.CognitoIdentity();

//Now let's add our code for Passport to collect the Facebook token:
router.use(passport.initialize());
router.use(passport.session());

 

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: 'http://mean.lamsaworld.mobi:8080/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {

  process.nextTick(function() {
    FACEBOOK_TOKEN = accessToken; 
    FACEBOOK_USER = profile._json;
    userLoggedIn = true;
    done(null, profile);

  });
}));


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


//Now lets add our success and error callbacks:

/* GET Facebook page. */
router.get('/auth/facebook', passport.authenticate('facebook'));
 
/* GET Facebook callback page. */
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/success',
  failureRedirect: '/error'
}));

/* GET Facebook success page. */
router.get('/success', function(req, res, next) {
  console.log('FACEBOOK_TOKEN:'.green + FACEBOOK_TOKEN);
  //func.getCognitoID();
  user_id = FACEBOOK_USER.id;
  res.send('Logged in as ' + FACEBOOK_USER.name + ' (id:' + FACEBOOK_USER.id + ').');
		  
});

/* GET Facebook error page. */
router.get('/error', function(req, res, next) {
  res.send("Unable to access Facebook servers. Please check internet connection or try again later.");
});
  
res.render('index', { title: 'Express' });
});

module.exports = router;