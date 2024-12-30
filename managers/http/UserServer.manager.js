const express           = require('express');
const cors              = require('cors');
const app               = express();
const config            = require('../../config/index.config.js');
const authRoutes = require("../api/auth.js");
const schoolRoutes = require("../api/school.js");
const classroomRoutes = require("../api/classroom.js");
const studentRoutes = require("../api/students.js");

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

        /** an error handler */
        app.use((err, req, res, next) => {
            console.error(err.stack)
            res.status(500).send('Something broke!')
        });

        app.use("/api/auth", authRoutes);
        app.use("/api/school", schoolRoutes);
        app.use("/api/classroom", classroomRoutes);
        app.use("/api/student", studentRoutes);

        app.get('/', (req, res) => {
            res.status(200).send('Server is running!!');
        });

        app.listen(config.USER_PORT, () => {
            console.log(`${(config.SERVICE_NAME).toUpperCase()} server is running on port ${config.USER_PORT} || http://localhost:${config.USER_PORT}`);
        });
    }
}