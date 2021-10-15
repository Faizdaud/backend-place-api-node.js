var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-node');

var userSchema = new Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    created_at:{type:Date, default:Date.now}
});

//before saving user run the following function
userSchema.pre('save', function(callback) {
    var user = this;

    // Break out if the password hasn't changed
    // if there is no change in password .. return (save username and password)
    if (!user.isModified('password')){
        return callback();
    } 
    
    // Password changed so we need to hash it
    //generate a randoom 5 letters .. (salt)
    bcrypt.genSalt(5, function(err, salt) {

        //if there is an issue with salt generation, err
    if (err) {

        return callback(err);
    }
// hash the password and salt ... (encrpt password + salt)
    bcrypt.hash(user.password, salt, null, function(err, hash) {

    if (err) 
    {
        return callback(err)
    };
    user.password = hash;
    callback();
            });
        });
   });

   userSchema.methods.verifyPassword = function(password, cb){
       bcrypt.compare(password, this.password, function(err, isMatch){
           if (err) return cb(err);
           cb(null, isMatch);
       })
   }


module.exports = mongoose.model('User', userSchema);