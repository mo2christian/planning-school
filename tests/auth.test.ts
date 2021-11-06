import { AccountApi, DrivingSchoolApi, SchoolResponse } from '@driving/planning-client-api';
import request from 'supertest';
import { app }  from '../app';


describe("Test the root path", () => {

  beforeAll(() => {
    const schoolsGet = jest.fn().mockReturnValue(Promise.resolve({
      body: new SchoolResponse()
    }));
    DrivingSchoolApi.prototype.apiV1SchoolsGet = schoolsGet;

    AccountApi.prototype.apiV1AccountsCheckPost = jest.fn();
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
        done();
      });
  });
/*
  test("It should response the POST login", done => {
    request(app)
      .post("/login")
      .send({username: 'user', password: 'pwd', school: 'school'})
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
*/
  afterAll(() => {
    jest.resetAllMocks()
  })

});