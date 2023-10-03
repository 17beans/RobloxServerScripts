import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;



import { Route_Crong_PeriodicFunctionSystem } from './Routes/Route_Crong_PeriodicFunctionSystem.js'
import { Route_Crong_TowerSystem } from './Routes/Route_Crong_TowerSystem.js'
import { Route_snszmfl_SnowballFightTower } from './Routes/Route_snszmfl.js';



app.use(bodyParser.urlencoded({ extended: true }));



app.get('/PeriodicFunctionSystem/:gameID/:ScriptName', Route_Crong_PeriodicFunctionSystem);
app.get('/TowerSystem/:gameID/:ScriptName', Route_Crong_TowerSystem);
app.get('/snszmfl-SnowballFightTower/:gameID/:ScriptName', Route_snszmfl_SnowballFightTower);



app.listen(port, () => {
    console.log(`Server started from port ${port}`);
})