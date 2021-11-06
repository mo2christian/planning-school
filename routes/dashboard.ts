import { Request, Response } from "express";
import { DrivingSchoolApi } from '@driving/planning-client-api';

const schoolApi = new DrivingSchoolApi('https://planning-api.monlabo.biz/');

export function welcome(req: Request, res: Response){
    schoolApi.apiV1SchoolsGet()
        .then(resp => res.render('home', { name : 'Allen', schools : resp.body.schools}))
}

