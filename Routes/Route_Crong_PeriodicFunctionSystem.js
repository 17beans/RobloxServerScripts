import { gameIDs } from '../Crong-NaturalDisasterTower/AuthenticatedGameIDs.js';
import { LuaCodePeriodicFunctinSystem } from '../Crong-NaturalDisasterTower/PeriodicFunctionSystem.js';
import { LuaCodeLocalizationSystem } from '../Crong-NaturalDisasterTower/LocalizatinoSystem.js';
import { LuaCodeCommon } from '../Crong-NaturalDisasterTower/PeriodicFunctionSystem-Common.js';
import { LuaCodeAcidRain } from '../Crong-NaturalDisasterTower/PeriodicFunctions-AcidRain.js';
import { LuaCodeEarthquake } from '../Crong-NaturalDisasterTower/PeriodicFunctions-Earthquake.js';
import { LuaCodeHail } from '../Crong-NaturalDisasterTower/PeriodicFunctions-Hail.js';
import { LuaCodeHeavySnow } from '../Crong-NaturalDisasterTower/PeriodicFunctions-HeavySnow.js';
import { LuaCodeSandstorm } from '../Crong-NaturalDisasterTower/PeriodicFunctions-Sandstorm.js';
import { LuaCodeSnowstorm } from '../Crong-NaturalDisasterTower/PeriodicFunctions-Snowstorm.js';
import { LuaCodeVirus } from '../Crong-NaturalDisasterTower/PeriodicFunctions-Virus.js';



const scripts = {
    LocalizationSystem: LuaCodeLocalizationSystem,
    PeriodicFunctionSystem: LuaCodePeriodicFunctinSystem,
    Common: LuaCodeCommon,
    AcidRain: LuaCodeAcidRain,
    Earthquake: LuaCodeEarthquake,
    Hail: LuaCodeHail,
    HeavySnow: LuaCodeHeavySnow,
    Sandstorm: LuaCodeSandstorm,
    Snowstorm: LuaCodeSnowstorm,
    Virus: LuaCodeVirus,
}
const allGameIDs = JSON.parse(gameIDs);

// console.log(`test code: `);
// console.log(require('./Crong-PeriodicFunctionSystem/PeriodicFunctionSystem.lua'));



export const Route_Crong_PeriodicFunctionSystem = (req, res) => {
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