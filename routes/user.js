const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const nodemailer = require("nodemailer");
const markdown = require('nodemailer-markdown').markdown;
const transporter = nodemailer.createTransport({
  host: "s02.speicherzentrum.de",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "web2053p1", // generated ethereal user
    pass: "yhDh1slK", // generated ethereal password
  },
});

transporter.use('compile', markdown())

async function sendMail(address, key) {
  let info = await transporter.sendMail({
    from: '"Crispy Broiler" <foo@example.com>', // sender address
    to: address, // list of receivers
    subject: "A warm welcome from Crispy Broiler", // Subject line
    markdown: `# Hello world!\n\nThis is a **markdown** message ${key} `
  });
}

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
  console.log(res)
  if (!req.body.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
    return res.render('errors/invalid-email')
  }
  var user = new User();
  user.account.email = req.body.email;
  user.save().then(() => {
    var fqdn = req.protocol + '://' + req.get('host');

    sendMail(user.account.email, `${fqdn}/user/activate/${user.account.activationcode}`);
    res.send(req.body.email+"-"+req.body.password);
  }).catch((err) => {
    if (err.code==11000) {
      return res.render('errors/user-exists')
    }
    next(err);
  })
  
});
module.exports = router;
