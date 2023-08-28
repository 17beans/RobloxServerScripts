import { gameIDs } from '../PeriodicFunctionSystem/AuthenticatedGameIDs.js';
import { LuaCodeLocalizationSystem } from '../PeriodicFunctionSystem/LocalizatinoSystem.js';
import { LuaCodePeriodicFunctinSystem } from '../PeriodicFunctionSystem/PeriodicFunctionSystem.js';
import { LuaCodeCommon } from '../PeriodicFunctionSystem/PeriodicFunctionSystem-Common.js';
import { LuaCodeAcidRain } from '../PeriodicFunctionSystem/PeriodicFunctions-AcidRain.js';
import { LuaCodeEarthquake } from '../PeriodicFunctionSystem/PeriodicFunctions-Earthquake.js';
import { LuaCodeHail } from '../PeriodicFunctionSystem/PeriodicFunctions-Hail.js';
import { LuaCodeHeavySnow } from '../PeriodicFunctionSystem/PeriodicFunctions-HeavySnow.js';
import { LuaCodeSandstorm } from '../PeriodicFunctionSystem/PeriodicFunctions-Sandstorm.js';
import { LuaCodeSnowstorm } from '../PeriodicFunctionSystem/PeriodicFunctions-Snowstorm.js';
import { LuaCodeVirus } from '../PeriodicFunctionSystem/PeriodicFunctions-Virus.js';



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



export const PeriodicFunctionSystem = (req, res) => {
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