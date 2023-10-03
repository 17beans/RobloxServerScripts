export const LuaCodeSnowstorm = `local module = {}



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
type TypeCharacterInfo = {
	['HRPPrevCFrame']: CFrame
}
----



--// Constants //--
local vCurrentPeriodicFunctionName: StringValue = workspace.PeriodicFunctionSystem.CurrentPeriodicFunctionName

local Config = script.Parent.Config
local RUN_TIME_MIN = Config.RunTimeMin.Value
local RUN_TIME_MAX = Config.RunTimeMax.Value
local GAP_POSITION_X = Config.GapPositionX.Value
local GAP_POSITION_Y = Config.GapPositionY.Value
local GAP_POSITION_Z = Config.GapPositionZ.Value
local DAMAGE = Config.Damage.Value
local DAMAGE_COOL_TIME = Config.DamageCoolTime.Value
local ATMOSPHERE_DENSITY = Config.AtmosphereDensity.Value
local ATMOSPHERE_OFFSET = Config.AtmosphereOffset.Value
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

local CharacterInfo: { TypeCharacterInfo } = {}
local PrevAtmosphere = {
	['Density'] = nil,
	['Offset'] = nil,
}
PrevAtmosphere.Density = Lighting.Atmosphere.Density
PrevAtmosphere.Offset = Lighting.Atmosphere.Offset


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


local function GetHumanoidRootPartCFrame(player: Player)
	local humanoid = player.Character:FindFirstChildOfClass('Humanoid')
	if humanoid then
		return humanoid.RootPart.CFrame
	end
end


local function CheckPosition()
	-- 모든 캐릭터의 HumanoidRootPart 위치를 1초에 한 번 확인
	-- 이전 위치와 현재 위치의 차가 설정의 Value 이하일 경우 데미지 부여
	for _, player: Player in pairs(Players:GetPlayers()) do
		if not player.Character then continue end
		-- ForceField가 존재할 때는 데미지 부여 안 함
		--local Found_ForceField = player.Character:FindFirstChildOfClass('ForceField')
		--if Found_ForceField then continue end

		if not CharacterInfo[player.UserId] then CharacterInfo[player.UserId] = {} end
		local prevCFrame = CharacterInfo[player.UserId].HRPPrevCFrame
		local currCFrame = GetHumanoidRootPartCFrame(player)

		if prevCFrame then
			local result: Vector3 = prevCFrame.Position - currCFrame.Position
			local resultX = math.abs(result.X)
			local resultY = math.abs(result.Y)
			local resultZ = math.abs(result.Z)
			CharacterInfo[player.UserId].HRPPrevCFrame = currCFrame
			if resultX >= GAP_POSITION_X then continue end
			if resultY >= GAP_POSITION_Y then continue end
			if resultZ >= GAP_POSITION_Z then continue end

			-- 지정한 갭 내에 있으면 데미지 부여
			player.Character.Humanoid.Health -= DAMAGE

		else

			CharacterInfo[player.UserId].HRPPrevCFrame = currCFrame
		end
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
		vCurrentPeriodicFunctionName.Value = script.Parent.Name
		if not USE_TWEEN_SERVICE then
			Lighting.Atmosphere.Density = ATMOSPHERE_DENSITY
			Lighting.Atmosphere.Offset = ATMOSPHERE_OFFSET

		else

			OnAtmosphere:Play()
		end
		REvtParticleEffect:FireAllClients(true, 'Effect-Snow')


		while true do
			task.wait()


			CheckPosition()
			task.wait(DAMAGE_COOL_TIME)


			if currentRunTime >= targetRunTime then
				StopTimer()
				vCurrentPeriodicFunctionName.Value = ''
				if not USE_TWEEN_SERVICE then
					Lighting.Atmosphere.Density = PrevAtmosphere.Density
					Lighting.Atmosphere.Offset = PrevAtmosphere.Offset

				else

					OffAtmosphere:Play()
				end
				REvtParticleEffect:FireAllClients(false, 'Effect-Snow')

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
Players.PlayerRemoving:Connect(function(player)
	if CharacterInfo[player.UserId] then CharacterInfo[player.UserId] = nil end
end)
----



return module
`