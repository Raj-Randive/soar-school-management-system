const express           = require('express');
const cors              = require('cors');
const helmet            = require('helmet');
const app               = express();
const config            = require('../../config/index.config.js');
const authRoutes = require("../api/auth.js");
const schoolRoutes = require("../api/school.js");
const classroomRoutes = require("../api/classroom.js");
const studentRoutes = require("../api/students.js");
const createRateLimiter = require("../../mws/__rateLimiter.js")

module.exports = class UserServer {
    constructor({config, managers}){
        this.config        = config;
        this.userApi       = managers.userApi;
    }
    
    /** for injecting middlewares */
    use(args){
        app.use(args);
    }

    /** server configs */
    run(){
        app.use(cors({origin: '*'}));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true}));
        app.use('/static', express.static('public'));
        app.use(helmet());

        /** an error handler */
        app.use((err, req, res, next) => {
            console.error(err.stack)
            res.status(500).send('Something broke!')
        });

        /** Apply rate limiting to APIs */ 
        
        // 8 requests per 15 mins
        const authRateLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 8 }); 
        // 100 requests per 20 mins
        const apiRateLimiter = createRateLimiter({ windowMs: 20 * 60 * 1000, max: 100 }); 

        app.use("/api/auth", authRateLimiter, authRoutes);
        app.use("/api/school", apiRateLimiter, schoolRoutes);
        app.use("/api/classroom", apiRateLimiter, classroomRoutes);
        app.use("/api/student", apiRateLimiter, studentRoutes);

        app.get('/', (req, res) => {
            res.status(200).send('Server is running!!');
        });

        app.listen(config.USER_PORT, () => {
            console.log(`${(config.SERVICE_NAME).toUpperCase()} server is running on port ${config.USER_PORT} || http://localhost:${config.USER_PORT}`);
        });
    }
}