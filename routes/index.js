var express = require('express');
var router = express.Router();
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;


var url = "mongodb://localhost:27017/";


/* GET home page. */
router.get('/', function (req, res, next) {
  // res.json({ test: "express" })

  MongoClient.connect(url, { useUnifiedTopology: true },
    function (err, db) {
      if (err) {
        throw err;
      }
      else {
        var dbo = db.db("mydb");
        dbo.collection('habstores').find().toArray( function (err, result) {
          if (err) {
            throw err;
          }
          else {
            res.json({data:result});
            res.end();
            db.close();
          }
        });
      }
    });
  

});


router.post('/checkout', function (req, res, next) {

  console.log(req.body.items[0].name);

  req.body.items.map(item =>{

    MongoClient.connect(url, { useUnifiedTopology: true },
      function (err, db) {
        if (err) {
          throw err;
        }
        else {
          var dbo = db.db("mydb");
          dbo.collection('habstores').updateOne({name:item.name}, 
            {
                $inc : {"no_of_items":-1},
            });
        }
      });

  });


});


router.delete('/delete', function (req, res, next) {

  fs.unlink(`/home/divya/workspace/stuff/nodejs/express_filecrud/${req.query.params}.txt`, (err) => {
    if (err) throw err;
    res.json({ filecontent: 'path/file.txt was deleted' })

  });
});


module.exports = router;
