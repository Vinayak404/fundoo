const userServices = require('../services/userServices');
exports.register = (req, res) => {
    console.log("erq", req.body);

    try {
        console.log("erq", req.body);

        req.checkBody('firstName', 'invalid firstName').notEmpty().isAlpha();
        req.checkBody('lastName', 'invalid lastName').notEmpty().isAlpha();
        req.checkBody('email', 'invalid email').notEmpty().isEmail();
        req.checkBody('password', 'invalid password').len(6, 12);
        let error = req.validationErrors();
        let response = {}
        if (error) {
            response.success = false;
            response.error = error;
            res.status(422).send(response)
        } else {
            userServices.register(req, (err, data) => {
                if (err) {
                    response.success = false;
                    response.data = err
                    res.status(404).send(err);
                } else {
                    response.success = true;
                    response.data = data
                    res.status(200).send(data);
                }
            })
        }
    } catch (e) {
        console.log(e);

    }
}
exports.login = (req, res) => {
    try {
        req.checkBody('email', 'invalid email').notEmpty().isEmail();
        req.checkBody('password', 'invalid password').notEmpty().len(6, 12);
        let error = req.validationErrors();
        let response = {}
        if (error) {
            response.success = false;
            response.error = error;
            res.status(422).send(response)
        } else {
            userServices.login(req, (err, data) => {
                if (err) {
                    response.success = false;
                    response.data = err
                    res.status(404).send(err);
                } else {
                    response.success = true;
                    response.data = data
                    res.status(200).send(data);
                }
            })
        }
    } catch (e) {
        console.log(e);

    }
}