module.exports = (opts) => {
    return (req, res, next) => {
        console.log(req);
        next();
    }
};