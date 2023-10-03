import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;

import { Router_Crong_PeriodicFunctionSystem } from './Routers/Crong-PeriodicFunctionSystem.js';



app.use(bodyParser.urlencoded({ extended: true }));



app.get('/Crong-PeriodicFunctionSystem/:gameID/:ScriptName', Router_Crong_PeriodicFunctionSystem);



app.listen(port, () => {
    console.log(`Server started from port ${port}`);
})