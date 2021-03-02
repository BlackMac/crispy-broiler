var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/imprint', function(req, res, next) {
  res.render('imprint', { title: 'Imprint' });
});

module.exports = router;
