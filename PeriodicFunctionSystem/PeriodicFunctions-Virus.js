export const LuaCodeVirus = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외에 다른 사람에 의해 참고, 이용 등 유출될 수 없습니다.
]]



--// Services //--
local Players = game:GetService('Players')
local Debris = game:GetService('Debris')
local ServerScriptService = game:GetService('ServerScriptService')
local ReplicatedStorage = game:GetService('ReplicatedStorage')
local Lighting = game:GetService('Lighting')
local TweenService = game:GetService('TweenService')
----



--// Presetup //--

----



--// Types //--
type TypeInfo = {
	['OriginHeadColor']: Color3,
	['rigName']: RBXScriptConnection,
	['DamageDebounce']: boolean,
}
----



--// Constants //--
local fPeriodicFunctionSystemServer = ServerScriptService.PeriodicFunctionSystem

local Config = script.Parent.Config
local RUN_TIME_MIN = Config.RunTimeMin.Value
local RUN_TIME_MAX = Config.RunTimeMax.Value
local PROBABILITY = Config.Probability.Value
local DAMAGE = Config.Damage.Value
local DAMAGE_COOL_TIME = Config.DamageCoolTime.Value
local INFECTED_COLOR = Config.InfectedColor.Value
local ATMOSPHERE_DENSITY = Config.AtmosphereDensity.Value
local ATMOSPHERE_OFFSET = Config.AtmosphereOffset.Value
local ATMOSPHERE_COLOR = Config.AtmosphereColor.Value
local ATMOSPHERE_DECAY = Config.AtmosphereDecay.Value
local ATMOSPHERE_GLARE = Config.AtmosphereGlare.Value
local ATMOSPHERE_HAZE = Config.AtmosphereHaze.Value
local USE_TWEEN_SERVICE = Config.UseTweenService.Value

local fPeriodicFunctionSystemReplicated = ReplicatedStorage.PeriodicFunctionSystem
local fPeriodicFunctionSystemRemotes = fPeriodicFunctionSystemReplicated.Remotes
----



--// Remotes / Bindables //--

local REvtParticleEffect = fPeriodicFunctionSystemRemotes.ParticleEffect
----



--// Modules //--
local Common = require(fPeriodicFunctionSystemServer.PeriodicFunctionSystem.Common)
----



--// Variables //--
local blockList = {}
local currentRunTime = 0
local targetRunTime = 0
local coroutines = {}

local playerTouchedConnections: {TypeInfo} = {}
local PrevAtmosphere = {
	['Density'] = nil,
	['Offset'] = nil,
	['Color'] = nil,
	['Decay'] = nil,
	['Glare'] = nil,
	['Haze'] = nil,
}
PrevAtmosphere.Density = Lighting.Atmosphere.Density
PrevAtmosphere.Offset = Lighting.Atmosphere.Offset
PrevAtmosphere.Color = Lighting.Atmosphere.Color
PrevAtmosphere.Decay = Lighting.Atmosphere.Decay
PrevAtmosphere.Glare = Lighting.Atmosphere.Glare
PrevAtmosphere.Haze = Lighting.Atmosphere.Haze


----// Tween //----
local OnAtmosphere = TweenService:Create(
	Lighting.Atmosphere,
	TweenInfo.new(0.5),
	{ Density = ATMOSPHERE_DENSITY, Offset = ATMOSPHERE_OFFSET }
)
local OffAtmosphere = TweenService:Create(
	Lighting.Atmosphere,
	TweenInfo.new(0.5),
	{ Density = PrevAtmosphere.Density, Offset = PrevAtmosphere.Offset }
)
--------
----



--// Functions //--
local function RunTimer()
	coroutines.Timer = coroutine.create(function()
		while true do
			task.wait(1)
			currentRunTime += 1
		end
	end)

	coroutine.resume(coroutines.Timer)
end

local function StopTimer()
	if coroutines.Timer then
		coroutine.close(coroutines.Timer)
		coroutines.Timer = nil
		currentRunTime = 0
	end
end


