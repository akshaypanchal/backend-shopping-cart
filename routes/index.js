var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


// bcrypt.compare(hash, hash1, function(err, result){
//   console.log(result);
// })


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
            res.status(200).json({ data: result });
            // res.status(200);
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
          // res.status(409).send(err);
          throw err;
        }
        else {
          var dbo = db.db("mydb");
          dbo.collection('habstores').updateOne({ name: item.name },
            {
              $inc: { "no_of_items": -1 },
            });

          // res.status(200).send("success");
        }
      });

    res.status(200).send("success");

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
      res.status(201).send("success");


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
            res.status(200).json({ data: result });
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
          "_id": req.query._id
        });
      }

      res.status(204).send("success");


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
      res.status(201).send("success");


    });

});


router.post("/login", function (req, res, next) {

  let email = req.body.email;
  let password = req.body.password;



  MongoClient.connect(url, { useUnifiedTopology: true },
    function (err, db) {
      if (err) {
        throw err;
      }
      else {
        var dbo = db.db("mydb");
        dbo.collection('users').find({ $and: [{ "email": email }, { "password": password }] }).toArray(function (err, result) {
          if (err) {
            throw err;
          }
          else {
            // res.status(200).json({ data: result }););
            if (result.length > 0) {
              console.log("function called");

              const token = jwt.sign(
                // payload
                { user: email },
                // sercret key
                "dreams",
                // header 
                {
                  algorithm: "HS256",
                  expiresIn: 3600   //seconds
                }
              )

              // set it the response's cookie
              res.cookie('AuthToken', token, { maxAge: 3600 * 1000 });
              res.redirect('/shopping');

            }
            else {
              res.send("Invalid login details");
            }

            // res.status(200);
            res.end();
            db.close();
          }
        });
      }
    });





});




module.exports = router;
