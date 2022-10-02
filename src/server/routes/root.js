export default (req, res) => {
    if (!req.user || !req.isAuthenticated()) {
        // Not logged in yet.
        res.render('login');
    } else {
        res.render('home', {token: 'test'});
    }
};
