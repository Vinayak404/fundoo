var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
var server = require('../server')
var fs = require('fs');

function readFile() {
    let data = JSON.parse(fs.readFileSync('/home/admin1/Desktop/Fundoo-Vinayak/test/test.json'));
    return data;
}
/**
 * @description:test script for registration 
 */
describe('Status and content', function () {
    describe('Registration page', function () {
        let data1 = readFile();
        it('status ', function (done) {
            chai.request(server).post('/user/register').send(data1.register).end((err, res) => {
                if (err) {
                    console.log("register test failed", err);
                    err.should.have.status(500);
                } else {
                    console.log("register passed test", res.body);
                    res.should.have.status(200);
                }
                done()
            })
        })
    })
    /**
     * @description:test script for login 
     */
    describe('Login test', () => {
        let data1 = readFile();
        it('status', (done) => {
            chai.request(server).post('/user/login').send(data1.login).end((err, res) => {
                if (err) {
                    console.log("login failed test", err);
                } else {
                    console.log("login passed test", res.body);
                    res.should.have.status(200);
                    done()
                }
            })
        })
    })
    /**
     * @description:test script for forgot password
     */
    describe('forgot password test', () => {
        let data1 = readFile();
        it('status for forgot pass', (done) => {
            chai.request(server).post('/user/forgotPassword').send(data1.forgotPassword).end((err, res) => {
                if (err) console.log("error at forgot pass", err);
                else {
                    console.log("forgot pass passed test", res.body);
                    res.should.have.status(200)
                    done()
                }
            })
        })
    })
    describe('reset password test', () => {
        let data1 = readFile();
        it('status for rest password', (done) => {
            chai.request(server).post('/user/resetPassword/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiNWRlNWYzODQwNWMzMGQxN2NjY2E4MThhIiwiaWF0IjoxNTc1MzU0NTM4LCJleHAiOjE1NzU0NDA5Mzh9.Qrg4akgydVLFWqeFzypORyerRPE3NpPkwgshUfhZ5kE').send(data1.resetPassword).end((err, res) => {
                if (err) console.log('error at reset pass', err);
                else {
                    console.log('reset password passed test', res.body);
                    res.should.have.status(200)
                    done()
                }
            })
        })
    })
})