import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { MonitorApi, MonitorDto } from '@driving/planning-client-api'

let monitorApi: MonitorApi;

export class MonitorRoute{

    constructor(baseUrl: string){
        monitorApi = new MonitorApi(baseUrl);
    }

    list(req: Request, resp: Response){
        const user = req.session.user;
        monitorApi.apiV1MonitorsGet(user!.school)
            .then(ans => {
                resp.render("monitor", { monitors: ans.body.monitors})
            })
    }

    createValidation(){
        return [
            body('firstName')
                .notEmpty(),
            body('phoneNumber')
                .notEmpty()
                .isLength({min: 9, max: 10}),
            body('lastName')
                .notEmpty()
        ]
    }


    create(req: Request, res: Response){
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            res.render('monitor', {errors: errors.array({onlyFirstError: true})})
            return;
        }
        const monitor = new MonitorDto();
        monitor.firstName = req.body.firstName;
        monitor.lastName = req.body.lastName;
        monitor.phoneNumber = req.body.phoneNumber;
        const user = req.session.user;
        monitorApi.apiV1MonitorsPost(user!.school, monitor)
            .then(ans => res.redirect('/monitor'))
            .catch(err => {
                console.log(err.body);
                res.render('monitor', {errors: [
                    {msg: 'Error while creating monitor', param: 'Server'}
                ]})
            })
    }

}