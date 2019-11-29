const userServices = require('../services/userServices');
exports.register = (req, res) => {
    req.checkBody("firstName", "invalid firstName;").notEmpty();
    req.checkBody("lastName", "invalid lastName;").notEmpty();
    req.checkBody("email", "invalid email;").isEmail();
    req.checkBody("password", "invalid password").len(8, 12);
}
let error = req.validationErrors();
var response = {}
if (error) {
    response.success = false;
    response.error = error;
    res.status(422).send(response)
} else {
    userServices.register(req, (err, data) => {
        if (err) {
            res.status(404).send(err);
        } else {
            res.status(200).send(data);
        }
    })
}