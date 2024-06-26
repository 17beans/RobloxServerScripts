import { gameIDs } from "../DaeSoon-ThrowCharacterSystem/AuthenticatedGameIDs.js";
import { LuaCodeThrowCharacterSystem } from "../DaeSoon-ThrowCharacterSystem/ThrowCharacterSystem.js";



const scripts = {
    ThrowCharacterSystem: LuaCodeThrowCharacterSystem,
}
const allGameIDs = JSON.parse(gameIDs);

// console.log(`test code: `);
// console.log(require('./Crong-PeriodicFunctionSystem/PeriodicFunctionSystem.lua'));



export const Route_DaeSoon_ThrowCharacterSystem = (req, res) => {
    const scriptName = req.params.ScriptName
    if (!scriptName) {
        return res.json({
            success: false,
            status: 'Invalid request',
        });
    }
    const script = scripts[scriptName]
    if (!script) {
        return res.json({
            success: false,
            status: 'Invalid request',
        });
    }
    const gameID = Number(req.params.gameID)
    if (!gameID) {
        return res.json({
            success: false,
            status: 'Invalid request',
        });
    }

    console.log(`script: ${script}`);
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
        code: script,
    });
}