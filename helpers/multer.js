const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update({
    secretAccessKey: process.env.SECRETKEY,
    accessKeyId: process.env.ACCESSID,
    // region: 'us-east-1'
});

const s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.BUCKETNAME,
        acl: 'public-read',
        metadata: (req, file, cb)=> {
            cb(null, {
                fieldName: 'TESTING_META_DATA!'
            });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})

module.exports = upload