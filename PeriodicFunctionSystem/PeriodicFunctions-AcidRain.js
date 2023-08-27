export const LuaCodeAcidRain = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외에 다른 사람에 의해 참고, 이용 등 유출될 수 없습니다.
]]



--// Services //--
local Players = game:GetService('Players')
local Debris = game:GetService('Debris')
local Lighting = game:GetService('Lighting')
local TweenService = game:GetService('TweenService')
local ReplicatedStorage = game:GetService('ReplicatedStorage')
----



--// Presetup //--

----



--// Types //--

----



--// Constants //--
local Config = script.Parent.Config
local RUN_TIME_MIN = Config.RunTimeMin.Value
local RUN_TIME_MAX = Config.RunTimeMax.Value
local DAMAGE = Config.Damage.Value
local DAMAGE_COOL_TIME = Config.DamageCoolTime.Value
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

----



--// Variables //--
local blockList = {}
local currentRunTime = 0
local targetRunTime = 0
local coroutines = {}

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
	{
		Density = ATMOSPHERE_DENSITY,
		Offset = ATMOSPHERE_OFFSET,
		Color = ATMOSPHERE_COLOR,
		Decay = ATMOSPHERE_DECAY,
		Glare = ATMOSPHERE_GLARE,
		Haze = ATMOSPHERE_HAZE
	}
)
local OffAtmosphere = TweenService:Create(
	Lighting.Atmosphere,
	TweenInfo.new(0.5),
	{
		Density = PrevAtmosphere.Density,
		Offset = PrevAtmosphere.Offset,
		Color = PrevAtmosphere.Color,
		Decay = PrevAtmosphere.Decay,
		Glare = PrevAtmosphere.Glare,
		Haze = PrevAtmosphere.Haze
	}
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
		REvtParticleEffect:FireAllClients(true, 'Effect-AcidRain')


		while true do
			task.wait()


			for _, player in pairs(Players:GetPlayers()) do
				local character = player.Character
				if not character then continue end
				local vInShelter: BoolValue = player:FindFirstChild('InShelter')
				if not vInShelter then warn('[AcidRain] Player does not have InShelter BoolValue') continue end
				if vInShelter.Value then continue end
				local Humanoid = character:FindFirstChildOfClass('Humanoid')
				if not Humanoid then continue end

				Humanoid.Health -= DAMAGE
			end
			task.wait(DAMAGE_COOL_TIME)


			if currentRunTime >= targetRunTime then
				StopTimer()
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
				REvtParticleEffect:FireAllClients(false, 'Effect-AcidRain')

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