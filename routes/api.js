var express = require('express');
var Boat = require('../data/models/boat')
var router = express.Router();
/* GET home page. */
router.get('/boats', function(req, res, next) {
  return Boat.find({}, function(cb, ca) {
    return res.send(ca);
  });
});

router.get('/boats/add', function(req, res, next) {
  const boat = new Boat({
    name: "Wurst"
  });
  boat.save(function () {
    return res.send("OK");
  })
});

module.exports = router;
