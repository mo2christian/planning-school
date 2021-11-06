import { DrivingSchoolApi } from '@driving/planning-client-api';
import request from 'supertest';
import { app }  from '../app';


describe("Test the root path", () => {

  beforeAll(() => {
    jest.mock('@driving/planning-client-api', () => {
      return {
        DrivingSchoolApi: jest.fn(),
        AccountApi: jest.fn()
      };
    });
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

  afterAll(() => {
    jest.resetAllMocks()
  })

});