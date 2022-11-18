////giriş yaptıktan sonra login ve resgister sayfasına adres sattırından ulaşmaya çalışılırsa anasayfaya yönlendirme yapar.

module.exports = (req, res, next) => {
  if (req.session.userID) {
    return res.redirect('/');
    next();
  }
};
