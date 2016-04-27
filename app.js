global.func = require('./functions/globals.js');
var routes = require('./routes/index');
var users = require('./routes/users');
var query = require('./routes/query');
var facebook = require('./routes/facebook');


AWS.config = new AWS.Config();
AWS.config.accessKeyId = "AKIAIN3F4XXTDXEFTQ2Q";
AWS.config.secretAccessKey = "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";


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/query', query);
app.use('/facebook', facebook);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  global.err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
