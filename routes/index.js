var express = require('express');
var router = express.Router();
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;


var url = "mongodb://localhost:27017/";


/* GET home page. *///
router.get('/', function (req, res, next) {
  // res.json({ test: "express" })

  MongoClient.connect(url, { useUnifiedTopology: true },
    function (err, db) {
      if (err) {
        throw err;
      }
      else {
        var dbo = db.db("mydb");
        dbo.collection('habstores').find().toArray(function (err, result) {
          if (err) {
            throw err;
          }
          else {
            res.json({ data: result });
            res.end();
            db.close();
          }
        });
      }
    });


});


router.patch('/checkout', function (req, res, next) {

  console.log(req.body.items[0].name);

  req.body.items.map(item => {

    MongoClient.connect(url, { useUnifiedTopology: true },
      function (err, db) {
        if (err) {
          throw err;
        }
        else {
          var dbo = db.db("mydb");
          dbo.collection('habstores').updateOne({ name: item.name },
            {
              $inc: { "no_of_items": -1 },
            });
        }
      });

    res.send("success");

  });


});


router.post('/wishlist', function (req, res, next) {

  MongoClient.connect(url, { useUnifiedTopology: true },
    function (err, db) {
      if (err) {
        throw err;
      }
      else {
        var dbo = db.db("mydb");
        dbo.collection('wishlist').insertOne(req.body);
      }
      res.send("success");


    });

});

router.get('/wishlist', function (req, res, next) {

  MongoClient.connect(url, { useUnifiedTopology: true },
    function (err, db) {
      if (err) {
        throw err;
      }
      else {
        var dbo = db.db("mydb");
        dbo.collection('wishlist').find().toArray(function (err, result) {
          if (err) {
            throw err;
          }
          else {
            res.json({ data: result });
            res.end();
            db.close();
          }
        });
      }
    });


});



router.delete('/wishlist', function (req, res, next) {

  MongoClient.connect(url, { useUnifiedTopology: true },
    function (err, db) {
      if (err) {
        throw err;
      }
      else {
          console.log(req.body);
          console.log("request header");
          console.log(req.query);
        var dbo = db.db("mydb");
        dbo.collection('wishlist').deleteOne({
          "_id":req.query._id
        });
      }

      res.send("success");


    });

});



router.post('/signup', function (req, res, next) {

    console.log(req.body);

  MongoClient.connect(url, { useUnifiedTopology: true },
    function (err, db) {
      if (err) {
        throw err;
      }
      else {
        var dbo = db.db("mydb");
        dbo.collection('users').insertOne(req.body);
      }
      res.send("success");


    });

});

module.exports = router;
