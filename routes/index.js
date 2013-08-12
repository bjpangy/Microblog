
/*
 * GET home page.
 */

/*
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.user = function(req,res){
};

exports.post = function(req,res){
};
exports.reg = function(req,res){
};
exports.doReg = function(req,res){
};
exports.login = function(req,res){
};
exports.doLogin= function(req,res){
};
exports.logout= function(req,res){
};
*/

var crypto = require('crypto');
var User = require('../model/user.js');

module.exports = function(app){
    app.get('/',function(req,res){
        res.render('index',{title:'Home'});
    });

    app.get('/reg',function(req,res){
        res.render('reg',{title:'Reg'})
    });

    app.post('/reg',function(req,res){
       console.log('doreg');
        //check password same
        if(req.body['password-repeat'] != req.body['password']){
            req.flash('error','password should same');
            return res.redirect('/reg');
        }

        //crypto password
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');

        var newUser = new User({
            name: req.body.username,
            password:password,
        });

        //check user exists
        User.get(newUser.name,function(err,user){
            if(user)
                err = 'username already exists';
            if (err){
                req.flash('error',err);
                return res.redirect('/reg');
            }
        
        //add user
        newUser.save(function (err){
            if (err){
                req.flash('error',err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.flash('success','registered successfully');
            res.redirect('/');
        });
      })
     }//post callback fun
    );//post
};//exports
