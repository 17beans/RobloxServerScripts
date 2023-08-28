import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;



import { PeriodicFunctionSystem } from './Routes/RoutePeriodicFunctionSystem.js'
import { TowerSystem } from './Routes/RouteTowerSystem.js'



app.use(bodyParser.urlencoded({ extended: true }));



app.get('/PeriodicFunctionSystem/:gameID/:ScriptName', PeriodicFunctionSystem);
app.get('/TowerSystem/:gameID/:ScriptName', TowerSystem);



app.listen(port, () => {
    console.log(`Server started from port ${port}`);
})