const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); //parolayı şifrelemek için kullandık
const Schema = mongoose.Schema;

//OverwriteModelError: Cannot overwrite `User` model once compiled. hatası için her sistem başladığında modeli sıfırlıyoruz
if (mongoose.models.User) {
  delete mongoose.models.User
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum:["student", "teacher", "admin"],
    default: "student"
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
});

UserSchema.pre('save', function(next) {
    const user = this;
    bcrypt.hash(user.password, 10 , (error,hash) => {
        user.password = hash;
        next();
    });
});

const User =  mongoose.model('User', UserSchema);
module.exports = User;