function module.Execute()
	--for _, player: Player in pairs(Players:GetPlayers()) do
	--	local message = Instance.new('Message')
	--	message.Parent = player:WaitForChild('PlayerGui')
	--	message.Text = script.Name
	--	Debris:AddItem(message, 5)
	--end


	task.spawn(function()
		targetRunTime = math.random(RUN_TIME_MIN, RUN_TIME_MAX)
		RunTimer()

		local players = Players:GetPlayers()
		local selectedPlayers = Common.GetCertainPlayers(players, Common.GetAmountWithProbability(#players, PROBABILITY))


		for _, player: Player in pairs(selectedPlayers) do
			local character = player.Character
			if not character then continue end
			if not playerTouchedConnections[player.UserId] then playerTouchedConnections[player.UserId] = {} end
			for _, rig: BasePart in pairs(character:GetChildren()) do
				if not rig:IsA('BasePart') then continue end

				if rig.Name == 'Head' then
					playerTouchedConnections[player.UserId].OriginHeadColor = rig.Color
					rig.Color = INFECTED_COLOR
				end

				if not rig:IsA('BasePart') then continue end
				pcall(function()
					playerTouchedConnections[player.UserId].DamageDebounce = false
				end)
				playerTouchedConnections[player.UserId][rig.Name] = rig.Touched:Connect(function(coll)
					if not playerTouchedConnections[player.UserId] then return end
					if playerTouchedConnections[player.UserId].DamageDebounce then return end
					local otherCharacter = coll.Parent
					if not otherCharacter then return end
					local Humanoid = otherCharacter:FindFirstChildOfClass('Humanoid')
					if not Humanoid then return end
					if otherCharacter == character then return end

					pcall(function()
						playerTouchedConnections[player.UserId].DamageDebounce = true
					end)

					Humanoid.Health -= DAMAGE
					task.wait(DAMAGE_COOL_TIME)

					pcall(function()
						playerTouchedConnections[player.UserId].DamageDebounce = false
					end)
				end)
			end
		end


		if not USE_TWEEN_SERVICE then
			Lighting.Atmosphere.Density = ATMOSPHERE_DENSITY
			Lighting.Atmosphere.Offset = ATMOSPHERE_OFFSET
			Lighting.Atmosphere.Color = ATMOSPHERE_COLOR
			Lighting.Atmosphere.Decay = ATMOSPHERE_DECAY
			Lighting.Atmosphere.Glare = ATMOSPHERE_GLARE
			Lighting.Atmosphere.Haze = ATMOSPHERE_HAZE

		else

			OnAtmosphere:Play()
		end
		REvtParticleEffect:FireAllClients(true, 'Effect-Virus')


		while true do
			task.wait()


			if currentRunTime >= targetRunTime then
				StopTimer()

				for _, player: Player in pairs(Players:GetPlayers()) do
					if not playerTouchedConnections[player.UserId] then continue end
					if player.Character then
						player.Character.Head.Color = playerTouchedConnections[player.UserId].OriginHeadColor
					end
				end

				for _, info: TypeInfo in pairs(playerTouchedConnections) do
					if info.rigName and info.rigName.Connected then
						info.rigName:Disconnect()
						info.rigName = nil
					end
					info.DamageDebounce = nil
					info = nil
				end

				playerTouchedConnections = {}


				if not USE_TWEEN_SERVICE then
					Lighting.Atmosphere.Density = PrevAtmosphere.Density
					Lighting.Atmosphere.Offset = PrevAtmosphere.Offset
					Lighting.Atmosphere.Color = PrevAtmosphere.Color
					Lighting.Atmosphere.Decay = PrevAtmosphere.Decay
					Lighting.Atmosphere.Glare = PrevAtmosphere.Glare
					Lighting.Atmosphere.Haze = PrevAtmosphere.Haze

				else

					OffAtmosphere:Play()
				end
				REvtParticleEffect:FireAllClients(false, 'Effect-Virus')


				return
			end
		end
	end)

end

function module.Cancel()
	currentRunTime = targetRunTime
end
----



--// Setup //--

----



--// Main //--

----



`