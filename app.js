
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , partials = require('express-partials')
  , MongoStore = require('connect-mongo')(express)
  , settings = require('./settings')
  , flash = require('./node_modules/flash.js');
var app = express();

app.configure(function(){
    // all environments
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(partials());
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session(
        {secret:settings.cookieSecret,
         store:new MongoStore({db:settings.db})
        }));
    //app.use(express.router(routes));
    app.use(flash());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(function(req,res,next){
        res.locals.user = req.session.user;
        next();
    }
    );
});
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes(app);

/*app.dynamicHelpers({
    user:function(req,res){
        return req.sesstion.user;
    },
    error:function(req,res){
        var err = req.flash('error');
        if(err.length){
            return err;
        }else{
            return null;
        }
    },
    success:function(req,res){
        var succ = req.flash('success');
        if(succ.length){
            return success;
        }else{
            return null;
        }
    }});
*/
/*
app.get('/', routes.index);
app.get('/u/:user',routes.user );
app.post('/post',routes.post);
app.get('/reg',routes.reg);
app.post('/reg',routes.doReg);
app.get('/login',routes.login);
app.post('/login',routes.doLogin);
app.get('/logout',routes.logout);
*/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
