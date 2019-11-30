const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})
const user = mongoose.model("user", userSchema);
exports.register = (req, callback) => {
    user.findOne({
        email: req.body.email
    }, (err, data) => {
        if (data) {
            callback("user already exists")
        } else {
            if (err) {
                console.log('failed at model backend', err);

            } else {
                bcrypt.hash(req.body.password, 10, (err, encrypted) => {
                    let user1 = new user({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: encrypted
                    })
                    user1.save((err, data) => {
                        if (err) {
                            console.log('failed to save to db', err);
                            callback(err)
                        } else {
                            console.log('saved in the database', data);
                            callback(null, data);
                        }
                    })

                })
            }
        }
    })
}
exports.login = (req, callback) => {
    user.findOne({
        email: req.body.email
    }, (err, data) => {
        if (data) {
            bcrypt.compare(req.body.password, data.password, (err, success) => {
                if (success)
                    callback(null, data);
                else
                    callback("password is incorrect", err);
            })
        } else callback("user not in database");
    })

}
exports.forgotPassword = (req, callback) => {
    user.findOne({
        email: req.body.email
    }, (err, data) => {
        if (data) {
            callback(null, data)
            console.log(data);
        } else {
            callback(err)
            console.log("user not found!");
        }
    })
}
exports.resetPassword = (req, callback) => {
    bcrypt.hash(req.body.password, 10, (err, encrypted) => {
        if (err) {
            callback(err)
            console.log("error in salting!!");
        } else {
            user.updateOne({
                _id: req.decoded.payload
            }, {
                password: encrypted
            }, (err, data) => {
                if (err) {
                    callback(err)
                    console.log("error in updating password!!");
                } else {
                    callback(null, data)
                    console.log('updated password successfully!!', data);

                }
            })
        }
    })
}