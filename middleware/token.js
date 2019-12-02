const jwt = require('jsonwebtoken');
exports.tokenGenerator = (payload) => {
    const token = jwt.sign({
            payload
        },
        process.env.KEY, {
            expiresIn: '24h'
        });
    const obj = {
        message: "token Generated successfully!",
        token: token
    }
    return obj;
};
exports.verify = (req, res, next) => {
    console.log("Verifying request", process.env.KEY);
    var token = req.params.token;
    jwt.verify(token, process.env.KEY, (err, result) => {
        if (err) res.status(422).send({
            message: "incorrect token!!"
        });
        else {
            req.decoded = result;
            console.log(result);
            next();
        }
    });
};