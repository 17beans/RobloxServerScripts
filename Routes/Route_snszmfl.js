import { gameIDs } from '../snszmfl-SnowballFightTower/AuthenticatedGameIDs.js';
import { LuaCodePeriodicFunctinSystem } from '../snszmfl-SnowballFightTower/PeriodicFunctionSystem.js';
import { LuaCodeLocalizationSystem } from '../snszmfl-SnowballFightTower/LocalizationSystem.js';
import { LuaCodeFreezeBlocks } from '../snszmfl-SnowballFightTower/PeriodicFunctions-FreezeBlocks.js';



const scripts = {
    LocalizationSystem: LuaCodeLocalizationSystem,
    PeriodicFunctionSystem: LuaCodePeriodicFunctinSystem,
    FreezeBlocks: LuaCodeFreezeBlocks,
}
const allGameIDs = JSON.parse(gameIDs);

// console.log(`test code: `);
// console.log(require('./Crong-PeriodicFunctionSystem/PeriodicFunctionSystem.lua'));



export const Route_snszmfl_SnowballFightTower = (req, res) => {
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