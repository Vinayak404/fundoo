const jwt = require('jsonwebtoken');
const redis = require('redis')
let client = redis.createClient();
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

    client.SETEX('mytoken', 5000, obj)
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
    // console.log("REG from token--------->", req);
    console.log("Verifying request",client.get('mytoken').token);

    var token = client.get('mytoken').token;
    jwt.verify(token, process.env.KEY, (err, result) => {
        if (err) res.status(422).send({
            message: "incorrect token!!"
        });
        else {
            req.decoded = result;
            console.log('resulttoken---------', result);
            next();
        }
    });
};