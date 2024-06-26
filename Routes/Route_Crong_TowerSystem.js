import { gameIDs } from '../Crong-NaturalDisasterTower/AuthenticatedGameIDs.js';
import { LuaCodeBlockDamage } from '../Crong-NaturalDisasterTower/BlockDamage.js';
import { LuaCodeBlockKill } from '../Crong-NaturalDisasterTower/BlockKill.js';
import { LuaCodeBlockFalling } from '../Crong-NaturalDisasterTower/BlockFalling.js';



const scripts = {
    BlockDamage: LuaCodeBlockDamage,
    BlockKill: LuaCodeBlockKill,
    BlockFalling: LuaCodeBlockFalling,
}
const allGameIDs = JSON.parse(gameIDs);



export const Route_Crong_TowerSystem = (req, res) => {
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