export const LuaCodeHeavySnow = `



--[[
 Script by bean7189
 이 스크립트 전체 내용은 bean7189에 의해서만 작성되었으며, bean7189 이외에 다른 사람에 의해 참고, 이용 등 유출될 수 없습니다.
]]



--// Services //--
local Players = game:GetService('Players')
local Debris = game:GetService('Debris')
----



--// Presetup //--

----



--// Types //--
type TypeBlockList = {
	['Instance']: BasePart,
	['OriginMaterial']: Enum.Material,
	['OriginPhysicalProperties']: PhysicalProperties,
}
----



--// Constants //--
local Config = script.Parent.Config
local RUN_TIME_MIN = Config.RunTimeMin.Value
local RUN_TIME_MAX = Config.RunTimeMax.Value
local DENSITY = Config.CustomPhysicalProperties.Density.Value
local ELASTICITY = Config.CustomPhysicalProperties.Elasticity.Value
local ELASTICITY_WEIGHT = Config.CustomPhysicalProperties.ElasticityWeight.Value
local FRICTION = Config.CustomPhysicalProperties.Friction.Value
local FRICTION_WEIGHT = Config.CustomPhysicalProperties.FrictionWeight.Value
----



--// Remotes / Bindables //--

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


local function RestoreBlocks()
	for _, BlockInfo: TypeBlockList in pairs(blockList) do
		BlockInfo.Instance.Material = BlockInfo.OriginMaterial
		local Density = BlockInfo.OriginPhysicalProperties.Density
		local Elasticity = BlockInfo.OriginPhysicalProperties.Elasticity
		local ElasticityWeight = BlockInfo.OriginPhysicalProperties.ElasticityWeight
		local Friction = BlockInfo.OriginPhysicalProperties.Friction
		local FrictionWeight = BlockInfo.OriginPhysicalProperties.FrictionWeight
		BlockInfo.Instance.CustomPhysicalProperties = PhysicalProperties.new(
			Density,
			Friction,
			Elasticity,
			FrictionWeight,
			ElasticityWeight
		)
	end
end


function module.Execute()
	--for _, player: Player in pairs(Players:GetPlayers()) do
	--	local message = Instance.new('Message')
	--	message.Parent = player:WaitForChild('PlayerGui')
	--	message.Text = script.Name
	--	Debris:AddItem(message, 5)
	--end


	for _, Block: BasePart in pairs(workspace:GetDescendants()) do
		if not Block:IsA('BasePart') then continue end
		local nameTable = string.split(Block.Name, '-')
		local isBlock = nameTable[1] == 'Block'
		if not isBlock then continue end


		local info: TypeBlockList = {}
		info.Instance = Block
		info.OriginMaterial = Block.Material
		info.OriginPhysicalProperties = {
			Density = Block.CurrentPhysicalProperties.Density,
			Elasticity = Block.CurrentPhysicalProperties.Elasticity,
			ElasticityWeight = Block.CurrentPhysicalProperties.ElasticityWeight,
			Friction = Block.CurrentPhysicalProperties.Friction,
			FrictionWeight = Block.CurrentPhysicalProperties.FrictionWeight,
		}
		table.insert(blockList, info)


		Block.Material = Enum.Material.Ice
		Block.CustomPhysicalProperties = PhysicalProperties.new(
			DENSITY,
			FRICTION,
			ELASTICITY,
			FRICTION_WEIGHT,
			ELASTICITY_WEIGHT
		)
	end


	task.spawn(function()
		targetRunTime = math.random(RUN_TIME_MIN, RUN_TIME_MAX)
		RunTimer()


		while true do
			task.wait()


			if currentRunTime >= targetRunTime then
				StopTimer()
				RestoreBlocks()

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