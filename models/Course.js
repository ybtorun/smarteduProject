const mongoose = require('mongoose');
const slugify = require('slugify');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true, //baştaki ve sondaki boşlukları kaldırmaya yarıyor
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Category'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
});

//slugify ile db ye kaydı eklemeden önce kurs ismine göre bir slug oluşturuyoruz ve bunu adres satırında id yerine kullanıyoruz. 
CourseSchema.pre('validate', function(next){
  this.slug = slugify(this.name, {
    lower: true, //hepsini küçük harf yap
    string: true, //string dışındaki karakterleri yoksay
  });
  next();
})

const Course =mongoose.model('Course',CourseSchema);
module.exports= Course;