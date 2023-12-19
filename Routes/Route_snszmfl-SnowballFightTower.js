import { IDs } from '../snszmfl-SnowballFightTower/AuthenticatedIDs.js';
import { LuaCodePeriodicFunctinSystem } from '../snszmfl-SnowballFightTower/PeriodicFunctionSystem.js';
import { LuaCodeLocalizationSystem } from '../snszmfl-SnowballFightTower/LocalizationSystem.js';
import { LuaCodeFreezeBlocks } from '../snszmfl-SnowballFightTower/PeriodicFunctions-FreezeBlocks.js';
import { LuaCodeSnowball } from '../snszmfl-SnowballFightTower/Snowball.js';
import { LuaCodeDataStoreSystem } from '../snszmfl-SnowballFightTower/DataStoreSystem.js';
import { LuaCodeChatTagSystem } from '../snszmfl-SnowballFightTower/ChatTagSystem.js';
import { LuaCodeInvertPlayerMoveSystem } from '../snszmfl-SnowballFightTower/InvertPlayerMoveSystem.js';



const scripts = {
    "LocalizationSystem": LuaCodeLocalizationSystem,
    "PeriodicFunctionSystem": LuaCodePeriodicFunctinSystem,
    "FreezeBlocks": LuaCodeFreezeBlocks,
    "SnowballScript": LuaCodeSnowball,
    "DataStoreSystem": LuaCodeDataStoreSystem,
    "ChatTagSystem": LuaCodeChatTagSystem,
    "InvertPlayerMoveSystem": LuaCodeInvertPlayerMoveSystem,
}
const allIDs = JSON.parse(IDs);

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
    console.log(`allIDs: ${allIDs}`);
    console.log(`IDs: ${IDs}`);
    console.log(`allIDs.includes(gameID): ${allIDs.includes(IDs)}`);
    if (!allIDs.includes(IDs)) {
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