import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;



import { Route_Crong_PeriodicFunctionSystem } from './Routes/Route_Crong_PeriodicFunctionSystem.js'
import { Route_Crong_TowerSystem } from './Routes/Route_Crong_TowerSystem.js'
import { Route_snszmfl_SnowballFightTower } from './Routes/Route_snszmfl.js';
import { Route_DaeSoon_ThrowCharacterSystem } from './Routes/Route_DaeSoon-ThrowCharacterSystem.js';
import { Route_derqqq12345_WorldSimulator } from './Routes/Route_derqqq12345-WorldSimulator.js';



app.use(bodyParser.urlencoded({ extended: true }));



// Crong Place는 RobloxStudio 권한이 없기 때문에 접속 url을 변경할 수 없음
app.get('/PeriodicFunctionSystem/:gameID/:ScriptName', Route_Crong_PeriodicFunctionSystem);
app.get('/TowerSystem/:gameID/:ScriptName', Route_Crong_TowerSystem);

// snszmfl Place
app.get('/snszmfl-SnowballFightTower/:gameID/:ScriptName', Route_snszmfl_SnowballFightTower);

// DaeSoon Place
app.get('/daesoon-ThrowCharacterSystem/:gameID/:ScriptName', Route_DaeSoon_ThrowCharacterSystem);

// derqqq12345 Place
app.get('/derqqq12345-WorldSimulator/:gameID/:ScriptName', Route_derqqq12345_WorldSimulator);



app.listen(port, () => {
    console.log(`Server started from port ${port}`);
})