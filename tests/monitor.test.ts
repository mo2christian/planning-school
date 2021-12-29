/**
 * @jest-environment ./jest.setup.ts
 */
import { SuperAgentTest } from 'supertest';
import { MonitorApi, MonitorDto, Text } from '@driving/planning-client-api';
import { login } from './common';
import { check } from 'express-validator';
import { request } from 'http';

jest.setTimeout(20000)
let agent: SuperAgentTest;
let monitorGet: jest.Mock;
let monitorPost: jest.Mock;

describe('Test Monitor page', ()=> {

    beforeAll(() => {
        monitorGet = jest.fn().mockResolvedValue(Promise.resolve({
            body: []
        }))
        MonitorApi.prototype.apiV1MonitorsGet = monitorGet;

        monitorPost = jest.fn().mockResolvedValue(Promise.resolve({
            body: new Text()
        }))
        MonitorApi.prototype.apiV1MonitorsPost = monitorPost;
    })

    test('Login', done => {
       agent = login(done)
    })

    test('Create monitor with invalid phoneNumber', done => {
        const dto = new MonitorDto();
        dto.firstName = 'firstName';
        dto.lastName = 'lastName';
        dto.phoneNumber = '6985';
        agent.post('/monitor')
            .send({
                firstName: dto.firstName,
                lastName: dto.lastName,
                phoneNumber: dto.phoneNumber
            })
            .then(resp => {
                expect(resp.statusCode).toBe(200)
                expect(monitorPost).toBeCalledTimes(0)
                done()
            })
    })

    test('Create monitor with invalid fistName', done => {
        const dto = new MonitorDto();
        dto.firstName = '';
        dto.lastName = 'lastName';
        dto.phoneNumber = '6985362547';
        agent.post('/monitor')
            .send({
                firstName: dto.firstName,
                lastName: dto.lastName,
                phoneNumber: dto.phoneNumber
            })
            .then(resp => {
                expect(resp.statusCode).toBe(200)
                expect(monitorPost).toBeCalledTimes(0)
                done()
            })
    })

    test('Create monitor with invalid lastName', done => {
        const dto = new MonitorDto();
        dto.firstName = 'test';
        dto.lastName = '';
        dto.phoneNumber = '698598574';
        agent.post('/monitor')
            .send({
                firstName: dto.firstName,
                lastName: dto.lastName,
                phoneNumber: dto.phoneNumber
            })
            .then(resp => {
                expect(resp.statusCode).toBe(200)
                expect(monitorPost).toBeCalledTimes(0)
                done()
            })
    })

    test('List monitor', done => {
        agent
            .get('/monitor')
            .then(resp => {
                expect(resp.statusCode).toBe(200);
                expect(monitorGet).toBeCalledTimes(1)
                done()
            })
    })

    test('Create monitor', done => {
        const dto = new MonitorDto();
        dto.firstName = 'firstName';
        dto.lastName = 'lastName';
        dto.phoneNumber = '147852369';
        agent.post('/monitor')
            .send({
                firstName: dto.firstName,
                lastName: dto.lastName,
                phoneNumber: dto.phoneNumber
            })
            .then(resp => {
                expect(resp.statusCode).toBe(302)
                expect(monitorPost).toBeCalledTimes(1)
                expect(monitorPost).toBeCalledWith('school', dto)
                done()
            })
    })

    afterAll(() => {
        jest.resetAllMocks();
    })

})

