export default (req, res) => {
    console.log(req.body);
    res.redirect('/app');
};
