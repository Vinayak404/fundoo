const redis = require('redis')
let client = redis.createClient();
client.on('connected', () => {
    console.log('cache connected');
})
client.on('error', () => {
    console.log('error in connecting cache');
})
exports.addCache = (data, callback) => {
    client.set(process.env.CACHEKEY, JSON.stringify(data), (err, data) => {
        if (err) callback(err)
        else callback(null, data)
    })
}
exports.getCache = (callback) => {
    client.get(process.env.CACHEKEY, (err, data) => {

        if (data) {
            let token = JSON.parse(data)
            callback(null, token);
        } else callback(err);

    })

}
exports.deCache = () => {
    client.del(process.env.CACHEKEY, (err, data) => {
        if (err) console.log(err)
        else console.log(`deleted from cache ${data}`);
    })
}