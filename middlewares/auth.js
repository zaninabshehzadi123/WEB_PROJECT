const Authentication = (req, res, next) => {
    if (!req.session.admin) {
        return res.redirect("/signin");
    }
    next();
};

module.exports = { Authentication };