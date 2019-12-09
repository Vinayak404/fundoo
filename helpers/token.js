const jwt = require('jsonwebtoken');
const redis = require('redis')
const redisCache = require('./redis')
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
exports.userVerify = (req, res, next) => {
    redisCache.getCache((err, data) => {
        if (data) {
            console.log('token in middleware---->', data.token);

            jwt.verify(data.token, process.env.KEY, (err, result) => {
                if (err) res.status(422).send({
                    message: "incorrect token!!"
                });
                else {
                    req.decoded = result;
                    console.log('resulttoken---------', result);
                    next();
                }
            });
        } else console.log('error', err);

    });
};