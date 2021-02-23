var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/user/login');
});

/*
  Log IN
*/
router.get('/login', function(req, res, next) {
  res.render('user/login', { 
    title: 'Sign In',
    show_password_forgotten_link: true });
});

router.post('/login', function(req, res, next) {
  return res.send(req.body.email+"-"+req.body.password);
});

/*
  Password reset
*/
router.get('/reset', function(req, res, next) {
  res.render('user/reset', { title: 'Reset Password' });
});


/*
  sign up
*/
router.get('/signup', function(req, res, next) {
  res.render('user/signup', { title: 'Create Account' });
});

router.post('/signup', function(req, res, next) {
  return res.send(req.body.email+"-"+req.body.password);
});
module.exports = router;
