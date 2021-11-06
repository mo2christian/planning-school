import express, { Request, Response} from 'express';
import cookieParser from 'cookie-parser';
import mustache from 'mustache-express';
import passport from 'passport';
import { welcome }  from './routes/dashboard';
import { Auth } from './routes/auth';
import { SecurityConfig, SessionConfig, ZipkinConfig } from './config/config';
import path from 'path';

export const app = express();
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'mustache');
app.engine('mustache', mustache());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

//session config
const user = process.env.MONGO_USER || 'planning';
const pwd = process.env.MONGO_PWD || 'pwd';
const link = process.env.MONGO_LINK || 'localhost:27017/phanning-school'
const planningUrl = process.env.PLANNING_API || 'https://planning-api.monlabo.biz/';
const sessionSecret = process.env.SESSION_SECRET || 'secret';
let mongoUrl = `mongodb://${link}`;
if (process.env.NODE_ENV == 'production'){
    mongoUrl = `mongodb+srv://${user}:${pwd}@${link}`;
}

//session config
const sessionConfig: SessionConfig = new SessionConfig(mongoUrl, sessionSecret);
sessionConfig.initialize(app);

//security config
const securityConfig = new SecurityConfig(planningUrl);
securityConfig.initialize(app);

//zipkin config
const ZIPKIN_ENDPOINT = process.env.ZIPKIN_ENDPOINT || "http://localhost:9411";
const zipkinConfig = new ZipkinConfig(ZIPKIN_ENDPOINT);
zipkinConfig.initialize(app);

//define common variables
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.user = req.user;
    next();
  });

//define routes
const auth = new Auth(planningUrl);

app.get('/',  loggedIn, welcome);

app.get('/login', auth.loginPage);

app.get('/logout', loggedIn, (req, res) => {
    req.logOut();
    res.redirect('/login');
})

app.post('/login', 
    passport.authenticate('planning-auth', { failureRedirect: '/login', successRedirect: '/'}), 
    (req, res) => {
        //do nothing
    });

function loggedIn(req: Request, res: Response, next: any){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}