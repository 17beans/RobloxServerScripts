import { gameIDs } from '../snszmfl-SpringTower/AuthenticatedGameIDs.js';
import { LuaCodeBlockFalling } from '../snszmfl-SpringTower/BlockFalling.js';
import { LuaCodeBlockMovingSeat } from '../snszmfl-SpringTower/BlockMovingSeat.js';
import { LuaCodeBlockPushing } from '../snszmfl-SpringTower/BlockPushing.js';



const scripts = {
    BlockFalling: LuaCodeBlockFalling,
    BlockPushing: LuaCodeBlockPushing,
    BlockMovingSeat: LuaCodeBlockMovingSeat,
}
const allGameIDs = JSON.parse(gameIDs);

// console.log(`test code: `);
// console.log(require('./Crong-PeriodicFunctionSystem/PeriodicFunctionSystem.lua'));



export const Route_snszmfl_SpringTower = (req, res) => {
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