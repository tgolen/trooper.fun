export default (req, res) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.session.destroy();
      res.redirect('/');
    });
};
