export default (logger) => {
    return (req, res) => {
        // User has logged in.
        logger.info('User has logged in.');
        req.session.save(() => {
          res.redirect('/');
        });
    }
}
