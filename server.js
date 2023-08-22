import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;

import { gameIDs } from './PeriodicFunctionSystem/AuthenticatedGameIDs.js';
import { LuaCodePeriodicFunctinSystem } from './PeriodicFunctionSystem/PeriodicFunctionSystem.js';
const allGameIDs = JSON.parse(gameIDs);



app.use(bodyParser.urlencoded({ extended: true }));

// console.log(`test code: `);
// console.log(require('./PeriodicFunctionSystem/PeriodicFunctionSystem.lua'));



app.get('/PeriodicFunctionSystem/:gameID', (req, res) => {
    const gameID = Number(req.params.gameID)
    if (!gameID) {
        return res.json({
            success: false,
            status: 'Invalid request',
        });
    }
    console.log(`gameIDs: ${allGameIDs}`);
    console.log(`gameID: ${gameID}`);
    console.log(`allGameIDs.includes(gameID): ${allGameIDs.includes(gameID)}`);
    if (!allGameIDs.includes(gameID)) {
        return res.json({
            success: false,
            status: 'Authentication failed',
        });
    }

    return res.json({
        success: true,
        code: LuaCodePeriodicFunctinSystem,
    });
});



app.listen(port, () => {
    console.log(`Server started from port ${port}`);
})