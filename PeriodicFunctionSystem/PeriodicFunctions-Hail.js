export const LuaCodeHail = `local module = {}



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
		REvtParticleEffect:FireAllClients(true, 'Effect-Hail')


		while true do
			task.wait()


			for _, player in pairs(Players:GetPlayers()) do
				local character = player.Character
				if not character then continue end
				local vInShelter: BoolValue = player:FindFirstChild('InShelter')
				if not vInShelter then warn('[Hail] Player does not have InShelter BoolValue') continue end
				if vInShelter.Value then continue end
				local vNoDamage: BoolValue = player:FindFirstChild('NoDamage')
				if not vNoDamage then warn('[Hail] Player does not have NoDamage BoolValue') continue end
				if vNoDamage.Value then continue end
				local Humanoid = character:FindFirstChildOfClass('Humanoid')
				if not Humanoid then continue end

				Humanoid.Health -= DAMAGE
			end
			task.wait(DAMAGE_COOL_TIME)


			if currentRunTime >= targetRunTime then
				StopTimer()
				REvtParticleEffect:FireAllClients(false, 'Effect-Hail')

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



return module
`