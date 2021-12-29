
 import request from 'supertest';
 import { app } from '../app';
 import { DrivingSchoolApi, Text } from '@driving/planning-client-api';
import { check } from 'express-validator';


 jest.setTimeout(20000)
 let apiV1SchoolsPost: jest.Mock;

describe('Test School creation page', () => {

    beforeAll(() => {

        apiV1SchoolsPost = jest.fn().mockResolvedValue(Promise.resolve({
            body: new Text()
        }));

        DrivingSchoolApi.prototype.apiV1SchoolsPost = apiV1SchoolsPost
    })

    test('Show school page', done => {
        request(app)
            .get('/school')
            .then(resp => {
                expect(resp.statusCode).toBe(200);
                done();
            })
    });

    test('Create school with invalid params', done => {
        request(app)
            .post('/school')
            .send({name: 'test'})
            .then(resp => {
                expect(resp.statusCode).toBe(200)
                expect(apiV1SchoolsPost).toBeCalledTimes(0)
                done()
            })
    });

    test('Create school with invalid email', done => {
        request(app)
            .post('/school')
            .send({
                name: 'test', 
                phoneNumber: '147852369', 
                path: '1 rue descartes', 
                postalCode: '58741',
                town: 'city',
                email: 'toto',
                password: 'pwdtochange'
            })
            .then(resp => {
                expect(resp.statusCode).toBe(200)
                expect(apiV1SchoolsPost).toBeCalledTimes(0)
                done()
            })
    });

    test('Create school with invalid postalCode', done => {
        request(app)
            .post('/school')
            .send({
                name: 'test', 
                phoneNumber: '147852369', 
                path: '1 rue descartes', 
                postalCode: 'test',
                town: 'city',
                email: 'toto@toto.com',
                password: 'pwdtochange'
            })
            .then(resp => {
                expect(resp.statusCode).toBe(200)
                expect(apiV1SchoolsPost).toBeCalledTimes(0)
                done()
            })
    });

    test('Create school with invalid phoneNumber', done => {
        request(app)
            .post('/school')
            .send({
                name: 'test', 
                phoneNumber: '1478523', 
                path: '1 rue descartes', 
                postalCode: 'test',
                town: 'city',
                email: 'toto@toto.com',
                password: 'pwdtochange'
            })
            .then(resp => {
                expect(resp.statusCode).toBe(200)
                expect(apiV1SchoolsPost).toBeCalledTimes(0)
                done()
            })
    });

    test('Create school with rights params', done => {
        request(app)
            .post('/school')
            .send({
                name: 'test', 
                phoneNumber: '147852369', 
                path: '1 rue descartes', 
                postalCode: '58741',
                town: 'city',
                email: 'toto@toto.com',
                password: 'pwdtochange'
            })
            .then(resp => {
                expect(resp.statusCode).toBe(302)
                expect(apiV1SchoolsPost).toBeCalledTimes(1)
                expect(apiV1SchoolsPost).toBeCalledWith({
                    account: {
                        email: 'toto@toto.com',
                        password: 'pwdtochange'
                    },
                    school: {
                        name: 'test', 
                        phoneNumber: '147852369', 
                        address: {
                            path: '1 rue descartes', 
                            postalCode: '58741',
                            town: 'city'
                        }
                    }
                })
                done()
            })
    })

})

