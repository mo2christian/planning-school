import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AccountDto, AddressDto, DrivingSchoolApi, SchoolDto, SchoolRequest } from '@driving/planning-client-api';

let schoolApi: DrivingSchoolApi;

export class SchoolRoute{

    constructor(baseUrl: string){
        schoolApi = new DrivingSchoolApi(baseUrl);
    }

    createView(req: Request, resp: Response){
        resp.render("school");
    }

    createValidation(){
        return [
            body('name')
                .notEmpty(),
            body('phoneNumber')
                .notEmpty()
                .isLength({min: 9, max: 10}),
            body('path')
                .notEmpty(),
            body('postalCode')
                .notEmpty()
                .isNumeric(),
            body('town')
                .notEmpty(),
            body('email')
                .isEmail()
                .normalizeEmail(),
            body('password')
                .notEmpty()
                .isLength({min: 5})
        ]
    }

    create(req: Request, resp: Response){
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            resp.render('school', {errors: errors.array({onlyFirstError: true})})
            return;
        }
        const school = new SchoolDto();
        school.name = req.body.name;
        school.phoneNumber = req.body.phoneNumber;

        const address = new AddressDto();
        address.path = req.body.path;
        address.postalCode = req.body.postalCode;
        address.town = req.body.town;
        school.address = address;

        const account = new AccountDto();
        account.email = req.body.email;
        account.password = req.body.password;

        const request = new SchoolRequest();
        request.school = school;
        request.account = account;

        schoolApi.apiV1SchoolsPost(request)
            .then(ans => resp.redirect("/login"))
            .catch(err => {
                console.log(err.body);
                resp.render('school', {errors: [
                    {msg: 'Error while creating school', param: 'Server'}
                ]})
            })
    }

}