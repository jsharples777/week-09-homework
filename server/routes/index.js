const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get("/ping", function(req,res) {
    res.status(200).send("pong!");
})

router.get("/test", (req, res) => {
    console.log("url: " + req.url);
    res.send("Hello World");
});

module.exports = router;