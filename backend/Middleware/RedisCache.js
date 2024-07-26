module.exports = (req, res, next) => {
    const { userId } = req;

    req.redis.get(userId, (err, data) => {
        if (err) throw err;
        console.log("data", data);
        if (data !== null) {
            res.send(data);
        } else {
            next();
        }
    });
};