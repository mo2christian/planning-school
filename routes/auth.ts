import { Request, Response } from 'express';
import { DrivingSchoolApi } from '@driving/planning-client-api';

declare module 'express-session' {
    interface SessionData {
      user: UserProfile;
    }
}

let schoolApi: DrivingSchoolApi;

export class UserProfile{

    constructor(public email: string, public school: string){}

}

export class Auth{

    constructor(baseUrl: string){
        schoolApi = new DrivingSchoolApi(baseUrl);
    }
    
    loginPage(req: Request, res: Response){
        if (req.isAuthenticated()){
            res.redirect('/');
        }
        else{
            schoolApi.apiV1SchoolsGet()
            .then(resp => res.render('login', { schools : resp.body.schools}))
        }
    }

}

