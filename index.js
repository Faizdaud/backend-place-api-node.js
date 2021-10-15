//Boilerplate code for API( NOde + express + mongoose)

const express = require('express'); // call express
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Place = require('./place');
const User= require('./user');
const app = express(); // define our app using express
const router = express.Router(); 
const port = process.env.PORT || 8080; // set our port
var jwt = require('jsonwebtoken');
var config = require('./config');
var auth = require('./auth')();


//connect mongoose(an npm package) to mongoDB
mongoose.connect("mongodb+srv://api-user:abcd1234@cluster0.qqcjp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");


//get data from body
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());



router.get('/', function(req, res) {
 res.json({ message: 'hooray! welcome to our api!' }); 
});

//create data in mongodb C
router.route('/places').post( function(req, res) {
    var place = new Place(); 
    place.name = req.body.name; 
    place.description = req.body.description;
    place.country = req.body.country;
    place.categories = req.body.categories;
    place.imageUrl = req.body.imageUrl; // will add to place schema later on

    place.save(function(err) {
    if (err)
    res.send(err);
    res.json({ message: 'A new place has been created!' });
    });
 });


 //Read Data find all data, R
 router.get('/places', function(req, res) {
        Place.find(function(err, places) {
        if (err)
        res.send(err);
        res.json(places);
        });
    });

//Find Data by ID
// router.route('/places/:id').get( function(req, res) {
//     Place.findById(req.params.id, function(err, place) {
//     if (err)
//     res.send(err);
//     else{
//         res.json(place);
//     }
  
//         })
//     });


//Update Data
router.route('/places/:id').get( function(req, res) {
    Place.findById(req.params.id, function(err, place) {
    if (err)
    res.send(err);
    else{
        res.json(place);
    }
  
        })
    }).put(function(req, res){
    Place.findById(req.params.id, function(err, place) {
        if (err)
        res.send(err);
        else{
            place.name = req.body.name; 
            place.description = req.body.description;
            place.country = req.body.country;
            place.categories = req.body.categories;
            place.imageUrl = req.body.imageUrl; // will add to place schema later on
        
            place.save(function(err) {
            if (err)
            res.send(err);
            res.json({ message: ' Place has been updated Sucessfully' });
            });
        }
       
    })
})

//Delete Data. Still using router.route('/places/:id') but as a continued function chain 
.delete(function(req, res) {
    Place.remove({
    _id: req.params.id
    }, function(err, place) {
    if (err)
    res.send(err);
    res.json({ message: 'Successfully deleted' });
        });
    });



//Post Reviews
//User Input review after a place is already created use route '/places/:place_id/reviews'
/////////////////////////////////////////////////////
router.route('/places/:place_id/reviews')
.post(function(req, res){
    Place.findById(req.params.place_id, function(err, place){
        if (err) {
            res.send(err);
        }else {
            //Modify somewhere below the code to calculate the average rating
            var newReview = {
                name:req.body.name,
                rating:req.body.rating,
                comment:req.body.comment
            }

            var newRating = (place.avgRating * place.reviews.length) + req.body.rating /(place.reviews.length + 1);
            place.avgRating = newRating;

            place.reviews.push(newReview);

            place.save(function(err){
                if (err) {
                    res.send(err);
                }
                else {
                    res.json({message:"Review sucessfully added!"})
                }
            })
        }
    })
})
//Update Reviews
//Need to Fix , does not update to db
router.route('/places/:place_id/reviews/:review_id')
.put(function(req, res){
    Place.findById(req.params.place_id, function(err, place){
        if (err){
            res.send;
        }else {
            for(var i=0; i<place.reviews.length; i++){
    
                if(place.reviews[i]._id == req.params.review_id){

                    var newAvgRating = ((place.avgRating * place.reviews.length) + req.body.rating - place.reviews[i].rating ) /(place.reviews.length + 1);

                    place.reviews[i].avgRating = newAvgRating;
                    place.reviews[i].name = req.body.name;
                    place.reviews[i].rating = req.body.rating
                    break;
                }
            }

            place.save(function(err){
                if (err) {
                    res.send(err)
                }else {
                    res.json({message: "sucessfully updated"})
                }
            })
            
        }
    })
})

//Delete Reviews

.delete(function(req, res){
    Place.findById(req.params.place_id, function(err, place){
        if (err) {
            res.send(err);
        }else {

            for(var i=0; i<place.reviews.length; i++){
                //delete review from array
                if(place.review[i] = req.body.review_id){
                    place.reviews.splice(i,1);

                    var newAvgRating = ((place.avgRating* place.reviews.length) - place,reviews.rating) /(place.reviews.length - 1);
                    place.avgRating = newAvgRating;

                    place.save(function(err){
                    
                        if(err){
                            res.send(err);
                        }else {
                            res.json({message:"Sucessfully delete review"})
                        }
                    })
                }
            }
        }

    })

})

// must use /api/sum after localhost
//get data from body and perform sum operation

router.post('/sum', (req,res) => {
    var num1 = req.body.num1;
    var num2 = req.body.num2;

    var sum = num1 + num2;

    res.json({
        message : "the sum is " + sum
    })

})

//Create
router.post('/register', function(req, res){
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.save(function(err){
        if(err){
            res.send(err);
        }else{
            res.json({message:"User sucessfullt registered!"});
        }
    })

})


//Create
router.post('/login', function(req, res){

    User.findOne ({username: req.body.username},
        function(err, user){
            if(err){
                res.send(err);
            }else{
                    //check if password match
                if(user){
                    user.verifyPassword(req.body.password, function(err, isMatch){
                        if(isMatch && !err){
                            var token = jwt.sign(user.toJSON(), config.secret,
                            {
                                expiresIn: 10800 //3 hours
                            })
                            res.json({sucess:true, token: 'JWT' + token })
                        } else{
                            res.send({ success: false, message: 'Authentication Failed'})
                        }
                    })

                } else{
                    res.send({message:"User not found"})
                }

        }
        
  
        });
})

//prefix all api with /api
//buat semua url wajib ada /api di depan for it to work
app.use('/api', router);

app.listen(port);

console.log('Magic happens on port ' + port);