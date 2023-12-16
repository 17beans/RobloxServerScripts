// const app = require('express')();
// const { v4 } = require('uuid');

// app.get('/api', (req, res) => {
//   const path = `/api/item/${v4()}`;
//   res.setHeader('Content-Type', 'text/html');
//   res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
//   res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
// });

// app.get('/api/item/:slug', (req, res) => {
//   const { slug } = req.params;
//   res.end(`Item: ${slug}`);
// });

// module.exports = app;







// import express from 'express';
// import bodyParser from 'body-parser';
// const app = express();
// const port = 5000;



// import { Route_Crong_PeriodicFunctionSystem } from './Routes/Route_Crong_PeriodicFunctionSystem.js'
// import { Route_Crong_TowerSystem } from './Routes/Route_Crong_TowerSystem.js'
// import { Route_snszmfl_SnowballFightTower } from './Routes/Route_snszmfl-SnowballFightTower.js';
// import { Route_snszmfl_SpringTower } from './Routes/Route_snszmfl-SpringTower.js';
// import { Route_DaeSoon_ThrowCharacterSystem } from './Routes/Route_DaeSoon-ThrowCharacterSystem.js';
// import { Route_derqqq12345_WorldSimulator } from './Routes/Route_derqqq12345-WorldSimulator.js';
// import { Route_DaeSoon_TaggerTower } from './Routes/Route_DaeSoon-TaggerTower.js';



// app.use(bodyParser.urlencoded({ extended: true }));



// // Crong Place는 RobloxStudio 권한이 없기 때문에 접속 url을 변경할 수 없음
// app.get('/PeriodicFunctionSystem/:gameID/:ScriptName', Route_Crong_PeriodicFunctionSystem);
// app.get('/TowerSystem/:gameID/:ScriptName', Route_Crong_TowerSystem);

// // snszmfl Place
// app.get('/snszmfl-SnowballFightTower/:gameID/:ScriptName', Route_snszmfl_SnowballFightTower);
// app.get('/snszmfl-SpringTower/:gameID/:ScriptName', Route_snszmfl_SpringTower);

// // DaeSoon Place
// app.get('/daesoon-ThrowCharacterSystem/:gameID/:ScriptName', Route_DaeSoon_ThrowCharacterSystem);
// app.get('/daesoon-TaggerTower/:gameIDplaceIDcreatorID/:ScriptName', Route_DaeSoon_TaggerTower);

// // derqqq12345 Place
// app.get('/derqqq12345-WorldSimulator/:gameID/:ScriptName', Route_derqqq12345_WorldSimulator);



// app.listen(port, () => {
//     console.log(`Server started from port ${port}`);
// })







const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;