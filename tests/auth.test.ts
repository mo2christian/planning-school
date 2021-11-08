/**
 * @jest-environment ./jest.setup.ts
 */
import { AccountApi, DrivingSchoolApi, SchoolResponse, Text } from '@driving/planning-client-api';
import request, { SuperAgentTest } from 'supertest';
import { app } from '../app';

jest.setTimeout(20000)
let agent: SuperAgentTest;
let schoolsGet: jest.Mock;
let apiV1AccountsCheckPost: jest.Mock;

describe("Test Home and login page", () => {

  beforeAll(() => {
    
    schoolsGet = jest.fn().mockReturnValue(Promise.resolve({
      body: new SchoolResponse()
    }));
    DrivingSchoolApi.prototype.apiV1SchoolsGet = schoolsGet;

    apiV1AccountsCheckPost = jest.fn().mockResolvedValue(Promise.resolve({
      body: new Text()
    }));
    AccountApi.prototype.apiV1AccountsCheckPost = apiV1AccountsCheckPost;
    agent = request.agent(app);
    
  })

  test("It should response the GET home", done => {
    request(app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(302);
        done();
      });
  });

  test("It should response the GET login", done => {
    request(app)
      .get("/login")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(schoolsGet).toHaveBeenCalled();
        done();
      });
  });

  test("It should response the POST login", done => {
    agent
      .post("/login")
      .send({username: 'user', password: 'pwd', school: 'school'})
      .then(response => {
        expect(response.statusCode).toBe(302);
        expect(apiV1AccountsCheckPost).toHaveBeenCalledWith("school", {"email": "user", "password": "pwd"})
        done()
      })
  });

  test("It should response Home page", done => {
    agent
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  test("It should logout", done => {
    agent
      .get("/logout")
      .then(response => {
        expect(response.statusCode).toBe(302);
        done();
      });
  })

  afterAll(() => {
    jest.resetAllMocks();
  })

});