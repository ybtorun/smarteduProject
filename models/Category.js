const mongoose = require('mongoose');
const slugify = require('slugify');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  }
});

//slugify ile db ye kaydı eklemeden önce kurs ismine göre bir slug oluşturuyoruz ve bunu adres satırında id yerine kullanıyoruz. 
CategorySchema.pre('validate', function(next){
  this.slug = slugify(this.name, {
    lower: true,
    string: true,
  });
  next();
})

const Category =mongoose.model('Category',CategorySchema);
module.exports= Category;