import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;

import { gameIDs } from './PeriodicFunctionSystem/AuthenticatedGameIDs.js';
import { LuaCodePeriodicFunctinSystem } from './PeriodicFunctionSystem/PeriodicFunctionSystem.js';
const allGameIDs = JSON.parse(gameIDs);
console.log(`allGameIDs: ${allGameIDs}`);



app.use(bodyParser.urlencoded({ extended: true }));

// console.log(`test code: `);
// console.log(require('./PeriodicFunctionSystem/PeriodicFunctionSystem.lua'));



app.get('/PeriodicFunctionSystem/:gameID', (req, res) => {
    const gameID = req.params.gameID
    if (!gameID) {
        return res.json({
            success: false,
            status: 'Invalid request',
        });
    }
    console.log(`gameIDs: ${gameIDs}`);
    console.log(`gameID: ${gameID}`);
    console.log(`gameIDs.includes(gameID): ${gameIDs.includes(gameID)}`);
    if (!gameIDs.includes(gameID)) {
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