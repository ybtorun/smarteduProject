//giriş yaptıktan sonra login ve register sayfasına adres sattırından ulaşmaya çalışılırsa bu özel middleware anasayfaya yönlendirme yapar.

module.exports = (req, res, next) => {
  if (req.session.userID) {
    return res.redirect('/');   
  }
  next();
};
