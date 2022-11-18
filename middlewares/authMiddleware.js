const User = require('../models/User');

////giriş yapmadan dashboard sayfasına adres sattırından ulaşmaya çalışılırsa login yönlendirme yapar.
module.exports = (req, res, next) => {
  User.findById(req.session.userID, (err, user) => {
    if (err || !user) return res.redirect('/login');
    next();
  });
};
