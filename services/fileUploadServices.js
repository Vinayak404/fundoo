require('dotenv').config();
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const accessKeyId = process.env.ACCESSID;
const secretAccessKey = process.SECRETKEY;
const Bucket = process.env.BUCKETNAME;

AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    Bucket: Bucket,
    // region: 'ap-south-1'
})
const s3 = new AWS.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: Bucket,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            // console.log("req in multer", file);
            cb(null, {
                fieldName: 'Profile'
            });
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString())
        }
    })
})
module.exports = upload;