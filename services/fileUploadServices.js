require('dotenv').config();
const AWS = require('aws-sdk');
const multer = require('multer');
const multers3 = require('multer-s3');
const accessKeyId = process.env.ACCESSID;
const secretKey = process.env.SECRETKEY;
const bucketName = process.env.BUCKETNAME;
AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretKey,
    Bucket: bucketName
})
const s3 = new AWS.S3();
const upload = multer({
    storage: multers3({
        s3: s3,
        bucket: bucketName,
        contentType: multers3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        metadata: (req, file, callback) => {
            console.log("file in multer", file);
            callback(null, {
                fieldName: 'Profile'
            })
        },
        key: (req, file, callback) => {
            callback(null, Date.now().toString());
        }
    })
})
module.exports = upload