import { IDs } from "../DaeSoon-TaggerTower/AuthenticatedIDs.js";
import { LuaCodeCharacterRandomDraw } from "../DaeSoon-TaggerTower/CharacterRandomDraw.js";



const scripts = {
    "bean7189-CharacterRandomDraw": LuaCodeCharacterRandomDraw,
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
    console.log(`allIDs.includes(ID): ${allIDs.includes(ID)}`);
    if (!allIDs.includes(ID)) {
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