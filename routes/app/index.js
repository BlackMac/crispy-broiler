var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.session.user) {
    return res.render("app/index", {title: "Dashboard"});
  }
  res.redirect('/user/login');
});

module.exports = router;