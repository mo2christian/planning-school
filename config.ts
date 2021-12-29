import { Application, Request} from 'express';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import passportCustom, { VerifiedCallback } from 'passport-custom';
import session from 'express-session';
import { AccountApi, AccountDto, DrivingSchoolApi, HttpError } from '@driving/planning-client-api';
import { Tracer, ExplicitContext, BatchRecorder, jsonEncoder } from 'zipkin';
import { HttpLogger } from "zipkin-transport-http";
import zipkinMiddleware from "zipkin-instrumentation-express";


let schoolApi: DrivingSchoolApi;
let accountApi: AccountApi;

export class UserProfile{

    constructor(public email: string, public school: string){}

}

export class ZipkinConfig{

    constructor(public zipkinUrl: string){}

    initialize(app: Application){
        // Get ourselves a zipkin tracer
        const tracer = new Tracer({
            ctxImpl: new ExplicitContext(),
            recorder: new BatchRecorder({
                logger: new HttpLogger({
                    endpoint: `${this.zipkinUrl}/api/v2/spans`,
                    jsonEncoder: jsonEncoder.JSON_V2,
                    timeout: 3000
                }),
            }),
            localServiceName: "planning-school",
        });
        app.use(zipkinMiddleware.expressMiddleware({ tracer }));
    }

}

export class SessionConfig{

    constructor(private mongoUrl: string, private secret: string){
    }

    initialize(app: Application){
        app.use(session({ 
            store: MongoStore.create({ mongoUrl: this.mongoUrl }),
            secret: this.secret,
            resave: false,
            saveUninitialized: false,
            cookie: { 
                secure: false,
                maxAge: 1000 * 60 * 24
            }
        }));
    }

}

export class SecurityConfig{

    constructor(baseUrl: string){
        schoolApi = new DrivingSchoolApi(baseUrl);
        accountApi = new AccountApi(baseUrl);
    }

    authenticate( req: Request, done: VerifiedCallback){
        const accountDto = new AccountDto();
        accountDto.email = req.body.username;
        accountDto.password = req.body.password;
        const school = req.body.school;
        accountApi.apiV1AccountsCheckPost(school, accountDto)
            .catch( (err:HttpError) => {
                console.log(err.body);
                done(null, false);
            })
            .then(ans => {
                const profile = new UserProfile(req.body.username, school);
                req.session.user = profile
                done(null, profile)
            });
    }

    serializeUser(user: any, done: any){
        done(null, user);
    }

    deserializeUser(user: any, done: any){
        done(null, user);
    }

    initialize(app: Application){
        const PlanningStrategy = passportCustom.Strategy;
        passport.use('planning-auth', new PlanningStrategy(this.authenticate));
        passport.serializeUser(this.serializeUser);
        passport.deserializeUser(this.deserializeUser)
        app.use(passport.initialize());
        app.use(passport.session());
    }

}