var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    name:String,
    rating:Number,
    comment:String,
    created_at:{type:Date, default:Date.now}
});

var PlaceSchema = new Schema({
    name: String,
    description: String,
    country: String,
    categories: [String],
    imageUrl: String,
    reviews:[reviewSchema],
    avgRating:{type:Number, default:0},
    createdAt : {type: Date, default: Date.now}
   });


   module.exports = mongoose.model('Place', PlaceSchema);