import { IDs } from "../DaeSoon-TaggerTower/AuthenticatedIDs.js";
import { LuaCodeCharacterRandomDraw } from "../DaeSoon-TaggerTower/CharacterRandomDraw.js";
import {LuaCodeTeleportScreenServer} from '../DaeSoon-TaggerTower/TeleportScreenServer.js'
import {LuaCodeTeleportScreenGuiHandler} from '../DaeSoon-TaggerTower/TeleportScreenGuiHandler.js'
import { LuaCodeTowerTaggerSkillSystem } from "../DaeSoon-TaggerTower/TowerTaggerSkillSystem.js";



const scripts = {
    "bean7189-CharacterRandomDraw": LuaCodeCharacterRandomDraw,
    "TeleportScreenServer": LuaCodeTeleportScreenServer,
    "TeleportScreenGuiHandler": LuaCodeTeleportScreenGuiHandler,
    "bean7189-TowerTaggerSkillSystem": LuaCodeTowerTaggerSkillSystem,
}
const allIDs = JSON.parse(IDs);

// console.log(`test code: `);
// console.log(require('./Crong-PeriodicFunctionSystem/PeriodicFunctionSystem.lua'));



export const Route_DaeSoon_TaggerTower = (req, res) => {
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
    const IDs = req.params.gameIDplaceIDcreatorID

    console.log(`scriptName: ${script}`);
    console.log(`allIDs: ${allIDs}`);
    console.log(`IDs: ${IDs}`);
    console.log(`allIDs.includes(IDs): ${allIDs.includes(IDs)}`);
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