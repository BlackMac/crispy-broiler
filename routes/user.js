const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const nodemailer = require("nodemailer");
const markdown = require('nodemailer-markdown').markdown;
const config = require('../config/config')
const fs = require('fs');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SERVER,
  port: 587,
  secure: false, // true for 465, false for other ports
  requireTLS:true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  dkim: {
    domainName: process.env.MAIL_DKIM_DOMAIN,
    keySelector: process.env.MAIL_DKIM_KEYSELECTOR,
    privateKey: process.env.MAIL_DKIM_PK
  }
});

transporter.use('compile', markdown())

async function sendMail(address, key) {
  let info = await transporter.sendMail({
    from: `"${config.app.name}" <${config.app.email}>`, // sender address
    to: address, // list of receivers
    subject: `A warm welcome from ${config.app.name}`, // Subject line
    markdown: require('../views/emails/signup')({key})
  });
  console.log(info);
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
  if (!req.body.email.match(/^\w+([\.-]?[\w\+]+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
    return res.render('errors/invalid-email')
  }
  var user = new User();
  
  user.account.email = req.body.email;
  user.save().then(() => {
    var fqdn = req.protocol + '://' + req.get('host');

    sendMail(user.account.email, `${fqdn}/user/activate/${user.account.activationcode}`);
    return res.render('user/verify-start', {email: user.account.email, title:"Check your Inbox"});
  }).catch((err) => {
    if (err.code==11000) {
      return res.render('errors/user-exists')
    }
    next(err);
  })
  
});

router.get('/activate/:id', function(req, res, next) {
  res.render('user/activate', { title: 'Activate Account' });
});

router.post('/activate/:id', function(req, res, next) {
  res.render('user/activate', { title: 'Activate Account' });
});
module.exports = router;
