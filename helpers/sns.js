let schedule = require('node-schedule')
const AWS = require('aws-sdk');
const services = require('../services/notesServices')
exports.reminderSchduler = (req) => {
    console.log("HEReIN SSN", req.reminder);
    console.log("EMAILLL", req.email);

    var date = new Date(req.reminder);
    console.log("DATE", date);

    schedule.scheduleJob(date, () => {
        console.log("hiii");
        const msg = {
            "index": "hello",
            "name": "this is ur reminder"
        }
        this.notification(msg)
            .then((data) => {
                console.log(data, "data");
            })
            .catch((e) => {
                console.log("err", e);

            })

    })
}
exports.notification = (details) => {
    return new Promise((resolve, reject) => {
        console.log("notification", details.name);
        AWS.config.getCredentials((err, data) => {
            if (err) console.log(err)
            else {
                console.log("Access key:", AWS.config.credentials.accessKeyId);
                console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
            }
        });
        AWS.config.update({
            region: process.env.AWS_REGION
        });
        let params = {
            Message: `You have a reminder : ${details.name} and title : ${details.index}`,

            TopicArn: process.env.AWS_TOPIC_ARN
        };

        let publishTextPromise = new AWS.SNS().publish(params).promise();

        publishTextPromise.then((data) => {
            console.log(`message ${params.Message} send sent to the topic ${params.TopicArn}`);
            console.log("MessageID is ", data.MessageId);
            resolve(data)
        }).catch((err) => {
            reject(err)
            console.log(err, err.stack);
        });
    })
}

// this.reminderSchduler()
// exports.scheduleReminder =(req) => {
//     let details;
//     console.log("reqqq---<", req.email);
//     console.log("reqqq---<", req.resolve.reminder);

//     let email=req.email;
//     return new Promise((resolve, reject) => {
//          let date2 = new Date(req.reminder);
//         //  console.log("reminder date--->",date);

//         var prp = new Date(2020, 0, 14, 12, 15, 0);
//         console.log("Prprrp-0",prp);
//                 console.log("date--->",date2);

//         var j = schedule.scheduleJob(date2,  function () {
//                         console.log('The world is going to end today.');
//                 console.log("true");
//                 const arr={

//                     "index":"pradeep",
//                     "name":"amin"
//                   }

//                                   noteCon.resData("You have one reminder")
//                   sns.notification(arr,email);
//                   resolve('triggered')

//                                     })
//     });
// }