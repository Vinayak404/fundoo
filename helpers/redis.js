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
exports.deCacheNote = (id, callback) => {
    client.del(process.env.CACHEKEY + id, (err, data) => {
        if (err) callback(err)
        else callback(data);
    })
}
exports.cacheNotes = (data, callback) => {
    client.set(process.env.CACHEKEY + data.id, JSON.stringify(data.notes), (err, data) => {
        if (err) callback(err), console.log('cahce note falied');
        else callback(null, data)
    })
}
exports.getCacheNotes = (id, callback) => {
    client.get(process.env.CACHEKEY + id, (err, data) => {
        if (data) {
            let token = JSON.parse(data)
            callback(null, token);
            console.log('cached data');

        } else callback(err), console.log('cachenote not found');
    })
}