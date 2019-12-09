const userServices = require('../services/userServices');
const token = require('../helpers/token');
const nodeMailer = require('../helpers/nodeMailer');
const redis = require('redis')
const redisCache = require('../helpers/redis');
exports.register = (req, res) => {
    try {
        console.log("register", req.body);

        req.checkBody('firstName', 'invalid firstName').notEmpty().isAlpha();
        req.checkBody('lastName', 'invalid lastName').notEmpty().isAlpha();
        req.checkBody('email', 'invalid email').notEmpty().isEmail();
        req.checkBody('password', 'invalid password').len(6, 12);
        req.checkBody('confirmPassword', 'passwords dont match').len(6, 12).equals(req.body.password);
        let error = req.validationErrors();
        let response = {};
        if (error) {
            response.success = false;
            response.error = error;
            res.status(422).send(response)
        } else {
            userServices.register(req, (err, data) => {
                if (err) {
                    response.success = false;
                    response.data = err
                    res.status(404).send(response);
                } else {
                    response.success = true;
                    response.data = data
                    res.status(200).send(response);
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
                if (data) {
                    response.success = true;
                    const tok = token.tokenGenerator({
                        "email": req.body.email,
                        "id": data._id
                    })
                    redisCache.addCache(tok, (err, data2) => {
                        if (err) {
                            response.err = err;
                            response.success = false
                            res.status(422).send(response)
                        } else {
                            response.success = true
                            response.data = data2;
                            res.status(200).send(response);
                        }
                    })
                } else {
                    response.success = false;
                    response.err = err
                    res.status(404).send(response);
                }
            })
        }
    } catch (e) {
        console.log(e);

    }
}
exports.forgotPassword = (req, res) => {
    try {
        req.checkBody('email', 'Invalid email!').notEmpty().isEmail();
        let error = req.validationErrors();
        let response = {}
        if (error) {
            response.success1 = false;
            response.error = error;
            res.status(404).send(response)
        } else {
            userServices.forgotPassword(req, (err, data) => {
                if (err) {
                    response.success2 = false;
                    response.error = err;
                    res.status(404).send(response)
                } else {
                    let payload = data._id;
                    console.log(payload);
                    let obj = token.tokenGenerator(payload)
                    let token1 = obj.token
                    console.log(token1);
                    nodeMailer.sendMail(token, req.body.email)
                    response.success = true;
                    response.data = data;
                    res.status(200).send(response);
                }
            })
        }
    } catch (e) {
        console.log(e);
    }
}
exports.resetPassword = (req, res) => {
    req.checkBody('password', 'password must be 6-12 chars long!!').notEmpty().len(6, 12).equals(req.body.confirmPassword);
    req.checkBody('confirmPassword', 'password must be 6-12 chars long!!').notEmpty().len(6, 12);
    console.log(req.body);

    let error = req.validationErrors();
    let response = {};
    if (error) {
        response.success1 = false
        response.error = error
        res.status(400).send(response)
    } else {
        if (req.body.password != req.body.confirmPassword) {
            response.success2 = false
            response.error = "passwords don't match"
            res.status(400).send(response)
        } else {
            userServices.resetPassword(req, (err, data) => {
                if (err) {
                    response.success3 = false
                    response.error = err
                    res.status(404).send(response)
                } else {
                    response.success4 = true
                    response.data = data
                    res.status(200).send(response)
                }
            })
        }
    }
}

const upload = require('../helpers/multer');
const singleUpload = upload.single('image');
exports.uploadpic = (req, res) => {

    singleUpload(req, res, (err, data) => {
    
        if (err) {
            return res.status(422).send({
                errors: [{
                    title: 'File Upload Error',
                    detail: err.message
                }]
            });
        } else {
            let imageURL = req.file.location
            console.log(req.file.location);
            userServices.uploadImage(req, imageURL, (err, result) => {
                let response = {}
                if (err) {
                    console.log('err');
                    response.err = err;
                    response.success = false;
                    res.status(404).send(response);
                } else {
                    response.result = result;
                    response.success = true;
                    response.imageurl = req.file.location
                    res.status(200).send(response);
                }
            })

        }
    })
}