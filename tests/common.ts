
import { AccountApi, Text } from '@driving/planning-client-api';
import request, { SuperAgentTest } from 'supertest';
import { app } from '../app';

export function login(done: jest.DoneCallback): SuperAgentTest{
    const apiV1AccountsCheckPost = jest.fn().mockResolvedValue(Promise.resolve({
        body: new Text()
      }));
    AccountApi.prototype.apiV1AccountsCheckPost = apiV1AccountsCheckPost;
    const agent = request.agent(app);
    agent
      .post("/login")
      .send({username: 'user', password: 'pwd', school: 'school'})
      .then(response => {
        expect(response.statusCode).toBe(302);
        expect(apiV1AccountsCheckPost).toHaveBeenCalledWith("school", {"email": "user", "password": "pwd"})
        done()
      })
    return agent;
}